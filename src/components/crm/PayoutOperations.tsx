import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PayoutRecord } from '../../types';

export const PayoutOperations: React.FC = () => {
  const { payouts, processPayoutBatch } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchActionSuccess, setBatchActionSuccess] = useState<string | null>(null);

  const pendingPayouts = payouts.filter(p => p.status === 'approved' || p.status === 'requested');
  const paidPayouts = payouts.filter(p => p.status === 'paid');

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pendingPayouts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingPayouts.map(p => p.id));
    }
  };

  const handleExecuteSettlement = () => {
    if (selectedIds.length === 0) return;
    processPayoutBatch(selectedIds, 'pay');
    setBatchActionSuccess(`Executed settlement for ${selectedIds.length} payout claims! Generated bank UTR references.`);
    setSelectedIds([]);
    setTimeout(() => setBatchActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">Finance Operations</span>
            <span>·</span>
            <span className="text-[#16A34A] font-semibold">IMPS / UPI Batch Gateway</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Cash Redemption & Bank Settlement Console
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Authorize retailer payout batches, generate immutable UTR banking records, and audit TDS tax deductions.
          </p>
        </div>

        {/* Batch Action Button */}
        {selectedIds.length > 0 && (
          <button
            onClick={handleExecuteSettlement}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Settle Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {batchActionSuccess && (
        <div className="p-3.5 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{batchActionSuccess}</span>
        </div>
      )}

      {/* Summary KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <span className="text-xs font-semibold text-[#697565] uppercase tracking-wider">Awaiting Settlement</span>
          <div className="text-2xl font-bold text-[#D97706] font-tabular mt-1">
            ₹{pendingPayouts.reduce((acc, p) => acc + p.netAmount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-[#697565] mt-1 pt-1 border-t border-[#F5F7F3]">
            {pendingPayouts.length} Queued Batch Requests
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <span className="text-xs font-semibold text-[#697565] uppercase tracking-wider">Disbursed to Date</span>
          <div className="text-2xl font-bold text-[#16A34A] font-tabular mt-1">
            ₹{paidPayouts.reduce((acc, p) => acc + p.netAmount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-[#16A34A] font-medium mt-1 pt-1 border-t border-[#F5F7F3] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Reconciled
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <span className="text-xs font-semibold text-[#697565] uppercase tracking-wider">TDS Withheld (194H)</span>
          <div className="text-2xl font-bold text-[#172018] font-tabular mt-1">
            ₹{payouts.reduce((acc, p) => acc + p.deductionsTds, 0).toLocaleString()}
          </div>
          <div className="text-xs text-[#697565] mt-1 pt-1 border-t border-[#F5F7F3]">
            Tax Challan Batch Ready
          </div>
        </div>
      </div>

      {/* Pending Batch Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E5EAE1] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172018]">Pending Payout Verification Queue</h2>
            <p className="text-xs text-[#697565]">Select items to execute bulk IMPS/UPI bank transfers</p>
          </div>
          {pendingPayouts.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer"
            >
              {selectedIds.length === pendingPayouts.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === pendingPayouts.length}
                    onChange={handleSelectAll}
                    className="rounded text-[#153B2B]"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Payout ID / Date</th>
                <th className="py-3 px-4 font-semibold">Retailer / Store</th>
                <th className="py-3 px-4 font-semibold text-right">Points</th>
                <th className="py-3 px-4 font-semibold text-right">Gross (INR)</th>
                <th className="py-3 px-4 font-semibold text-right">Net Payout</th>
                <th className="py-3 px-4 font-semibold">Destination Account</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {pendingPayouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#697565]">
                    No pending payouts awaiting batch settlement.
                  </td>
                </tr>
              ) : (
                pendingPayouts.map(pay => {
                  const isChecked = selectedIds.includes(pay.id);
                  return (
                    <tr key={pay.id} className={`hover:bg-[#FAFBF9] ${isChecked ? 'bg-[#F5F7F3]' : ''}`}>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(pay.id)}
                          className="rounded text-[#153B2B]"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#172018]">{pay.payoutNumber}</div>
                        <div className="text-[10px] text-[#697565] font-tabular">{pay.requestedDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#172018]">{pay.retailerName}</div>
                        <div className="text-[10px] text-[#697565]">{pay.storeCode}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-tabular text-[#697565]">
                        {pay.pointsRedeemed.toLocaleString()} Pts
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#172018] font-tabular">
                        ₹{pay.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#153B2B] font-tabular text-sm">
                        ₹{pay.netAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#172018]">{pay.destination}</div>
                        <div className="text-[10px] text-[#94A3B8] uppercase">{pay.destinationType}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => processPayoutBatch([pay.id], 'pay')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-lg cursor-pointer"
                        >
                          Settle Now
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
