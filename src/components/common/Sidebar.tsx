import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Gift, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  CheckSquare, 
  LifeBuoy, 
  Store, 
  Users, 
  ShieldCheck, 
  Calculator, 
  Megaphone, 
  FileCheck2,
  Receipt,
  UserCheck,
  Palette,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, userRole, invoices, currentStore, tasks, publishedConfig } = useApp();
  const { currentUser, hasPermission } = useAuth();

  const pendingClaimsCount = invoices.filter(c => c.status === 'pending_review' || c.status === 'needs_info').length;
  const activeTasksCount = tasks.filter(t => t.status === 'assigned').length;

  const retailerNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoice Claims', icon: FileText, badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined },
    { id: 'wallet', label: 'Points Wallet', icon: Wallet },
    { id: 'rewards', label: 'Rewards Catalogue', icon: Gift },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments & Payouts', icon: CreditCard },
    { id: 'performance', label: 'Sales Performance', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks & Training', icon: CheckSquare, badge: activeTasksCount > 0 ? activeTasksCount : undefined },
    { id: 'profile', label: 'Store KYC & Profile', icon: Store },
    { id: 'tickets', label: 'Support & Disputes', icon: LifeBuoy }
  ];

  // Base Ops Navigation items
  const baseOpsNavItems = [
    { id: 'overview', label: 'Command Centre', icon: LayoutDashboard },
    { id: 'crm-users', label: 'User Directory & IAM', icon: UserCheck, requiredPermission: 'users:read' },
    { id: 'crm-experience', label: 'Experience Studio', icon: Palette, requiredPermission: 'config:read' },
    { id: 'crm-retailers', label: 'Retailer Directory', icon: Users },
    { id: 'crm-claims', label: 'Claims Queue', icon: ShieldCheck, badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined, requiredPermission: 'claims:read' },
    { id: 'wallet', label: 'Points Ledger', icon: Receipt },
    { id: 'crm-payouts', label: 'Payout Operations', icon: CreditCard, requiredPermission: 'payouts:read' },
    { id: 'rewards', label: 'Rewards & Stock', icon: Gift },
    { id: 'crm-rules', label: 'Earn Rules & Sim', icon: Calculator },
    { id: 'crm-campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'tickets', label: 'Support Desk', icon: LifeBuoy, requiredPermission: 'tickets:read' },
    { id: 'crm-audit', label: 'Audit Trail', icon: FileCheck2, requiredPermission: 'audit:read' }
  ];

  // Filter ops navigation based on real RBAC permissions
  const opsNavItems = baseOpsNavItems.filter(item => {
    if (!item.requiredPermission) return true;
    if (currentUser?.role === 'Super Admin') return true;
    return hasPermission(item.requiredPermission);
  });

  const navItems = userRole === 'retailer' ? retailerNavItems : opsNavItems;

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#FFFFFF] border-r border-[#E5EAE1] shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Navigation section */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#697565] uppercase flex items-center justify-between">
          <span>{userRole === 'retailer' ? 'Store Management' : 'Operations Management'}</span>
          {userRole !== 'retailer' && (
            <span className="text-[9px] font-mono text-[#153B2B] bg-[#EAEFE6] px-1.5 py-0.5 rounded">RBAC</span>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer group ${
                isActive 
                  ? 'bg-[#153B2B] text-[#C8F43D] shadow-2xs font-semibold' 
                  : 'text-[#3E4A3D] hover:bg-[#F5F7F3] hover:text-[#172018]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#C8F43D]' : 'text-[#697565] group-hover:text-[#172018]'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-[#C8F43D] text-[#153B2B]' 
                    : 'bg-[#E11D48] text-[#FFFFFF]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Store Quick Summary in Sidebar Footer */}
      <div className="p-3 m-3 bg-[#F5F7F3] rounded-xl border border-[#E5EAE1]">
        <div className="flex items-center justify-between text-[11px] text-[#697565] mb-1">
          <span>Active Balance</span>
          <span className="font-semibold text-[#153B2B]">{currentStore.tier}</span>
        </div>
        <div className="text-base font-bold text-[#172018] font-tabular tracking-tight">
          {currentStore.availablePoints.toLocaleString()} <span className="text-xs font-normal text-[#697565]">Pts</span>
        </div>
        <div className="text-[11px] text-[#697565] mt-0.5">
          ≈ ₹{(currentStore.availablePoints * currentStore.cashEquivalentRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} Cash Value
        </div>
      </div>
    </aside>
  );
};
