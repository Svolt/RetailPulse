import { 
  StoreContext, 
  InvoiceClaim, 
  LedgerEvent, 
  RewardItem, 
  RedemptionOrder, 
  PayoutRecord, 
  SalesPerformance, 
  TaskItem, 
  SupportTicket, 
  NotificationItem, 
  CampaignItem, 
  EarnRuleItem, 
  AuditLogItem,
  ClaimStatus,
  PayoutStatus
} from '../src/types';

export type { InvoiceClaim, LedgerEvent, PayoutRecord, ClaimStatus, PayoutStatus };
import { 
  INITIAL_STORES, 
  INITIAL_INVOICES, 
  INITIAL_LEDGER_EVENTS, 
  INITIAL_REWARDS, 
  INITIAL_ORDERS, 
  INITIAL_PAYOUTS, 
  INITIAL_PERFORMANCE, 
  INITIAL_TASKS, 
  INITIAL_TICKETS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_EARN_RULES, 
  INITIAL_AUDIT_LOGS 
} from '../src/data/mockData';

// User & Auth types
export type PlatformRole = 
  | 'Super Admin' 
  | 'Operations Admin' 
  | 'Finance' 
  | 'Support Agent' 
  | 'Retailer';

export type UserAccountStatus = 'active' | 'pending_invite' | 'suspended' | 'deactivated';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PlatformRole;
  status: UserAccountStatus;
  storeIds: string[]; // Assigned store IDs
  territory?: string;
  distributor?: string;
  programme?: string;
  createdAt: string;
  lastLoginAt?: string;
  invitedBy?: string;
  inviteToken?: string;
  inviteExpiresAt?: string;
  permissionsOverride?: string[];
}

export interface SessionData {
  token: string;
  userId: string;
  user: UserAccount;
  expiresAt: number;
}

// Experience Studio Configuration Model
export interface DashboardWidgetConfig {
  id: string;
  widgetKey: 'kpi_strip' | 'sales_trend' | 'points_dynamics' | 'needs_attention' | 'activity_timeline' | 'focus_products' | 'quick_actions';
  title: string;
  description: string;
  isEnabled: boolean;
  order: number;
  audienceRoles?: PlatformRole[];
  audienceTiers?: ('Platinum' | 'Gold' | 'Silver' | 'Bronze')[];
  audienceTerritories?: string[];
}

export interface NavModuleConfig {
  id: string;
  moduleId: string;
  label: string;
  iconName: string;
  isEnabled: boolean;
  order: number;
  requiredPermission: string;
  visibleToRoles: PlatformRole[];
}

export interface BrandThemeConfig {
  brandName: string;
  primaryColor: string; // e.g. #153B2B
  accentColor: string;  // e.g. #C8F43D
  canvasColor: string;  // e.g. #F5F7F3
  fontFamily: string;   // e.g. 'Plus Jakarta Sans'
  borderRadius: string; // e.g. 'rounded-2xl'
  loginTagline: string;
}

export interface ExperienceConfig {
  versionId: string;
  versionNumber: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  publishedBy?: string;
  changeSummary: string;
  widgets: DashboardWidgetConfig[];
  navigation: NavModuleConfig[];
  theme: BrandThemeConfig;
  targetAudience: string; // 'all' | 'tier:Gold' etc.
}

// Centralized Role Permissions
export const ROLE_PERMISSIONS: Record<PlatformRole, string[]> = {
  'Super Admin': [
    'users:read', 'users:manage', 'users:import', 'users:delete',
    'claims:read', 'claims:review', 'claims:approve', 'claims:reject',
    'ledger:read', 'ledger:adjust',
    'payouts:read', 'payouts:approve', 'payouts:execute',
    'rewards:read', 'rewards:manage', 'rewards:redeem',
    'config:read', 'config:edit', 'config:publish', 'config:rollback',
    'audit:read', 'reports:export', 'support:manage', 'performance:view'
  ],
  'Operations Admin': [
    'users:read', 'users:manage', 'users:import',
    'claims:read', 'claims:review', 'claims:approve', 'claims:reject',
    'ledger:read',
    'payouts:read',
    'rewards:read', 'rewards:manage',
    'config:read', 'config:edit', 'config:publish',
    'audit:read', 'reports:export', 'support:manage', 'performance:view'
  ],
  'Finance': [
    'users:read',
    'claims:read',
    'ledger:read',
    'payouts:read', 'payouts:approve', 'payouts:execute',
    'reports:export', 'audit:read'
  ],
  'Support Agent': [
    'users:read',
    'claims:read',
    'ledger:read',
    'payouts:read',
    'rewards:read',
    'support:manage'
  ],
  'Retailer': [
    'claims:submit', 'claims:read',
    'ledger:read',
    'rewards:read', 'rewards:redeem',
    'payouts:request', 'payouts:read',
    'tasks:complete',
    'performance:view',
    'support:create',
    'reports:export'
  ]
};

