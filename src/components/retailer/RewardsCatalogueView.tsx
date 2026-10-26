import React, { useState } from 'react';
import { 
  Gift, 
  Tag, 
  CreditCard, 
  ShoppingBag, 
  Search, 
  Check, 
  Copy, 
  AlertCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RewardItem, RewardType } from '../../types';

export const RewardsCatalogueView: React.FC = () => {
  const { 
    rewards, 
    currentStore, 
    redeemReward, 
    requestPayout,
    setActiveNav 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'voucher' | 'physical_gift' | 'cash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<{ message: string; voucherCode?: string; orderId?: string } | null>(null);
  const [shippingAddress, setShippingAddress] = useState('Shop No. 4, Ground Floor, Laxmi Niwas, SV Road, Malad West, Mumbai 400064');
  
  // Cash redeem state
  const [cashPointsInput, setCashPointsInput] = useState<number>(10000); // 10k pts = ₹2,500
  const [cashDestination, setCashDestination] = useState<'bank' | 'upi'>('bank');
  const [cashError, setCashError] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  const filteredRewards = rewards.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenRedeemModal = (reward: RewardItem) => {
    setSelectedReward(reward);
    setRedeemSuccess(null);
    setCashError(null);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    if (selectedReward.type === 'voucher') {
      const res = redeemReward(selectedReward.id);
      if (res.success) {
        setRedeemSuccess({
          message: res.message,
          voucherCode: `AMZ-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-APX`,
          orderId: res.orderId
        });
      } else {
        alert(res.message);
      }
    } else if (selectedReward.type === 'physical_gift') {
      const res = redeemReward(selectedReward.id, { address: shippingAddress });
      if (res.success) {
        setRedeemSuccess({
          message: res.message,
          orderId: res.orderId
        });
      } else {
        alert(res.message);
      }
    } else if (selectedReward.type === 'cash') {
      const res = requestPayout(cashPointsInput, cashDestination);
      if (res.success) {
        setRedeemSuccess({
          message: res.message,
          orderId: `PAY-${Date.now()}`
        });
      } else {
        setCashError(res.message);
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Rewards & Redemptions
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Redeem your available points ({currentStore.availablePoints.toLocaleString()} Pts) for digital brand vouchers, professional gear, or direct bank cash.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('orders')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-xl transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#153B2B]" />
            <span>My Orders & Codes</span>
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-xl border border-[#E5EAE1]">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#F5F7F3] p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Rewards', icon: Gift },
            { id: 'voucher', label: 'Digital Vouchers', icon: Tag },
            { id: 'physical_gift', label: 'Physical Gifts', icon: ShoppingBag },
            { id: 'cash', label: 'Direct Cash Transfer', icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                    : 'text-[#697565] hover:text-[#172018]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#697565] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand, gift or voucher..."
            className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-8 pr-3 py-1.5 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          />
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = currentStore.availablePoints >= reward.pointsCost;
          const isCash = reward.type === 'cash';

          return (
            <div 
              key={reward.id} 
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] overflow-hidden shadow-2xs hover:border-[#153B2B] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-44 w-full bg-[#F5F7F3] relative overflow-hidden">
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback
                      (e.target as any).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#153B2B] text-[#FFFFFF] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {reward.brand}
                  </div>
                  {reward.stock < 50 && reward.type !== 'cash' && (
                    <div className="absolute top-3 right-3 bg-[#FEF3C7] text-[#D97706] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      Only {reward.stock} Left
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#697565]">
                    <span>{reward.category}</span>
                    {reward.type === 'voucher' && (
                      <span className="text-[#16A34A] font-medium">Instant E-Code</span>
                    )}
                    {reward.type === 'physical_gift' && (
                      <span className="text-[#153B2B] font-medium flex items-center gap-1">
                        <Truck className="w-3 h-3" /> ~{reward.deliveryEstimateDays} days delivery
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#172018] line-clamp-1">
                    {reward.title}
                  </h3>

                  <p className="text-xs text-[#697565] line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Points & CTA */}
              <div className="p-4 pt-3 border-t border-[#F5F7F3] flex items-center justify-between gap-2">
                <div>
                  <div className="text-base font-bold text-[#153B2B] font-tabular">
                    {reward.pointsCost.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
                  </div>
                  <div className="text-[10px] text-[#697565] font-tabular">
                    Value: ₹{reward.monetaryValue.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRedeemModal(reward)}
                  disabled={!canAfford && !isCash}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    canAfford || isCash
                      ? 'bg-[#C8F43D] text-[#153B2B] hover:bg-[#BBE832] active:scale-95'
                      : 'bg-[#F5F7F3] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  {isCash ? 'Transfer Cash' : canAfford ? 'Redeem Now' : 'Need More Pts'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption / Order Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#153B2B] text-[#C8F43D] flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172018]">
                    {redeemSuccess ? 'Redemption Successful!' : `Redeem: ${selectedReward.title}`}
                  </h3>
                  <p className="text-[11px] text-[#697565]">
                    {selectedReward.brand} · {selectedReward.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReward(null)}
                className="p-1 text-[#697565] hover:text-[#172018] rounded-md hover:bg-[#F5F7F3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {redeemSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#172018]">{redeemSuccess.message}</h4>

                {redeemSuccess.voucherCode && (
                  <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#DDE4D8] space-y-2">
                    <span className="text-xs text-[#697565]">Your Protected Voucher Code:</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-mono font-bold text-[#153B2B] tracking-wider">
                        {redeemSuccess.voucherCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(redeemSuccess.voucherCode!)}
                        className="p-1.5 bg-[#FFFFFF] border border-[#DDE4D8] rounded-md hover:bg-[#F5F7F3] text-xs font-medium cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4 text-[#697565]" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#697565]">
                      Saved permanently in your "My Orders" tab. Valid for 12 months.
                    </p>
                  </div>
                )}

                {selectedReward.type === 'physical_gift' && (
                  <div className="p-3 bg-[#F5F7F3] rounded-xl text-xs text-[#697565]">
                    Estimated delivery in {selectedReward.deliveryEstimateDays} days via BlueDart Express to:
                    <div className="font-semibold text-[#172018] mt-1">{shippingAddress}</div>
                  </div>
                )}

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedReward(null);
                      setActiveNav('orders');
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl cursor-pointer"
                  >
                    View in My Orders
                  </button>
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-2 text-xs font-medium text-[#697565] hover:text-[#172018] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Cost & Balance Check */}
                <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#697565]">Current Active Balance:</span>
                    <div className="font-bold text-[#172018] font-tabular">
                      {currentStore.availablePoints.toLocaleString()} Points
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#697565]">Deduction:</span>
                    <div className="font-bold text-[#DC2626] font-tabular">
                      −{(selectedReward.type === 'cash' ? cashPointsInput : selectedReward.pointsCost).toLocaleString()} Points
                    </div>
                  </div>
                </div>

                {/* Cash Redemption Custom Form */}
                {selectedReward.type === 'cash' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#172018] mb-1">
                        Select Points to Convert into Cash
                      </label>
                      <input
                        type="number"
                        min={2000}
                        max={currentStore.availablePoints}
                        step={1000}
                        value={cashPointsInput}
                        onChange={(e) => setCashPointsInput(Number(e.target.value))}
                        className="w-full text-sm font-bold font-tabular bg-[#FFFFFF] border border-[#DDE4D8] rounded-xl px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                      />
                      <div className="flex items-center justify-between text-[11px] text-[#697565] mt-1 font-tabular">
                        <span>Net Bank Payout: ₹{(cashPointsInput * currentStore.cashEquivalentRate).toLocaleString()}</span>
                        <span>Rate: 4 Pts = ₹1.00</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172018] mb-1">
                        Verified Destination Account
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCashDestination('bank')}
                          className={`p-2.5 text-left rounded-xl border text-xs cursor-pointer transition-colors ${
                            cashDestination === 'bank' ? 'bg-[#EAEFE6] border-[#153B2B] font-semibold' : 'bg-[#FFFFFF] border-[#E5EAE1]'
                          }`}
                        >
                          <div className="text-[10px] text-[#697565]">Bank Account (IMPS)</div>
                          <div className="text-[#172018] truncate">{currentStore.bankAccountMasked}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCashDestination('upi')}
                          className={`p-2.5 text-left rounded-xl border text-xs cursor-pointer transition-colors ${
                            cashDestination === 'upi' ? 'bg-[#EAEFE6] border-[#153B2B] font-semibold' : 'bg-[#FFFFFF] border-[#E5EAE1]'
                          }`}
                        >
                          <div className="text-[10px] text-[#697565]">Direct UPI ID</div>
                          <div className="text-[#172018] truncate">{currentStore.upiIdMasked}</div>
                        </button>
                      </div>
                    </div>

                    {cashError && (
                      <div className="p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#DC2626]">
                        {cashError}
                      </div>
                    )}
                  </div>
                )}

                {/* Physical Delivery Form */}
                {selectedReward.type === 'physical_gift' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-[#172018]">
                      Shipping Address for Logistics Dispatch
                    </label>
                    <textarea
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-xl p-3 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                    />
                    <div className="text-[11px] text-[#697565] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#153B2B]" />
                      <span>Insured door delivery with real-time SMS tracking</span>
                    </div>
                  </div>
                )}

                {/* Terms Summary */}
                <div className="text-[11px] text-[#697565] leading-relaxed">
                  <span className="font-semibold text-[#172018]">Terms: </span>
                  {selectedReward.terms}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-2 text-xs font-medium text-[#697565] hover:text-[#172018] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRedeem}
                    className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    Confirm & Deduct Points
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
