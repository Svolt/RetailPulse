import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceClaim, ClaimStatus } from '../../types';

export const ClaimsReviewQueue: React.FC = () => {
  const { invoices, reviewClaim, setActiveNav } = useApp();
  const [selectedClaimId, setSelectedClaimId] = useState<string>(invoices[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const selectedClaim = invoices.find(c => c.id === selectedClaimId) || invoices[0];

  const filteredClaims = invoices.filter(c => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return c.status === 'pending_review' || c.status === 'needs_info';
    return c.status === filterStatus;
  });

  const handleApprove = () => {
    if (!selectedClaim) return;
    reviewClaim(selectedClaim.id, 'approved', 'Verified and approved via Operations Review Console.');
  };

  const handleReject = () => {
    if (!selectedClaim) return;
    reviewClaim(selectedClaim.id, 'rejected', rejectReason || 'Non-compliant distributor invoice or ineligible line item.');
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleNeedsInfo = () => {
    if (!selectedClaim) return;
    reviewClaim(selectedClaim.id, 'needs_info', 'Distributor GSTIN obscured or blurred. Requested clean document proof.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">Claims Review Workbench</span>
            <span>·</span>
            <span className="text-[#D97706] font-semibold">
              {invoices.filter(i => i.status === 'pending_review').length} Invoices Awaiting Decision
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Operations Claim Audit & OCR Split Console
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Audit extracted line items against wholesale catalogs, resolve duplicate flags, and authorize reward points ledger credits.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F5F7F3] p-1 rounded-xl border border-[#E5EAE1]">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Needs Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterStatus === tab.id 
                  ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                  : 'text-[#697565] hover:text-[#172018]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Screen Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Claims Queue List */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-[#E5EAE1] bg-[#FAFBF9] flex items-center justify-between text-xs">
            <span className="font-bold text-[#172018]">Audit Queue</span>
            <span className="text-[11px] text-[#697565]">{filteredClaims.length} Claims</span>
          </div>

          <div className="divide-y divide-[#E5EAE1] max-h-[640px] overflow-y-auto">
            {filteredClaims.map(claim => {
              const isSelected = selectedClaim?.id === claim.id;
              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`p-3.5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F5F7F3] border-l-3 border-[#153B2B]' : 'hover:bg-[#FAFBF9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#172018]">{claim.invoiceNumber}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      claim.status === 'approved' ? 'bg-[#EAF7EE] text-[#16A34A]' :
                      claim.status === 'needs_info' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      claim.status === 'duplicate_flagged' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                      'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-[#697565] truncate font-medium">
                    {claim.retailerName}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-tabular">
                    Supplier: {claim.supplierName} · ₹{claim.totalAmount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Split Document Inspector & Decision Console */}
        <div className="lg:col-span-8 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-5">
          {selectedClaim ? (
            <>
              {/* Header with Claim Details & OCR Quality */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#172018]">
                      {selectedClaim.invoiceNumber}
                    </h2>
                    <span className="font-mono text-xs text-[#697565]">({selectedClaim.id})</span>
                  </div>
                  <p className="text-xs text-[#697565] mt-0.5">
                    Retailer: <span className="font-semibold text-[#172018]">{selectedClaim.retailerName}</span> · Supplier: {selectedClaim.supplierName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#697565] uppercase">OCR Confidence</div>
                    <div className="text-sm font-bold text-[#16A34A] font-tabular">
                      {selectedClaim.ocrConfidence}% Match
                    </div>
                  </div>
                  <div className="text-right pl-3 border-l border-[#E5EAE1]">
                    <div className="text-[10px] text-[#697565] uppercase">Calculated Reward</div>
                    <div className="text-sm font-bold text-[#153B2B] font-tabular">
                      +{selectedClaim.calculatedPoints.toLocaleString()} Pts
                    </div>
                  </div>
                </div>
              </div>

              {/* Duplicate / Risk Alert */}
              {selectedClaim.status === 'duplicate_flagged' && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3 text-xs text-[#991B1B]">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-[#DC2626]" />
                  <div>
                    <span className="font-bold">Duplicate Hash Match:</span> Exact invoice identifier collision detected with existing claim {selectedClaim.duplicateMatchId}. High risk of duplicate loyalty credit.
                  </div>
                </div>
              )}

              {/* Document Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAFBF9] p-3 rounded-xl border border-[#E5EAE1] font-tabular">
                <div>
                  <span className="text-[#697565] block text-[10px]">Invoice Date:</span>
                  <span className="font-semibold text-[#172018]">{selectedClaim.invoiceDate}</span>
                </div>
                <div>
                  <span className="text-[#697565] block text-[10px]">Submission Time:</span>
                  <span className="font-semibold text-[#172018]">{selectedClaim.submissionDate}</span>
                </div>
                <div>
                  <span className="text-[#697565] block text-[10px]">Gross Invoiced:</span>
                  <span className="font-bold text-[#172018]">₹{selectedClaim.totalAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#697565] block text-[10px]">Eligible Net:</span>
                  <span className="font-bold text-[#153B2B]">₹{selectedClaim.eligibleAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Line Items Audit Grid */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#172018] mb-2">
                  <span>Extracted Invoice Line Items ({selectedClaim.lineItems.length})</span>
                  <span>Calculated Loyalty Points</span>
                </div>

                <div className="border border-[#E5EAE1] rounded-xl overflow-hidden divide-y divide-[#E5EAE1] text-xs">
                  {selectedClaim.lineItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-3 flex items-center justify-between gap-3 ${
                        item.isEligible ? 'bg-[#FFFFFF]' : 'bg-[#FEF2F2]/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#697565]">{item.sku}</span>
                          <span className="font-semibold text-[#172018] truncate">{item.productName}</span>
                        </div>
                        <div className="text-[11px] text-[#697565] mt-0.5 font-tabular">
                          Brand: {item.brand} · Qty: {item.quantity} · Price: ₹{item.unitPrice} · Total: ₹{item.total.toLocaleString()}
                        </div>
                        {!item.isEligible && (
                          <div className="text-[10px] text-[#DC2626] font-medium mt-1">
                            ✕ {item.rejectionReason}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-bold font-tabular ${
                          item.isEligible ? 'text-[#16A34A]' : 'text-[#94A3B8]'
                        }`}>
                          {item.isEligible ? `+${item.pointsCalculated} Pts` : '0 Pts'}
                        </div>
                        <div className="text-[10px] text-[#697565]">
                          {item.isEligible ? '2.5% Wholesale' : 'Ineligible'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Decision Action Bar */}
              <div className="pt-4 border-t border-[#E5EAE1] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#697565]">
                  Status: <span className="font-bold text-[#172018] capitalize">{selectedClaim.status.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNeedsInfo}
                    className="px-3 py-1.5 text-xs font-semibold text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-xl transition-colors cursor-pointer"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-xl transition-colors cursor-pointer"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={selectedClaim.status === 'approved'}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      selectedClaim.status === 'approved' 
                        ? 'bg-[#EAF7EE] text-[#16A34A] cursor-not-allowed' 
                        : 'bg-[#C8F43D] text-[#153B2B] hover:bg-[#BBE832]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedClaim.status === 'approved' ? 'Already Approved' : 'Approve & Credit Points'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#697565]">
              No claims selected.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl p-6 shadow-2xl border border-[#E5EAE1] space-y-4">
            <h3 className="text-sm font-bold text-[#172018]">Reject Invoice Claim</h3>
            <p className="text-xs text-[#697565]">
              Please state the mandatory reason for rejection. This will be transmitted to the retailer.
            </p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate invoice, distributor mismatch, or ineligible non-electrical hardware items..."
              className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-3 text-[#172018] focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs text-[#697565]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs font-bold text-[#FFFFFF] bg-[#DC2626] rounded-xl cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