// Seed Users
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-super-admin',
    name: 'Alexandra Vance',
    email: 'alexandra.vance@retailpulse.io',
    phone: '+91 98200 11001',
    role: 'Super Admin',
    status: 'active',
    storeIds: ['store-1', 'store-2'],
    territory: 'National Central Headquarters',
    programme: 'Apex Enterprise Loyalty',
    createdAt: '2026-01-15 08:00',
    lastLoginAt: '2026-10-25 21:40'
  },
  {
    id: 'usr-ops-admin',
    name: 'Anand Verma',
    email: 'anand.verma@retailpulse.io',
    phone: '+91 98200 11002',
    role: 'Operations Admin',
    status: 'active',
    storeIds: ['store-1', 'store-2'],
    territory: 'West Mumbai Zone',
    programme: 'Apex Platinum Partner 2026',
    createdAt: '2026-02-01 09:30',
    lastLoginAt: '2026-10-25 20:15'
  },
  {
    id: 'usr-finance-lead',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@retailpulse.io',
    phone: '+91 98200 11003',
    role: 'Finance',
    status: 'active',
    storeIds: ['store-1', 'store-2'],
    territory: 'Treasury & Settlements Desk',
    programme: 'Universal Settlement',
    createdAt: '2026-02-10 11:00',
    lastLoginAt: '2026-10-25 18:20'
  },
  {
    id: 'usr-support-agent',
    name: 'Pooja Kulkarni',
    email: 'pooja.kulkarni@retailpulse.io',
    phone: '+91 98200 11004',
    role: 'Support Agent',
    status: 'active',
    storeIds: ['store-1', 'store-2'],
    territory: 'Merchant Helpdesk Support',
    programme: 'All Programmes',
    createdAt: '2026-03-01 10:00',
    lastLoginAt: '2026-10-25 19:45'
  },
  {
    id: 'usr-retailer-rajesh',
    name: 'Rajesh Sharma',
    email: 'rajesh@shreekrishnaelectricals.com',
    phone: '+91 98201 44812',
    role: 'Retailer',
    status: 'active',
    storeIds: ['store-1', 'store-2'],
    territory: 'West Mumbai Commercial Zone',
    distributor: 'Reliance Trade Logistics Ltd',
    programme: 'Apex Platinum Partner 2026',
    createdAt: '2026-04-12 14:20',
    lastLoginAt: '2026-10-25 22:10'
  },
  {
    id: 'usr-retailer-sunil',
    name: 'Sunil Mehta',
    email: 'sunil@mehtahardware.in',
    phone: '+91 98202 55901',
    role: 'Retailer',
    status: 'pending_invite',
    storeIds: [],
    territory: 'Thane Central Territory',
    distributor: 'Western Cable & Conduits Co',
    programme: 'Apex Platinum Partner 2026',
    createdAt: '2026-10-24 16:30',
    inviteToken: 'inv-tok-99201a4',
    inviteExpiresAt: '2026-11-01 23:59'
  }
];

