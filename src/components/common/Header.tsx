import React, { useState } from 'react';
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
  ShieldCheck,
  User,
  LogOut,
  KeyRound,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { PlatformRole } from '../../types';

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
    setActiveNav,
    publishedConfig,
    setIsAuthModalOpen
  } = useApp();

  const { currentUser, logout, demoQuickLogin, hasPermission } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const brandName = publishedConfig?.theme?.brandName || 'RetailPulse';

  const handleRoleQuickSwitch = async (role: PlatformRole) => {
    setIsUserMenuOpen(false);
    await demoQuickLogin(role);
    if (role === 'Retailer') {
      setUserRole('retailer');
      setActiveNav('overview');
    } else {
      setUserRole('operations');
      if (role === 'Finance') {
        setActiveNav('crm-payouts');
      } else if (role === 'Support Agent') {
        setActiveNav('tickets');
      } else {
        setActiveNav('crm-retailers');
      }
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-[#7C3AED] text-[#FFFFFF]';
      case 'Operations Admin':
        return 'bg-[#153B2B] text-[#C8F43D]';
      case 'Finance':
        return 'bg-[#0284C7] text-[#FFFFFF]';
      case 'Support Agent':
        return 'bg-[#D97706] text-[#FFFFFF]';
      case 'Retailer':
      default:
        return 'bg-[#16A34A] text-[#FFFFFF]';
    }
  };

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
              {brandName}
            </span>
            <span className="text-[10px] text-[#697565] font-medium tracking-wide flex items-center gap-1">
              {currentUser ? (
                <>
                  <span className={`inline-block px-1 py-0.2 rounded text-[9px] font-bold ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </>
              ) : (
                userRole === 'retailer' ? 'RETAILER PORTAL' : 'OPERATIONS CRM'
              )}
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
            <span className="truncate">Search claims, invoices, users, vouchers, payouts...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#697565] bg-[#FFFFFF] border border-[#DDE4D8] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions, Role Toggle & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Workspace Mode Switcher */}
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
              if (currentUser?.role === 'Finance') {
                setActiveNav('crm-payouts');
              } else {
                setActiveNav('crm-retailers');
              }
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

        {/* Authenticated User Profile & Role Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-1 cursor-pointer group p-1 rounded-lg hover:bg-[#F5F7F3] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#153B2B] text-[#FFFFFF] flex items-center justify-center text-xs font-semibold border-2 border-[#C8F43D]">
              {(currentUser?.name || currentStore.ownerName).split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#172018] group-hover:text-[#153B2B] leading-tight truncate max-w-[120px]">
                {currentUser?.name || currentStore.ownerName}
              </span>
              <span className="text-[10px] text-[#697565] font-tabular leading-tight">
                {currentUser?.role || `${currentStore.tier} Member`}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#697565]" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-72 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-3 border-b border-[#E5EAE1]">
                <div className="text-xs font-bold text-[#172018]">{currentUser?.name || 'Authorized User'}</div>
                <div className="text-[11px] text-[#697565] truncate">{currentUser?.email || 'user@retailpulse.io'}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeColor(currentUser?.role)}`}>
                    {currentUser?.role || 'Retailer'}
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Fast Role Simulator (Real Backend JWT Session Switching) */}
              <div className="py-2.5">
                <div className="text-[10px] font-bold text-[#697565] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Fast IAM Role Switch</span>
                  <span className="text-[9px] font-normal text-[#153B2B] bg-[#EAEFE6] px-1.5 py-0.5 rounded">Real JWT</span>
                </div>
                <div className="space-y-1">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = currentUser?.role === acc.role;
                    return (
                      <button
                        key={acc.role}
                        onClick={() => handleRoleQuickSwitch(acc.role)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[#153B2B] text-[#FFFFFF]' 
                            : 'hover:bg-[#F5F7F3] text-[#172018]'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold ${isSelected ? 'text-[#C8F43D]' : 'text-[#172018]'}`}>
                            {acc.label}
                          </div>
                          <div className={`text-[10px] truncate max-w-[190px] ${isSelected ? 'text-[#D1D5DB]' : 'text-[#697565]'}`}>
                            {acc.email}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F43D]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EAE1] space-y-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-[#153B2B] hover:bg-[#F5F7F3] rounded-xl transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>IAM Login & Invite Activation</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveNav('profile');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-[#172018] hover:bg-[#F5F7F3] rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#697565]" />
                  <span>Store Profile & Settings</span>
                </button>
                <button
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await logout();
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2] rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
