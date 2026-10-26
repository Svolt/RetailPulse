import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RedemptionOrder, RewardType } from '../../types';

export const MyOrdersView: React.FC = () => {
  const { orders, setActiveNav } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'voucher' | 'physical_gift' | 'cash'>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.type === activeTab);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            My Redemptions & Orders
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Track digital voucher codes, physical gift delivery dispatches, and bank cash payout references.
          </p>
        </div>
        <button
          onClick={() => setActiveNav('rewards')}
          className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          Browse Rewards Catalogue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F5F7F3] p-1 rounded-xl w-fit border border-[#E5EAE1]">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'voucher', label: 'Digital Vouchers' },
          { id: 'physical_gift', label: 'Physical Gifts' },
          { id: 'cash', label: 'Cash Redemptions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                : 'text-[#697565] hover:text-[#172018]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-[#E5EAE1] text-center text-xs text-[#697565]">
            <ShoppingBag className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="font-semibold text-[#172018]">No orders found</p>
            <p className="mt-1">Redeem your loyalty points to unlock vouchers and physical gear.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F7F3]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center font-bold shrink-0">
                    {order.type === 'voucher' ? <Tag className="w-4 h-4" /> : order.type === 'physical_gift' ? <Package className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172018]">{order.rewardTitle}</h3>
                    <div className="text-[11px] text-[#697565] font-tabular mt-0.5">
                      Order ID: {order.id} · Redeemed on: {order.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end gap-3 text-right">
                  <div>
                    <div className="text-xs font-bold text-[#DC2626] font-tabular">
                      −{order.pointsSpent.toLocaleString()} Pts
                    </div>
                    {order.cashAmount && (
                      <div className="text-[10px] text-[#16A34A] font-semibold">
                        ₹{order.cashAmount.toLocaleString()} Settled
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md bg-[#EAF7EE] text-[#16A34A] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Specific Details */}
              {order.voucherCode && (
                <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#697565]">E-Voucher Voucher Code:</span>
                    <div className="font-mono font-bold text-[#153B2B] text-sm mt-0.5 tracking-wider">
                      {order.voucherCode}
                    </div>
                    {order.voucherExpiry && (
                      <div className="text-[10px] text-[#94A3B8] mt-1 font-tabular">
                        Expiry Date: {order.voucherExpiry}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyCode(order.id, order.voucherCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#DDE4D8] hover:bg-[#F5F7F3] rounded-lg text-xs font-semibold text-[#172018] cursor-pointer shadow-2xs self-start sm:self-auto"
                  >
                    {copiedCodeId === order.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#697565]" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {order.trackingNumber && (
                <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#153B2B]" />
                      <span className="font-semibold text-[#172018]">Carrier: {order.carrier}</span>
                      <span className="font-mono text-[11px] text-[#697565]">AWB: {order.trackingNumber}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2 py-0.5 rounded">
                      Doorstep Dispatched
                    </span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="text-[11px] text-[#697565]">
                      Destination: {order.deliveryAddress}
                    </div>
                  )}
                </div>
              )}

              {order.utrNumber && (
                <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#697565]">Bank IMPS Settlement UTR:</span>
                    <div className="font-mono font-bold text-[#153B2B] text-sm mt-0.5">
                      {order.utrNumber}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#697565]">
                    Account: {order.destinationAccount}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
