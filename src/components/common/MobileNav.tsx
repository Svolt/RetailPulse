import React from 'react';
import { LayoutDashboard, FileText, Upload, Gift, Store, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeNav, setActiveNav, setIsUploadModalOpen, userRole } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E5EAE1] h-16 flex items-center justify-around px-2 shadow-lg">
      <button
        onClick={() => setActiveNav('overview')}
        className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer transition-colors ${
          activeNav === 'overview' ? 'text-[#153B2B] font-semibold' : 'text-[#697565]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => setActiveNav(userRole === 'retailer' ? 'invoices' : 'crm-claims')}
        className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer transition-colors ${
          activeNav === 'invoices' || activeNav === 'crm-claims' ? 'text-[#153B2B] font-semibold' : 'text-[#697565]'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Claims</span>
      </button>

      {/* Prominent Scan/Upload Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
        aria-label="Upload Invoice"
      >
        <div className="w-12 h-12 rounded-full bg-[#153B2B] text-[#C8F43D] flex items-center justify-center shadow-md border-3 border-[#FFFFFF] group-active:scale-95 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-[#153B2B] mt-0.5">Upload</span>
      </button>

      <button
        onClick={() => setActiveNav('rewards')}
        className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer transition-colors ${
          activeNav === 'rewards' ? 'text-[#153B2B] font-semibold' : 'text-[#697565]'
        }`}
      >
        <Gift className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Rewards</span>
      </button>

      <button
        onClick={() => setActiveNav('wallet')}
        className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer transition-colors ${
          activeNav === 'wallet' ? 'text-[#153B2B] font-semibold' : 'text-[#697565]'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Wallet</span>
      </button>
    </nav>
  );
};
