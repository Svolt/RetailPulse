import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Gift, 
  CreditCard, 
  Upload, 
  X, 
  ArrowRight,
  TrendingUp,
  Store,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveNav, 
    setIsUploadModalOpen, 
    invoices, 
    rewards,
    payouts
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
    inv.supplierName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredRewards = rewards.filter(rew => 
    rew.title.toLowerCase().includes(query.toLowerCase()) ||
    rew.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredPayouts = payouts.filter(p => 
    p.payoutNumber.toLowerCase().includes(query.toLowerCase()) ||
    (p.utrReference && p.utrReference.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 2);

  const runAction = (callback: () => void) => {
    callback();
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5EAE1]">
          <Search className="w-5 h-5 text-[#697565]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice number, voucher, payout UTR, or action..."
            className="flex-1 text-sm text-[#172018] placeholder-[#94A3B8] focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#697565] hover:text-[#172018] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F5F7F3] border border-[#DDE4D8] rounded text-[#697565]">
            ESC
          </kbd>
        </div>

        {/* Command Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-[#697565] uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => runAction(() => setIsUploadModalOpen(true))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#172018] hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-[#153B2B]" />
                  <span>Upload & Scan New Invoice</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              <button
                onClick={() => runAction(() => setActiveNav('rewards'))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#172018] hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-[#153B2B]" />
                  <span>Browse Rewards & Gift Cards</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              <button
                onClick={() => runAction(() => setActiveNav('performance'))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#172018] hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#153B2B]" />
                  <span>View Monthly Sales Targets & Focus Products</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* Matched Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#697565] uppercase tracking-wider">
                Invoices & Claims
              </div>
              <div className="space-y-0.5">
                {filteredInvoices.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => runAction(() => setActiveNav('invoices'))}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-[#697565] shrink-0" />
                      <div className="flex flex-col text-left truncate">
                        <span className="font-semibold text-[#172018]">{inv.invoiceNumber}</span>
                        <span className="text-[11px] text-[#697565] truncate">{inv.supplierName} · ₹{inv.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[#F5F7F3] border border-[#E5EAE1] text-[#172018]">
                      {inv.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Rewards */}
          {filteredRewards.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#697565] uppercase tracking-wider">
                Rewards & Vouchers
              </div>
              <div className="space-y-0.5">
                {filteredRewards.map(rew => (
                  <button
                    key={rew.id}
                    onClick={() => runAction(() => setActiveNav('rewards'))}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Gift className="w-4 h-4 text-[#697565] shrink-0" />
                      <div className="flex flex-col text-left truncate">
                        <span className="font-semibold text-[#172018]">{rew.title}</span>
                        <span className="text-[11px] text-[#697565]">{rew.pointsCost.toLocaleString()} Pts · {rew.brand}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Payouts */}
          {filteredPayouts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-[#697565] uppercase tracking-wider">
                Payments & UTR
              </div>
              <div className="space-y-0.5">
                {filteredPayouts.map(pay => (
                  <button
                    key={pay.id}
                    onClick={() => runAction(() => setActiveNav('payments'))}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <CreditCard className="w-4 h-4 text-[#697565] shrink-0" />
                      <div className="flex flex-col text-left truncate">
                        <span className="font-semibold text-[#172018]">{pay.payoutNumber}</span>
                        <span className="text-[11px] text-[#697565]">₹{pay.netAmount.toLocaleString()} · UTR: {pay.utrReference || 'Processing'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-[#EAF7EE] text-[#16A34A]">
                      {pay.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#F5F7F3] border-t border-[#E5EAE1] flex items-center justify-between text-[11px] text-[#697565]">
          <span>Tip: Type to filter claims, rewards, or payouts</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
