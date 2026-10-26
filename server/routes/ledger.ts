import { Router, Response } from 'express';
import { db, LedgerEvent } from '../db';
import { AuthenticatedRequest, authenticate, requirePermission } from '../auth';

const router = Router();
router.use(authenticate);

// GET /api/ledger - List ledger events
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const { storeId, type, filter } = req.query;

  let events = [...db.ledger];

  if (req.user!.role === 'Retailer') {
    events = events.filter(e => req.user!.storeIds.includes(e.retailerId));
  } else if (storeId && storeId !== 'all') {
    events = events.filter(e => e.retailerId === storeId);
  }

  if (filter === 'earned') {
    events = events.filter(e => e.points > 0);
  } else if (filter === 'redeemed') {
    events = events.filter(e => e.points < 0);
  }

  if (type && type !== 'all') {
    events = events.filter(e => e.type === type);
  }

  return res.json({ events });
});

// POST /api/ledger/adjust - Manual administrative ledger adjustment
router.post('/adjust', requirePermission('ledger:adjust'), (req: AuthenticatedRequest, res: Response) => {
  const { storeId, pointsDelta, reason, evidenceReference } = req.body;

  if (!storeId || pointsDelta === undefined || !reason) {
    return res.status(400).json({ error: 'Store ID, signed points delta, and audit reason are required.' });
  }

  const store = db.stores.find(s => s.id === storeId);
  if (!store) {
    return res.status(404).json({ error: 'Store not found.' });
  }

  const delta = Number(pointsDelta);
  if (isNaN(delta) || delta === 0) {
    return res.status(400).json({ error: 'Points delta must be a non-zero integer.' });
  }

  if (delta < 0 && store.availablePoints + delta < 0) {
    return res.status(400).json({ 
      error: `Adjustment would cause negative balance. Current: ${store.availablePoints}, Delta: ${delta}` 
    });
  }

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  store.availablePoints += delta;
  if (delta > 0) store.lifetimePoints += delta;

  const adjustmentEvent: LedgerEvent = {
    id: `ldg-adj-${Date.now()}`,
    timestamp: nowStr,
    retailerId: store.id,
    type: 'ADMIN_ADJUSTMENT',
    description: `Manual adjustment: ${reason} (Ref: ${evidenceReference || 'N/A'})`,
    referenceId: `adj-${Date.now()}`,
    points: delta,
    balanceAfter: store.availablePoints,
    status: 'settled',
    ruleVersion: 'v4.0-manual-override',
    actor: `${req.user!.name} (${req.user!.role})`
  };

  db.ledger.unshift(adjustmentEvent);

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'MANUAL_LEDGER_ADJUSTMENT',
    `${store.code} (${store.name})`,
    `Points Delta: ${delta > 0 ? '+' : ''}${delta}, New Balance: ${store.availablePoints}, Reason: ${reason}`,
    req.ip || '127.0.0.1'
  );

  return res.status(201).json({
    success: true,
    event: adjustmentEvent,
    newBalance: store.availablePoints
  });
});

export default router;
