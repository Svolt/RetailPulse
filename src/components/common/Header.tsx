import React from 'react';
import { 
  Search, 
  Bell, 
  Upload, 
  Store, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentStore, 
    stores, 
    switchStore, 
    userRole, 
    setUserRole, 
    setIsCommandPaletteOpen, 
    setIsUploadModalOpen, 
    setIsNotificationOpen,
    notifications,
    setActiveNav
  } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-4 md:px-6 bg-[#FFFFFF] border-b border-[#E5EAE1]">
      {/* Zone 1: Brand & Store/Workspace Selector */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#153B2B] flex items-center justify-center text-[#C8F43D] font-bold text-sm tracking-tighter shadow-xs">
            ▲
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[#172018] whitespace-nowrap">
              RetailPulse
            </span>
            <span className="text-[10px] text-[#697565] font-medium tracking-wide">
              {userRole === 'retailer' ? 'RETAILER PORTAL' : 'OPERATIONS CRM'}
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-5 w-[1px] bg-[#E5EAE1] mx-1" />

        {/* Store Context Switcher */}
        <div className="relative group hidden sm:block">
          <select 
            value={currentStore.id} 
            onChange={(e) => switchStore(e.target.value)}
            className="text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-md py-1.5 pl-2.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#153B2B] transition-colors"
          >
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.code} · {store.name} ({store.tier})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#697565] absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Zone 2: Global Search / Command Palette Bar */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#697565] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#E5EAE1] rounded-lg transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#697565] group-hover:text-[#172018]" />
            <span className="truncate">Search claims, invoices, vouchers, payouts...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#697565] bg-[#FFFFFF] border border-[#DDE4D8] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions, Role Toggle & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role Mode Toggle Switcher */}
        <div className="flex items-center bg-[#F5F7F3] p-0.5 rounded-lg border border-[#E5EAE1]">
          <button
            onClick={() => {
              setUserRole('retailer');
              setActiveNav('overview');
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              userRole === 'retailer' 
                ? 'bg-[#FFFFFF] text-[#153B2B] shadow-2xs font-semibold' 
                : 'text-[#697565] hover:text-[#172018]'
            }`}
          >
            Store View
          </button>
          <button
            onClick={() => {
              setUserRole('operations');
              setActiveNav('crm-retailers');
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              userRole !== 'retailer' 
                ? 'bg-[#153B2B] text-[#C8F43D] shadow-2xs font-semibold' 
                : 'text-[#697565] hover:text-[#172018]'
            }`}
          >
            Ops CRM
          </button>
        </div>

        {/* Primary CTA button */}
        {userRole === 'retailer' ? (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-lg shadow-2xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Invoice</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveNav('crm-claims')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] bg-[#153B2B] hover:bg-[#1E4D38] rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8F43D]" />
            <span>Review Claims</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 text-[#697565] hover:text-[#172018] hover:bg-[#F5F7F3] rounded-lg transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-[#FFFFFF]" />
          )}
        </button>

        {/* User Avatar & Tier Indicator */}
        <div 
          onClick={() => setActiveNav('profile')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#153B2B] text-[#FFFFFF] flex items-center justify-center text-xs font-semibold border-2 border-[#C8F43D]">
            {currentStore.ownerName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#172018] group-hover:text-[#153B2B] leading-tight">
              {currentStore.ownerName}
            </span>
            <span className="text-[10px] text-[#697565] font-tabular leading-tight">
              {currentStore.tier} Member
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
