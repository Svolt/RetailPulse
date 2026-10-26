export type PlatformRole = 
  | 'Super Admin' 
  | 'Operations Admin' 
  | 'Finance' 
  | 'Support Agent' 
  | 'Retailer';

export type UserRole = PlatformRole | 'retailer' | 'operations' | 'finance' | 'admin';

export type UserAccountStatus = 'active' | 'pending_invite' | 'suspended' | 'deactivated';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PlatformRole;
  status: UserAccountStatus;
  storeIds: string[];
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
  primaryColor: string;
  accentColor: string;
  canvasColor: string;
  fontFamily: string;
  borderRadius: string;
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
  targetAudience: string;
}

export type KYCStatus = 'verified' | 'pending' | 'rejected' | 'needs_info';
export type RetailerTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface StoreContext {
  id: string;
  code: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  tier: RetailerTier;
  program: string;
  territory: string;
  distributor: string;
  kycStatus: KYCStatus;
  availablePoints: number;
  pendingPoints: number;
  redeemedPoints: number;
  lifetimePoints: number;
  cashEquivalentRate: number; // e.g. 0.25 (4 points = 1 INR / USD)
  bankAccountMasked: string;
  upiIdMasked: string;
}

export type ClaimStatus = 
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'needs_info'
  | 'pending_review'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'duplicate_flagged'
  | 'reversed';

export interface InvoiceLineItem {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  isEligible: boolean;
  pointsCalculated: number;
  rejectionReason?: string;
}

export interface InvoiceClaim {
  id: string;
  invoiceNumber: string;
  retailerId: string;
  retailerName: string;
  supplierName: string;
  invoiceDate: string;
  submissionDate: string;
  totalAmount: number;
  eligibleAmount: number;
  calculatedPoints: number;
  status: ClaimStatus;
  ocrConfidence: number; // 0 to 100
  fileUrl: string;
  fileName: string;
  lineItems: InvoiceLineItem[];
  duplicateMatchId?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  decisionDate?: string;
}

export type LedgerEventType = 
  | 'INVOICE_CLAIM_APPROVED'
  | 'VOUCHER_REDEMPTION'
  | 'GIFT_REDEMPTION'
  | 'CASH_PAYOUT'
  | 'TASK_COMPLETION'
  | 'PROMOTIONAL_BONUS'
  | 'ADMIN_ADJUSTMENT'
  | 'REVERSAL';

export interface LedgerEvent {
  id: string;
  timestamp: string;
  retailerId: string;
  type: LedgerEventType;
  description: string;
  referenceId: string; // e.g. invoice id, order id, payout id
  points: number; // positive = credit, negative = debit
  balanceAfter: number;
  status: 'settled' | 'pending' | 'reversed';
  ruleVersion?: string;
  actor: string;
}

export type RewardType = 'voucher' | 'physical_gift' | 'cash';

export interface RewardItem {
  id: string;
  title: string;
  type: RewardType;
  category: string;
  pointsCost: number;
  monetaryValue: number;
  stock: number;
  imageUrl: string;
  description: string;
  brand: string;
  terms: string;
  validityDays?: number;
  deliveryEstimateDays?: number;
}

export type OrderStatus = 
  | 'created'
  | 'reserved'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'active'
  | 'redeemed'
  | 'cancelled';

export interface RedemptionOrder {
  id: string;
  retailerId: string;
  retailerName: string;
  rewardId: string;
  rewardTitle: string;
  type: RewardType;
  pointsSpent: number;
  createdAt: string;
  status: OrderStatus;
  voucherCode?: string;
  voucherExpiry?: string;
  trackingNumber?: string;
  carrier?: string;
  deliveryAddress?: string;
  cashAmount?: number;
  destinationAccount?: string;
  utrNumber?: string;
}

export type PayoutStatus = 
  | 'requested'
  | 'validation'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'on_hold';

export interface PayoutRecord {
  id: string;
  payoutNumber: string;
  retailerId: string;
  retailerName: string;
  storeCode: string;
  pointsRedeemed: number;
  grossAmount: number;
  deductionsTds: number;
  netAmount: number;
  status: PayoutStatus;
  destination: string; // e.g. "HDFC Bank •••• 4091" or "sharma@okhdfc"
  destinationType: 'bank' | 'upi';
  requestedDate: string;
  processedDate?: string;
  utrReference?: string;
  failureReason?: string;
  batchId?: string;
}

export interface FocusProductPerformance {
  sku: string;
  name: string;
  brand: string;
  category: string;
  monthlyTargetUnits: number;
  achievedUnits: number;
  achievementPercentage: number;
  eligibleSales: number;
  pointsEarned: number;
  incentiveRule: string;
  trend: 'up' | 'stable' | 'down';
}

export interface SalesPerformance {
  period: string; // e.g. "October 2026"
  targetSales: number;
  achievedSales: number;
  achievementPercentage: number;
  remainingTarget: number;
  invoiceCount: number;
  activeSkusCount: number;
  pointsEarned: number;
  focusProducts: FocusProductPerformance[];
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'survey' | 'training' | 'display_compliance' | 'field_visit';
  pointsReward: number;
  estimatedMinutes: number;
  dueDate: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  description: string;
  videoUrl?: string;
  surveyQuestions?: {
    id: string;
    question: string;
    options: string[];
  }[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  retailerId: string;
  retailerName: string;
  category: 'invoice' | 'points' | 'payout' | 'voucher' | 'kyc' | 'general';
  subject: string;
  linkedReferenceId?: string;
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  messages: {
    id: string;
    sender: 'user' | 'agent';
    senderName: string;
    timestamp: string;
    text: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'claim' | 'payout' | 'reward' | 'campaign' | 'system';
  isRead: boolean;
  linkAction?: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  budgetAllocated: number;
  budgetBurned: number;
  targetSegment: string;
  multiplier: string;
  description: string;
}

export interface EarnRuleItem {
  id: string;
  name: string;
  description: string;
  category: string;
  rateDescription: string;
  minInvoiceValue: number;
  maxCapPoints: number;
  isActive: boolean;
  ruleVersion: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}