// Initial Experience Studio Published Config
const INITIAL_EXPERIENCE_CONFIG: ExperienceConfig = {
  versionId: 'cfg-v1.0.0',
  versionNumber: 1,
  status: 'published',
  publishedAt: '2026-10-20 12:00:00',
  publishedBy: 'Alexandra Vance (Super Admin)',
  changeSummary: 'Baseline production retailer portal layout with banking-grade KPI strips, area sales trend, focus products, and append-only ledger.',
  targetAudience: 'all',
  theme: {
    brandName: 'RetailPulse',
    primaryColor: '#153B2B',
    accentColor: '#C8F43D',
    canvasColor: '#F5F7F3',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'rounded-2xl',
    loginTagline: 'Enterprise Digital Loyalty, Invoicing & Payout Operations'
  },
  widgets: [
    {
      id: 'w-kpi',
      widgetKey: 'kpi_strip',
      title: 'Performance & Wallet KPI Strip',
      description: 'Available points, pending claims, total cash settled, and monthly target attainment.',
      isEnabled: true,
      order: 1
    },
    {
      id: 'w-sales-trend',
      widgetKey: 'sales_trend',
      title: 'Eligible Wholesale Sales Trend',
      description: 'Area chart visualizing verified distributor purchase volumes over daily/weekly/monthly horizons.',
      isEnabled: true,
      order: 2
    },
    {
      id: 'w-points-dynamics',
      widgetKey: 'points_dynamics',
      title: 'Points Issuance vs Redemptions',
      description: 'Bar chart comparing loyalty points earned through invoices against reward redemptions.',
      isEnabled: true,
      order: 3
    },
    {
      id: 'w-attention',
      widgetKey: 'needs_attention',
      title: 'Needs Attention Action Queue',
      description: 'Urgent actionable items such as blurred invoice re-uploads and expiring bonus points.',
      isEnabled: true,
      order: 4
    },
    {
      id: 'w-timeline',
      widgetKey: 'activity_timeline',
      title: 'Recent Activity Ledger Timeline',
      description: 'Unified stream of invoice approvals, voucher orders, task completions, and cash payouts.',
      isEnabled: true,
      order: 5
    },
    {
      id: 'w-focus',
      widgetKey: 'focus_products',
      title: 'Focus Product Incentive Grid',
      description: 'Target progress for high-yield manufacturer SKUs with volume multiplier kickers.',
      isEnabled: true,
      order: 6
    }
  ],
  navigation: [
    { id: 'nav-overview', moduleId: 'overview', label: 'Overview', iconName: 'LayoutDashboard', isEnabled: true, order: 1, requiredPermission: 'performance:view', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-invoices', moduleId: 'invoices', label: 'Invoice Claims', iconName: 'FileText', isEnabled: true, order: 2, requiredPermission: 'claims:read', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-wallet', moduleId: 'wallet', label: 'Points Wallet', iconName: 'Wallet', isEnabled: true, order: 3, requiredPermission: 'ledger:read', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin', 'Finance'] },
    { id: 'nav-rewards', moduleId: 'rewards', label: 'Rewards Catalogue', iconName: 'Gift', isEnabled: true, order: 4, requiredPermission: 'rewards:read', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-orders', moduleId: 'orders', label: 'My Orders', iconName: 'ShoppingBag', isEnabled: true, order: 5, requiredPermission: 'rewards:read', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-payments', moduleId: 'payments', label: 'Payments & Payouts', iconName: 'CreditCard', isEnabled: true, order: 6, requiredPermission: 'payouts:read', visibleToRoles: ['Retailer', 'Finance', 'Super Admin'] },
    { id: 'nav-performance', moduleId: 'performance', label: 'Sales Performance', iconName: 'TrendingUp', isEnabled: true, order: 7, requiredPermission: 'performance:view', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-tasks', moduleId: 'tasks', label: 'Tasks & Training', iconName: 'CheckSquare', isEnabled: true, order: 8, requiredPermission: 'tasks:complete', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-profile', moduleId: 'profile', label: 'Store KYC & Profile', iconName: 'Store', isEnabled: true, order: 9, requiredPermission: 'performance:view', visibleToRoles: ['Retailer', 'Operations Admin', 'Super Admin'] },
    { id: 'nav-tickets', moduleId: 'tickets', label: 'Support & Disputes', iconName: 'LifeBuoy', isEnabled: true, order: 10, requiredPermission: 'support:manage', visibleToRoles: ['Retailer', 'Support Agent', 'Operations Admin', 'Super Admin'] }
  ]
};

// In-Memory Database Class
class MemoryDatabase {
  users: UserAccount[] = [...INITIAL_USERS];
  sessions: Map<string, SessionData> = new Map();
  stores: StoreContext[] = [...INITIAL_STORES];
  invoices: InvoiceClaim[] = [...INITIAL_INVOICES];
  ledger: LedgerEvent[] = [...INITIAL_LEDGER_EVENTS];
  rewards: RewardItem[] = [...INITIAL_REWARDS];
  orders: RedemptionOrder[] = [...INITIAL_ORDERS];
  payouts: PayoutRecord[] = [...INITIAL_PAYOUTS];
  performance: SalesPerformance = { ...INITIAL_PERFORMANCE };
  tasks: TaskItem[] = [...INITIAL_TASKS];
  tickets: SupportTicket[] = [...INITIAL_TICKETS];
  notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  campaigns: CampaignItem[] = [...INITIAL_CAMPAIGNS];
  earnRules: EarnRuleItem[] = [...INITIAL_EARN_RULES];
  auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];

  // Experience Studio Configs
  publishedConfig: ExperienceConfig = { ...INITIAL_EXPERIENCE_CONFIG };
  draftConfig: ExperienceConfig = JSON.parse(JSON.stringify(INITIAL_EXPERIENCE_CONFIG));
  configHistory: ExperienceConfig[] = [{ ...INITIAL_EXPERIENCE_CONFIG }];

  constructor() {
    this.draftConfig.status = 'draft';
    this.draftConfig.versionId = 'cfg-v1.1.0-draft';
    this.draftConfig.versionNumber = 2;
    this.draftConfig.changeSummary = 'Draft in progress';
  }

  logAudit(actor: string, actorRole: string, action: string, target: string, details: string, ip = '127.0.0.1') {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor,
      actorRole,
      action,
      target,
      details,
      ipAddress: ip
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

export const db = new MemoryDatabase();
