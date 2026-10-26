import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Search,
  Building,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentsView: React.FC = () => {
  const { payouts, currentStore, setActiveNav } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.netAmount, 0);
  const totalPending = payouts.filter(p => p.status === 'approved' || p.status === 'requested').reduce((acc, p) => acc + p.netAmount, 0);
  const totalLifetimeEarned = totalPaid + totalPending;

  const filteredPayouts = payouts.filter(p => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch = p.payoutNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.utrReference && p.utrReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Payout ID,Store Code,Points Redeemed,Gross (INR),TDS Deduction (INR),Net Amount (INR),Status,Destination,Requested Date,UTR Reference\n';
    const rows = payouts.map(p => 
      `"${p.payoutNumber}","${p.storeCode}",${p.pointsRedeemed},${p.grossAmount},${p.deductionsTds},${p.netAmount},"${p.status}","${p.destination}","${p.requestedDate}","${p.utrReference || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `loyalty_payouts_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Bank Payments & Payout Statements
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Verified direct cash disbursements via IMPS & UPI for loyalty redemption. Reconciled with GST bookkeeping.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#153B2B]" />
            <span>Export Statement (CSV)</span>
          </button>
        </div>
      </div>

      {/* Payout Summary Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earned */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Total Payout Earned
          </div>
          <div className="text-2xl font-bold text-[#172018] font-tabular">
            ₹{totalLifetimeEarned.toLocaleString()}
          </div>
          <div className="text-xs text-[#697565] mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            Gross loyalty incentive claims
          </div>
        </div>

        {/* Paid / Received */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Paid & Received
          </div>
          <div className="text-2xl font-bold text-[#16A34A] font-tabular">
            ₹{totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-[#16A34A] font-medium mt-1.5 pt-1.5 border-t border-[#F5F7F3] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Settled with Bank UTR
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Pending / In Batch
          </div>
          <div className="text-2xl font-bold text-[#D97706] font-tabular">
            ₹{totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-[#697565] mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            Finance batch execution queue
          </div>
        </div>
      </div>

      {/* Verified Destination Accounts Banner */}
      <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-[#E5EAE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center font-bold shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#172018]">
              Verified Bank Destination: {currentStore.bankAccountMasked}
            </div>
            <div className="text-[11px] text-[#697565]">
              UPI ID: {currentStore.upiIdMasked} · Beneficiary: {currentStore.ownerName}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveNav('profile')}
          className="text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer self-start sm:self-auto"
        >
          Manage Payout Accounts →
        </button>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-[#E5EAE1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payout ID or UTR number..."
              className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-9 pr-3 py-1.5 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F5F7F3] p-1 rounded-lg">
            {[
              { id: 'all', label: 'All Payouts' },
              { id: 'paid', label: 'Paid' },
              { id: 'approved', label: 'In Progress' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
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

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">Payout ID / Date</th>
                <th className="py-3 px-4 font-semibold">Redeemed Points</th>
                <th className="py-3 px-4 font-semibold text-right">Gross Amount</th>
                <th className="py-3 px-4 font-semibold text-right">TDS (1%)</th>
                <th className="py-3 px-4 font-semibold text-right">Net Amount</th>
                <th className="py-3 px-4 font-semibold">Destination Account</th>
                <th className="py-3 px-4 font-semibold">Status / UTR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {filteredPayouts.map(pay => (
                <tr key={pay.id} className="hover:bg-[#FAFBF9] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#172018]">{pay.payoutNumber}</div>
                    <div className="text-[10px] text-[#697565] font-tabular">{pay.requestedDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-tabular text-[#697565]">
                    {pay.pointsRedeemed.toLocaleString()} Pts
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#172018] font-tabular">
                    ₹{pay.grossAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-tabular text-[#697565]">
                    {pay.deductionsTds > 0 ? `₹${pay.deductionsTds}` : '₹0'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#153B2B] font-tabular text-sm">
                    ₹{pay.netAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#172018] truncate max-w-xs">{pay.destination}</div>
                    <div className="text-[10px] text-[#94A3B8] uppercase">{pay.destinationType} Transfer</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {pay.status === 'paid' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                        <div className="text-[10px] text-[#697565] font-mono mt-0.5">
                          UTR: {pay.utrReference}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
