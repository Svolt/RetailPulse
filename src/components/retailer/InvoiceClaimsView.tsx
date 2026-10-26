import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Upload, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceClaim, ClaimStatus } from '../../types';

export const InvoiceClaimsView: React.FC = () => {
  const { invoices, setIsUploadModalOpen } = useApp();
  const [selectedClaim, setSelectedClaim] = useState<InvoiceClaim | null>(invoices[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2.5 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'needs_info':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3" /> Needs Info
          </span>
        );
      case 'duplicate_flagged':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#991B1B] bg-[#FEE2E2] px-2.5 py-0.5 rounded-md">
            <ShieldAlert className="w-3 h-3" /> Duplicate Match
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium text-[#697565] bg-[#F5F7F3] px-2.5 py-0.5 rounded-md uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Invoice Claims & OCR Audit
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Submit wholesale distributor invoices for automated line-item verification and instant loyalty points.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-xl border border-[#E5EAE1]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number or distributor..."
            className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          />
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-[#F5F7F3] rounded-lg">
          {[
            { id: 'all', label: 'All Claims' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending_review', label: 'Pending' },
            { id: 'needs_info', label: 'Needs Info' },
            { id: 'duplicate_flagged', label: 'Flagged' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id 
                  ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                  : 'text-[#697565] hover:text-[#172018]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Claim List + Selected Claim Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Claims Table / List */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] overflow-hidden shadow-2xs">
          <div className="divide-y divide-[#E5EAE1]">
            {filteredInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#697565]">
                No invoice claims match the selected criteria.
              </div>
            ) : (
              filteredInvoices.map((inv) => {
                const isSelected = selectedClaim?.id === inv.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedClaim(inv)}
                    className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? 'bg-[#F5F7F3] border-l-3 border-[#153B2B]' : 'hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172018]">{inv.invoiceNumber}</span>
                          {getStatusBadge(inv.status)}
                        </div>
                        <div className="text-xs text-[#697565] truncate mt-0.5">
                          {inv.supplierName}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] font-tabular mt-1">
                          Submitted: {inv.submissionDate} · OCR: {inv.ocrConfidence}%
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#172018] font-tabular">
                        ₹{inv.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-semibold text-[#16A34A] font-tabular mt-0.5">
                        +{inv.calculatedPoints.toLocaleString()} Pts
                      </div>
                      <div className="text-[10px] text-[#697565]">
                        {inv.lineItems.length} lines
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Claim Detail Inspector */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-5 sticky top-20">
          {selectedClaim ? (
            <>
              {/* Claim Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E5EAE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#172018]">
                      {selectedClaim.invoiceNumber}
                    </h2>
                    {getStatusBadge(selectedClaim.status)}
                  </div>
                  <p className="text-xs text-[#697565] mt-1">
                    Supplier: {selectedClaim.supplierName}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] font-tabular">
                    Invoice Date: {selectedClaim.invoiceDate} · Submitted: {selectedClaim.submissionDate}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#697565]">Calculated Reward</div>
                  <div className="text-lg font-bold text-[#16A34A] font-tabular">
                    +{selectedClaim.calculatedPoints.toLocaleString()} Pts
                  </div>
                </div>
              </div>

              {/* Review / OCR Notes Callout */}
              {selectedClaim.reviewNotes && (
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] text-xs">
                  <div className="font-semibold text-[#172018] mb-0.5">
                    Audit & Review Notes:
                  </div>
                  <p className="text-[#697565] leading-relaxed">
                    {selectedClaim.reviewNotes}
                  </p>
                  {selectedClaim.reviewedBy && (
                    <div className="text-[10px] text-[#94A3B8] mt-1 font-tabular">
                      Verified by: {selectedClaim.reviewedBy}
                    </div>
                  )}
                </div>
              )}

              {/* Line Items Breakdown */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#172018] mb-2">
                  <span>Audited Line Items ({selectedClaim.lineItems.length})</span>
                  <span>Amount / Points</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedClaim.lineItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-2.5 rounded-lg border text-xs ${
                        item.isEligible ? 'bg-[#FFFFFF] border-[#E5EAE1]' : 'bg-[#FEF2F2] border-[#FECACA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-[#172018] truncate">
                            {item.productName}
                          </div>
                          <div className="text-[10px] text-[#697565] font-tabular mt-0.5">
                            SKU: {item.sku} · Qty: {item.quantity} × ₹{item.unitPrice}
                          </div>
                          {!item.isEligible && (
                            <div className="text-[10px] text-[#DC2626] font-medium mt-1">
                              ⚠ {item.rejectionReason}
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-bold text-[#172018] font-tabular">
                            ₹{item.total.toLocaleString()}
                          </div>
                          {item.isEligible && (
                            <div className="text-[10px] font-semibold text-[#16A34A] font-tabular">
                              +{item.pointsCalculated} Pts
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals Reconciliation */}
              <div className="p-3 bg-[#F5F7F3] rounded-xl space-y-1.5 text-xs font-tabular">
                <div className="flex items-center justify-between text-[#697565]">
                  <span>Total Invoiced Gross:</span>
                  <span>₹{selectedClaim.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#153B2B] font-semibold">
                  <span>Eligible Brand Purchase:</span>
                  <span>₹{selectedClaim.eligibleAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#16A34A] font-bold pt-1 border-t border-[#E5EAE1]">
                  <span>Points Credited (2.5% Rate):</span>
                  <span>+{selectedClaim.calculatedPoints.toLocaleString()} Points</span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedClaim.status === 'needs_info' && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#C8F43D] text-[#153B2B] font-bold text-xs rounded-xl shadow-xs hover:bg-[#BBE832] transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Re-upload Document Proof</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-xs text-[#697565]">
              Select an invoice claim to inspect line items and OCR confidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
