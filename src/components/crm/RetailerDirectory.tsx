import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  ChevronRight, 
  X,
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreContext } from '../../types';

export const RetailerDirectory: React.FC = () => {
  const { stores, invoices, payouts, switchStore, setActiveNav } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreContext | null>(null);

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.territory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Retailer & Store Operations Directory
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Manage multi-store merchant profiles, KYC verifications, loyalty tier classifications, and territorial distributions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5EAE1] flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search store name, code, owner, or territory..."
            className="w-full text-xs bg-[#F5F7F3] border border-[#E5EAE1] rounded-lg pl-9 pr-3 py-1.5 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          />
        </div>
        <div className="text-xs text-[#697565] font-tabular">
          Showing {filteredStores.length} Registered Outlets
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">Store / Owner</th>
                <th className="py-3 px-4 font-semibold">Tier / Programme</th>
                <th className="py-3 px-4 font-semibold">Territory & Distributor</th>
                <th className="py-3 px-4 font-semibold text-right">Available Points</th>
                <th className="py-3 px-4 font-semibold text-right">Lifetime Earned</th>
                <th className="py-3 px-4 font-semibold">KYC Status</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {filteredStores.map(store => (
                <tr 
                  key={store.id} 
                  className="hover:bg-[#FAFBF9] transition-colors cursor-pointer"
                  onClick={() => setSelectedStore(store)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#172018]">{store.name}</div>
                    <div className="text-[11px] text-[#697565]">
                      {store.code} · {store.ownerName} ({store.phone})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#153B2B] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{store.tier} Tier</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] truncate max-w-xs">{store.program}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#172018]">{store.territory}</div>
                    <div className="text-[10px] text-[#697565]">{store.distributor}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#172018] font-tabular">
                    {store.availablePoints.toLocaleString()} Pts
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#153B2B] font-tabular">
                    {store.lifetimePoints.toLocaleString()} Pts
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchStore(store.id);
                        setActiveNav('overview');
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-lg cursor-pointer"
                    >
                      Impersonate / View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retailer Detail Drawer */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#E5EAE1] animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5EAE1]">
              <div>
                <h3 className="text-base font-bold text-[#172018]">{selectedStore.name}</h3>
                <p className="text-xs text-[#697565]">{selectedStore.code} · {selectedStore.tier} Partner</p>
              </div>
              <button 
                onClick={() => setSelectedStore(null)} 
                className="p-1 rounded-md text-[#697565] hover:text-[#172018]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Balances */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1]">
                  <span className="text-[#697565] uppercase text-[10px] font-semibold">Available Points</span>
                  <div className="text-lg font-bold text-[#172018] font-tabular mt-0.5">
                    {selectedStore.availablePoints.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1]">
                  <span className="text-[#697565] uppercase text-[10px] font-semibold">Cash Value</span>
                  <div className="text-lg font-bold text-[#153B2B] font-tabular mt-0.5">
                    ₹{(selectedStore.availablePoints * selectedStore.cashEquivalentRate).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="p-4 bg-[#F5F7F3] rounded-xl space-y-2">
                <div className="font-semibold text-[#172018] text-xs">Operational Credentials</div>
                <div className="flex justify-between text-[#697565]">
                  <span>Owner:</span>
                  <span className="font-medium text-[#172018]">{selectedStore.ownerName}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Phone:</span>
                  <span className="font-medium text-[#172018] font-tabular">{selectedStore.phone}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Email:</span>
                  <span className="font-medium text-[#172018]">{selectedStore.email}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>Bank Account:</span>
                  <span className="font-mono text-[#172018]">{selectedStore.bankAccountMasked}</span>
                </div>
                <div className="flex justify-between text-[#697565]">
                  <span>UPI ID:</span>
                  <span className="font-mono text-[#172018]">{selectedStore.upiIdMasked}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    switchStore(selectedStore.id);
                    setSelectedStore(null);
                    setActiveNav('overview');
                  }}
                  className="w-full py-2.5 bg-[#153B2B] text-[#C8F43D] font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Switch Context to this Retailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
