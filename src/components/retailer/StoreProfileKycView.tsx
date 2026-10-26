import React, { useState } from 'react';
import { 
  Store, 
  ShieldCheck, 
  Building, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  FileText, 
  Lock, 
  ExternalLink,
  Edit2,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreProfileKycView: React.FC = () => {
  const { currentStore, stores, switchStore } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentStore.phone);
  const [email, setEmail] = useState(currentStore.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">{currentStore.code}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
              <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified Partner
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Store Profile, KYC & Bank Destinations
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Registered business identity, PAN/GST compliance documents, and verified payout routes.
          </p>
        </div>

        {/* Multi-Store Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#697565]">Store Switcher:</label>
          <select 
            value={currentStore.id}
            onChange={(e) => switchStore(e.target.value)}
            className="text-xs font-semibold bg-[#F5F7F3] border border-[#DDE4D8] rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
          >
            {stores.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} · {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Store contact settings updated and synchronized with verified profile.</span>
        </div>
      )}

      {/* Main Grid: Store Identity + Bank/UPI Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Store & Owner Details */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE1]">
            <h2 className="text-sm font-bold text-[#172018]">Business & Contact Details</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Contact'}</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Store Legal Name
                </label>
                <div className="text-xs font-bold text-[#172018] p-2 bg-[#F5F7F3] rounded-lg border border-[#E5EAE1]">
                  {currentStore.name}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Primary Owner / Operator
                </label>
                <div className="text-xs font-bold text-[#172018] p-2 bg-[#F5F7F3] rounded-lg border border-[#E5EAE1]">
                  {currentStore.ownerName}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Verified Mobile (OTP Login)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-tabular bg-[#FFFFFF] border border-[#153B2B] rounded-lg p-2 text-[#172018] focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-semibold text-[#172018] font-tabular p-2 bg-[#FAFBF9] rounded-lg border border-[#E5EAE1]">
                    {phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Billing Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-[#FFFFFF] border border-[#153B2B] rounded-lg p-2 text-[#172018] focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-semibold text-[#172018] p-2 bg-[#FAFBF9] rounded-lg border border-[#E5EAE1] truncate">
                    {email}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Assigned Wholesale Distributor
                </label>
                <div className="text-xs font-medium text-[#172018] p-2 bg-[#F5F7F3] rounded-lg border border-[#E5EAE1]">
                  {currentStore.distributor}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#697565] uppercase tracking-wider mb-1">
                  Sales Territory
                </label>
                <div className="text-xs font-medium text-[#172018] p-2 bg-[#F5F7F3] rounded-lg border border-[#E5EAE1]">
                  {currentStore.territory}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* KYC & Compliance Verification Status */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE1]">
            <h2 className="text-sm font-bold text-[#172018]">KYC & Identity Verification</h2>
            <span className="text-[10px] font-semibold text-[#16A34A] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Verified
            </span>
          </div>

          <div className="space-y-3">
            {/* PAN Card */}
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#153B2B]" />
                <div>
                  <div className="font-semibold text-[#172018]">Business PAN Card</div>
                  <div className="text-[10px] text-[#697565] font-mono">AAAAA••••A (Masked)</div>
                </div>
              </div>
              <span className="text-[10px] text-[#16A34A] font-semibold">Verified</span>
            </div>

            {/* GSTIN Certificate */}
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#153B2B]" />
                <div>
                  <div className="font-semibold text-[#172018]">GSTIN Registration</div>
                  <div className="text-[10px] text-[#697565] font-mono">27AAAAA•••••1Z5</div>
                </div>
              </div>
              <span className="text-[10px] text-[#16A34A] font-semibold">Verified</span>
            </div>

            {/* Verified Bank Account */}
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-[#153B2B]" />
                <div>
                  <div className="font-semibold text-[#172018]">IMPS Settlement Bank</div>
                  <div className="text-[10px] text-[#697565]">{currentStore.bankAccountMasked}</div>
                </div>
              </div>
              <span className="text-[10px] text-[#16A34A] font-semibold">Verified</span>
            </div>

            {/* UPI Handle */}
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#153B2B]" />
                <div>
                  <div className="font-semibold text-[#172018]">Direct UPI Handle</div>
                  <div className="text-[10px] text-[#697565]">{currentStore.upiIdMasked}</div>
                </div>
              </div>
              <span className="text-[10px] text-[#16A34A] font-semibold">Active</span>
            </div>
          </div>

          <div className="p-3 bg-[#F5F7F3] rounded-xl text-[11px] text-[#697565] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#153B2B] shrink-0" />
            <span>Sensitive financial data is masked according to RBI and ISO-27001 compliance standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
