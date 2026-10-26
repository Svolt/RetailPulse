import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Receipt, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Calculator,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LedgerEvent } from '../../types';

export const PointsWalletView: React.FC = () => {
  const { currentStore, ledgerEvents, setActiveNav, setIsUploadModalOpen } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<LedgerEvent | null>(null);

  // Cash converter state
  const [calcPoints, setCalcPoints] = useState<number>(currentStore.availablePoints);
  const [calcCash, setCalcCash] = useState<number>(currentStore.availablePoints * currentStore.cashEquivalentRate);

  const handlePointsChange = (pts: number) => {
    setCalcPoints(pts);
    setCalcCash(pts * currentStore.cashEquivalentRate);
  };

  const handleCashChange = (cash: number) => {
    setCalcCash(cash);
    setCalcPoints(Math.round(cash / currentStore.cashEquivalentRate));
  };

  const filteredEvents = ledgerEvents.filter(evt => {
    if (filterType === 'all') return true;
    if (filterType === 'earned') return evt.points > 0;
    if (filterType === 'redeemed') return evt.points < 0;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Points Wallet & Financial Ledger
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Immutable, audit-grade record of loyalty points credited via invoice claims, campaigns, and redemptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('rewards')}
            className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            Redeem Points
          </button>
        </div>
      </div>

      {/* 4 Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Points */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Available Balance
          </div>
          <div className="text-2xl font-bold text-[#172018] font-tabular">
            {currentStore.availablePoints.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
          </div>
          <div className="text-xs text-[#153B2B] font-semibold font-tabular mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            ≈ ₹{(currentStore.availablePoints * currentStore.cashEquivalentRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} Net Cash
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Pending Claims
          </div>
          <div className="text-2xl font-bold text-[#D97706] font-tabular">
            {currentStore.pendingPoints.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
          </div>
          <div className="text-xs text-[#697565] font-tabular mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            Unlocks on OCR & Ops approval
          </div>
        </div>

        {/* Total Redeemed */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Total Redeemed
          </div>
          <div className="text-2xl font-bold text-[#172018] font-tabular">
            {currentStore.redeemedPoints.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
          </div>
          <div className="text-xs text-[#697565] font-tabular mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            Vouchers, gifts & cash payouts
          </div>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#697565] mb-2">
            Lifetime Earned
          </div>
          <div className="text-2xl font-bold text-[#153B2B] font-tabular">
            {currentStore.lifetimePoints.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
          </div>
          <div className="text-xs text-[#16A34A] font-semibold mt-1.5 pt-1.5 border-t border-[#F5F7F3]">
            Tier: {currentStore.tier} Member
          </div>
        </div>
      </div>

      {/* Two-Column Utility: Interactive Points-to-Cash Converter + Points Expiry Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Converter Tool */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#153B2B]" />
            <h2 className="text-sm font-bold text-[#172018]">
              Points to Cash Valuation Simulator
            </h2>
          </div>
          <p className="text-xs text-[#697565]">
            Configured earn conversion rate: 1 Loyalty Point = ₹{currentStore.cashEquivalentRate.toFixed(2)} (4 Points = ₹1.00). Instant IMPS/UPI bank settlement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1]">
              <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                Loyalty Points
              </label>
              <input
                type="number"
                value={calcPoints}
                onChange={(e) => handlePointsChange(Number(e.target.value))}
                className="w-full text-base font-bold font-tabular text-[#172018] bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#EAEFE6] rounded-xl border border-[#DDE4D8]">
              <label className="block text-[11px] font-semibold text-[#153B2B] uppercase tracking-wider mb-1">
                Cash Equivalent (INR)
              </label>
              <input
                type="number"
                value={calcCash}
                onChange={(e) => handleCashChange(Number(e.target.value))}
                className="w-full text-base font-bold font-tabular text-[#153B2B] bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#697565]">
              Max redeemable balance today: ₹{(currentStore.availablePoints * currentStore.cashEquivalentRate).toFixed(2)}
            </span>
            <button
              onClick={() => setActiveNav('rewards')}
              className="text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer"
            >
              Transfer Cash to Bank Now →
            </button>
          </div>
        </div>

        {/* Expiry Planner */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172018]">Points Expiry Schedule</h2>
            <span className="text-[10px] text-[#697565] font-semibold uppercase">12-Month Expiry Rule</span>
          </div>
          <p className="text-xs text-[#697565]">
            Standard base points remain valid for 365 days from issue date. Promotional campaign points have specific validity.
          </p>

          <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172018]">15 Nov 2026</span>
              <span className="font-bold text-[#D97706] font-tabular">1,500 Pts (Festive Bonus)</span>
            </div>
            <div className="text-[11px] text-[#697565]">
              Expires in 21 days unless redeemed for vouchers or cash transfer.
            </div>
          </div>

          <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172018]">31 Dec 2026</span>
              <span className="font-bold text-[#16A34A] font-tabular">26,950 Pts (Standard Points)</span>
            </div>
            <div className="text-[11px] text-[#697565]">
              Normal annual roll-over. 100% eligible for gift catalog orders.
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table with Filter Controls */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#E5EAE1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#172018]">
              Append-Only Transaction Ledger
            </h2>
            <p className="text-xs text-[#697565]">
              {filteredEvents.length} recorded events reconciled against system balance.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F5F7F3] p-1 rounded-lg">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'earned', label: 'Credits (+)' },
              { id: 'redeemed', label: 'Debits (−)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterType === tab.id 
                    ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                    : 'text-[#697565] hover:text-[#172018]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">Date & Event ID</th>
                <th className="py-3 px-4 font-semibold">Event Description</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold text-right">Points Delta</th>
                <th className="py-3 px-4 font-semibold text-right">Balance After</th>
                <th className="py-3 px-4 font-semibold">Status / Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {filteredEvents.map(evt => {
                const isCredit = evt.points > 0;
                return (
                  <tr 
                    key={evt.id} 
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-[#FAFBF9] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#172018] font-tabular">{evt.timestamp}</div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">{evt.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#172018]">{evt.description}</div>
                      <div className="text-[10px] text-[#697565]">Actor: {evt.actor}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] bg-[#F5F7F3] px-2 py-0.5 rounded text-[#3E4A3D]">
                        {evt.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold font-tabular text-sm ${
                      isCredit ? 'text-[#16A34A]' : 'text-[#172018]'
                    }`}>
                      {isCredit ? '+' : ''}{evt.points.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#172018] font-tabular">
                      {evt.balanceAfter.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Settled</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">
                        {evt.ruleVersion || 'v4.0'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
