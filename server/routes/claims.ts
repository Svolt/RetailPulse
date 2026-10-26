import { Router, Response } from 'express';
import { db, InvoiceClaim, LedgerEvent, ClaimStatus } from '../db';
import { AuthenticatedRequest, authenticate, requirePermission, enforceTenantAccess } from '../auth';

const router = Router();
router.use(authenticate);

// GET /api/claims - List claims
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const { storeId, status, query } = req.query;

  let claims = [...db.invoices];

  // Tenant isolation: retailers can only see their assigned stores
  if (req.user!.role === 'Retailer') {
    claims = claims.filter(c => req.user!.storeIds.includes(c.retailerId));
  } else if (storeId && storeId !== 'all') {
    claims = claims.filter(c => c.retailerId === storeId);
  }

  if (status && status !== 'all') {
    claims = claims.filter(c => c.status === status);
  }

  if (query) {
    const q = String(query).toLowerCase();
    claims = claims.filter(c => 
      c.invoiceNumber.toLowerCase().includes(q) ||
      c.supplierName.toLowerCase().includes(q) ||
      c.retailerName.toLowerCase().includes(q)
    );
  }

  return res.json({ claims });
});

// POST /api/claims - Submit claim (Retailer or Ops)
router.post('/', requirePermission('claims:submit'), (req: AuthenticatedRequest, res: Response) => {
  const { invoiceNumber, supplierName, invoiceDate, totalAmount, eligibleAmount, lineItems, retailerId } = req.body;

  const targetStoreId = retailerId || req.user!.storeIds[0] || 'store-1';
  if (!enforceTenantAccess(req, targetStoreId)) {
    return res.status(403).json({ error: 'Tenant Violation: Cannot submit invoice for an unassigned store.' });
  }

  const store = db.stores.find(s => s.id === targetStoreId);
  if (!store) {
    return res.status(404).json({ error: 'Target retailer store not found.' });
  }

  // Duplicate check
  const duplicate = db.invoices.find(i => 
    i.invoiceNumber.toLowerCase() === (invoiceNumber || '').toLowerCase()
  );

  const finalGross = Number(totalAmount) || 0;
  const finalEligible = Number(eligibleAmount) || finalGross;
  // Authoritative server calculation: 2.5% standard wholesale earn rate
  const calculatedPts = Math.round(finalEligible * 0.025);

  const now = new Date();
  const submissionDate = now.toISOString().replace('T', ' ').substring(0, 16);

  const newClaim: InvoiceClaim = {
    id: `inv-claim-${Date.now()}`,
    invoiceNumber: invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    retailerId: store.id,
    retailerName: store.name,
    supplierName: supplierName || 'Reliance Trade Logistics Ltd',
    invoiceDate: invoiceDate || now.toISOString().substring(0, 10),
    submissionDate,
    totalAmount: finalGross,
    eligibleAmount: finalEligible,
    calculatedPoints: calculatedPts,
    status: duplicate ? 'duplicate_flagged' : 'pending_review',
    ocrConfidence: duplicate ? 72 : 96,
    fileUrl: '/assets/sample_invoice_1.pdf',
    fileName: `invoice_${invoiceNumber || 'scan'}.pdf`,
    lineItems: Array.isArray(lineItems) ? lineItems : [],
    duplicateMatchId: duplicate?.id,
    reviewNotes: duplicate ? `Collision detected with historical claim ${duplicate.invoiceNumber}` : 'Submitted for OCR verification'
  };

  db.invoices.unshift(newClaim);

  // If not duplicate, update pending points
  if (!duplicate) {
    store.pendingPoints += calculatedPts;
  }

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'SUBMIT_INVOICE_CLAIM',
    newClaim.invoiceNumber,
    `Gross: ₹${finalGross.toLocaleString()}, Calculated Points: ${calculatedPts}, Status: ${newClaim.status}`,
    req.ip || '127.0.0.1'
  );

  return res.status(201).json({ claim: newClaim });
});

// POST /api/claims/:id/decide - Review & decide claim
router.post('/:id/decide', requirePermission('claims:approve'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, reviewNotes, approvedAmount } = req.body;

  const validDecisions: ClaimStatus[] = ['approved', 'partially_approved', 'rejected', 'needs_info'];
  if (!validDecisions.includes(status)) {
    return res.status(400).json({ error: `Invalid decision status. Must be one of: ${validDecisions.join(', ')}` });
  }

  const claim = db.invoices.find(c => c.id === id);
  if (!claim) {
    return res.status(404).json({ error: 'Invoice claim not found.' });
  }

  if (claim.status === 'approved') {
    return res.status(400).json({ error: 'Claim has already been approved and settled in ledger.' });
  }

  const store = db.stores.find(s => s.id === claim.retailerId);
  if (!store) {
    return res.status(404).json({ error: 'Retailer store associated with claim not found.' });
  }

  const finalEligible = approvedAmount !== undefined ? Number(approvedAmount) : claim.eligibleAmount;
  // Authoritative server earn calculation
  const finalPoints = Math.round(finalEligible * 0.025);
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  claim.status = status;
  claim.eligibleAmount = finalEligible;
  claim.calculatedPoints = finalPoints;
  claim.reviewedBy = `${req.user!.name} (${req.user!.role})`;
  claim.reviewNotes = reviewNotes || claim.reviewNotes;
  claim.decisionDate = nowStr;

  if (status === 'approved' || status === 'partially_approved') {
    // Atomically increment available points & adjust pending
    store.availablePoints += finalPoints;
    store.pendingPoints = Math.max(0, store.pendingPoints - claim.calculatedPoints);
    store.lifetimePoints += finalPoints;

    // Append-only ledger transaction
    const newLedgerEvent: LedgerEvent = {
      id: `ldg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      retailerId: store.id,
      type: 'INVOICE_CLAIM_APPROVED',
      description: `Claim ${claim.invoiceNumber} approved (${claim.supplierName})`,
      referenceId: claim.id,
      points: finalPoints,
      balanceAfter: store.availablePoints,
      status: 'settled',
      ruleVersion: 'v4.2-2026Q4',
      actor: `${req.user!.name} (${req.user!.role})`
    };
    db.ledger.unshift(newLedgerEvent);

    // Update performance
    db.performance.achievedSales += finalEligible;
    db.performance.remainingTarget = Math.max(0, db.performance.targetSales - db.performance.achievedSales);
    db.performance.achievementPercentage = Math.min(100, Math.round((db.performance.achievedSales / db.performance.targetSales) * 100));
    db.performance.pointsEarned += finalPoints;
  } else if (status === 'rejected') {
    store.pendingPoints = Math.max(0, store.pendingPoints - claim.calculatedPoints);
  }

  db.logAudit(
    req.user!.name,
    req.user!.role,
    `CLAIM_DECISION_${status.toUpperCase()}`,
    `${claim.invoiceNumber} (Retailer: ${store.code})`,
    `Points: ${finalPoints}, Notes: ${reviewNotes || 'None'}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    claim,
    storePoints: {
      available: store.availablePoints,
      pending: store.pendingPoints,
      lifetime: store.lifetimePoints
    }
  });
});

export default router;
