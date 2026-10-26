import React, { createContext, useContext, useState, useEffect } from 'react';
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
  UserRole,
  ClaimStatus,
  ExperienceConfig
} from '../types';
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
} from '../data/mockData';

interface AppContextType {
  stores: StoreContext[];
  currentStore: StoreContext;
  switchStore: (storeId: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  
  // Published Experience Studio Configuration
  publishedConfig: ExperienceConfig | null;
  refreshPublishedConfig: () => Promise<void>;

  // Modals & Panels
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  // Data State
  invoices: InvoiceClaim[];
  ledgerEvents: LedgerEvent[];
  rewards: RewardItem[];
  orders: RedemptionOrder[];
  payouts: PayoutRecord[];
  performance: SalesPerformance;
  tasks: TaskItem[];
  tickets: SupportTicket[];
  notifications: NotificationItem[];
  campaigns: CampaignItem[];
  earnRules: EarnRuleItem[];
  auditLogs: AuditLogItem[];
  
  // Core Domain Operations
  uploadInvoice: (claimData: Partial<InvoiceClaim>) => InvoiceClaim;
  reviewClaim: (claimId: string, status: ClaimStatus, notes?: string, approvedAmount?: number) => void;
  redeemReward: (rewardId: string, details?: { address?: string; cashAmount?: number }) => { success: boolean; message: string; orderId?: string };
  requestPayout: (pointsToRedeem: number, destinationType: 'bank' | 'upi') => { success: boolean; message: string };
  processPayoutBatch: (payoutIds: string[], action: 'approve' | 'pay' | 'reject') => void;
  completeTask: (taskId: string, answers?: Record<string, string>) => void;
  createTicket: (subject: string, category: any, message: string, linkedReferenceId?: string) => void;
  replyToTicket: (ticketId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'apex_crm_v4_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or initial mock data
  const [stores, setStores] = useState<StoreContext[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    return stores[0]?.id || 'store-1';
  });

  const [userRole, setUserRole] = useState<UserRole>('retailer');
  const [activeNav, setActiveNav] = useState<string>('overview');

  const [publishedConfig, setPublishedConfig] = useState<ExperienceConfig | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const refreshPublishedConfig = async () => {
    try {
      const res = await fetch('/api/config/published');
      if (res.ok) {
        const data = await res.json();
        setPublishedConfig(data);
      }
    } catch (e) {
      console.warn('[AppContext] Failed to load published config:', e);
    }
  };

  useEffect(() => {
    refreshPublishedConfig();
  }, []);

  const [invoices, setInvoices] = useState<InvoiceClaim[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [ledgerEvents, setLedgerEvents] = useState<LedgerEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER_EVENTS;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [orders, setOrders] = useState<RedemptionOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [performance, setPerformance] = useState<SalesPerformance>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'performance');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [campaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [earnRules] = useState<EarnRuleItem[]>(INITIAL_EARN_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Persist key state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'ledger', JSON.stringify(ledgerEvents));
  }, [ledgerEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Active store resolution
  const currentStore = stores.find(s => s.id === currentStoreId) || stores[0];

  const switchStore = (storeId: string) => {
    setCurrentStoreId(storeId);
  };

  const logAuditEvent = (action: string, target: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: userRole === 'retailer' ? currentStore.ownerName : 'Operations Admin',
      actorRole: userRole,
      action,
      target,
      details,
      ipAddress: '10.240.8.12'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Upload an invoice
  const uploadInvoice = (claimData: Partial<InvoiceClaim>): InvoiceClaim => {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);
    
    // Check for duplicate invoice number
    const duplicate = invoices.find(inv => 
      inv.invoiceNumber.toLowerCase() === (claimData.invoiceNumber || '').toLowerCase()
    );

    const calculatedPts = Math.round(((claimData.eligibleAmount || claimData.totalAmount || 0) * 0.025));

    const newClaim: InvoiceClaim = {
      id: `inv-claim-${Date.now()}`,
      invoiceNumber: claimData.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      retailerId: currentStore.id,
      retailerName: currentStore.name,
      supplierName: claimData.supplierName || 'Reliance Trade Logistics Ltd',
      invoiceDate: claimData.invoiceDate || now.toISOString().substring(0, 10),
      submissionDate: formattedDate,
      totalAmount: claimData.totalAmount || 0,
      eligibleAmount: claimData.eligibleAmount || claimData.totalAmount || 0,
      calculatedPoints: calculatedPts,
      status: duplicate ? 'duplicate_flagged' : 'pending_review',
      ocrConfidence: claimData.ocrConfidence || 95,
      fileUrl: claimData.fileUrl || '/assets/uploaded_invoice_preview.pdf',
      fileName: claimData.fileName || 'invoice_scan.pdf',
      lineItems: claimData.lineItems || [],
      duplicateMatchId: duplicate?.id,
      reviewNotes: duplicate ? `Duplicate flag: exact invoice match with existing record ${duplicate.invoiceNumber}` : 'Submitted for OCR verification'
    };

    setInvoices(prev => [newClaim, ...prev]);

    // Update pending points for retailer
    if (!duplicate) {
      setStores(prev => prev.map(s => {
        if (s.id === currentStore.id) {
          return {
            ...s,
            pendingPoints: s.pendingPoints + calculatedPts
          };
        }
        return s;
      }));
    }

    logAuditEvent(
      'UPLOAD_INVOICE_CLAIM', 
      `${newClaim.invoiceNumber} (${currentStore.name})`, 
      `Total: ₹${newClaim.totalAmount.toLocaleString()}, Calculated Points: ${calculatedPts}`
    );

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: duplicate ? 'Invoice Flagged as Duplicate' : 'Invoice Submitted for Review',
      message: duplicate 
        ? `Invoice ${newClaim.invoiceNumber} matches an existing claim in the database.` 
        : `Claim for invoice ${newClaim.invoiceNumber} (${calculatedPts} points) is under OCR audit.`,
      timestamp: formattedDate,
      category: 'claim',
      isRead: false,
      linkAction: 'invoices'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newClaim;
  };

  // Ops / Admin reviews and decides on an invoice claim
  const reviewClaim = (claimId: string, status: ClaimStatus, notes?: string, approvedAmount?: number) => {
    const claim = invoices.find(c => c.id === claimId);
    if (!claim) return;

    const finalEligible = approvedAmount !== undefined ? approvedAmount : claim.eligibleAmount;
    const finalPoints = Math.round(finalEligible * 0.025);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setInvoices(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          eligibleAmount: finalEligible,
          calculatedPoints: finalPoints,
          reviewedBy: 'Operations Console (Verified)',
          reviewNotes: notes || c.reviewNotes,
          decisionDate: nowStr
        };
      }
      return c;
    }));

    // If approved, update wallet & ledger
    if (status === 'approved' || status === 'partially_approved') {
      const targetStoreId = claim.retailerId;
      const targetStore = stores.find(s => s.id === targetStoreId) || currentStore;
      const newBalance = targetStore.availablePoints + finalPoints;
      const remainingPending = Math.max(0, targetStore.pendingPoints - claim.calculatedPoints);

      setStores(prev => prev.map(s => {
        if (s.id === targetStoreId) {
          return {
            ...s,
            availablePoints: newBalance,
            pendingPoints: remainingPending,
            lifetimePoints: s.lifetimePoints + finalPoints
          };
        }
        return s;
      }));

      // Append ledger event
      const newLedgerEvent: LedgerEvent = {
        id: `ldg-${Date.now()}`,
        timestamp: nowStr,
        retailerId: targetStoreId,
        type: 'INVOICE_CLAIM_APPROVED',
        description: `Claim ${claim.invoiceNumber} approved (${claim.supplierName})`,
        referenceId: claim.id,
        points: finalPoints,
        balanceAfter: newBalance,
        status: 'settled',
        ruleVersion: 'v4.2-2026Q4',
        actor: 'Operations Admin'
      };
      setLedgerEvents(prev => [newLedgerEvent, ...prev]);

      // Add to sales performance
      setPerformance(prev => ({
        ...prev,
        achievedSales: prev.achievedSales + finalEligible,
        achievementPercentage: Math.min(100, Math.round(((prev.achievedSales + finalEligible) / prev.targetSales) * 100)),
        remainingTarget: Math.max(0, prev.targetSales - (prev.achievedSales + finalEligible)),
        pointsEarned: prev.pointsEarned + finalPoints
      }));
    } else if (status === 'rejected') {
      // Release pending points
      setStores(prev => prev.map(s => {
        if (s.id === claim.retailerId) {
          return {
            ...s,
            pendingPoints: Math.max(0, s.pendingPoints - claim.calculatedPoints)
          };
        }
        return s;
      }));
    }

    logAuditEvent(
      `DECISION_${status.toUpperCase()}`, 
      `${claim.invoiceNumber} (Points: ${finalPoints})`, 
      notes || `Decision executed by Operations Reviewer.`
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Invoice ${claim.invoiceNumber}: ${status.replace('_', ' ').toUpperCase()}`,
      message: status === 'approved' 
        ? `Claim approved! ${finalPoints} points have been credited to your active wallet.` 
        : `Claim update: ${notes || 'Status has been updated by operations team.'}`,
      timestamp: nowStr,
      category: 'claim',
      isRead: false,
      linkAction: 'invoices'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Redeem a reward (voucher, gift, or cash)
  const redeemReward = (rewardId: string, details?: { address?: string; cashAmount?: number }): { success: boolean; message: string; orderId?: string } => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found.' };

    const pointsCost = details?.cashAmount ? details.cashAmount / currentStore.cashEquivalentRate : reward.pointsCost;

    if (currentStore.availablePoints < pointsCost) {
      return { 
        success: false, 
        message: `Insufficient balance. Required: ${pointsCost.toLocaleString()} pts, Available: ${currentStore.availablePoints.toLocaleString()} pts.` 
      };
    }

    if (reward.stock <= 0 && reward.type !== 'cash') {
      return { success: false, message: 'Item is currently out of stock.' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newBalance = currentStore.availablePoints - pointsCost;
    const orderId = `ord-${reward.type.charAt(0)}-${Date.now()}`;

    // Atomically decrement points
    setStores(prev => prev.map(s => {
      if (s.id === currentStore.id) {
        return {
          ...s,
          availablePoints: newBalance,
          redeemedPoints: s.redeemedPoints + pointsCost
        };
      }
      return s;
    }));

    // Atomically decrement stock if physical or voucher
    if (reward.type !== 'cash') {
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r));
    }

    // Create redemption order
    const newOrder: RedemptionOrder = {
      id: orderId,
      retailerId: currentStore.id,
      retailerName: currentStore.name,
      rewardId: reward.id,
      rewardTitle: reward.title,
      type: reward.type,
      pointsSpent: pointsCost,
      createdAt: nowStr,
      status: reward.type === 'voucher' ? 'redeemed' : reward.type === 'cash' ? 'redeemed' : 'confirmed',
      voucherCode: reward.type === 'voucher' ? `APX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : undefined,
      voucherExpiry: reward.type === 'voucher' ? '2027-10-25' : undefined,
      trackingNumber: reward.type === 'physical_gift' ? `BD-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      carrier: reward.type === 'physical_gift' ? 'BlueDart Express' : undefined,
      deliveryAddress: details?.address || 'Primary Storefront Address on KYC',
      cashAmount: details?.cashAmount || (reward.type === 'cash' ? pointsCost * currentStore.cashEquivalentRate : undefined),
      destinationAccount: currentStore.bankAccountMasked,
      utrNumber: reward.type === 'cash' ? `IMPS${Date.now().toString().substring(4)}` : undefined
    };

    setOrders(prev => [newOrder, ...prev]);

    // Append ledger event
    const ledgerType = reward.type === 'voucher' ? 'VOUCHER_REDEMPTION' : reward.type === 'physical_gift' ? 'GIFT_REDEMPTION' : 'CASH_PAYOUT';
    const newLedgerEvent: LedgerEvent = {
      id: `ldg-${Date.now()}`,
      timestamp: nowStr,
      retailerId: currentStore.id,
      type: ledgerType,
      description: `Redeemed ${reward.title}`,
      referenceId: orderId,
      points: -pointsCost,
      balanceAfter: newBalance,
      status: 'settled',
      ruleVersion: 'v4.0',
      actor: currentStore.ownerName
    };
    setLedgerEvents(prev => [newLedgerEvent, ...prev]);

    // If cash payout, also add to payout records
    if (reward.type === 'cash') {
      const netCash = details?.cashAmount || pointsCost * currentStore.cashEquivalentRate;
      const newPayout: PayoutRecord = {
        id: `pay-${Date.now()}`,
        payoutNumber: `PAY-${nowStr.substring(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        retailerId: currentStore.id,
        retailerName: currentStore.name,
        storeCode: currentStore.code,
        pointsRedeemed: pointsCost,
        grossAmount: netCash,
        deductionsTds: 0,
        netAmount: netCash,
        status: 'paid',
        destination: currentStore.bankAccountMasked,
        destinationType: 'bank',
        requestedDate: nowStr,
        processedDate: nowStr,
        utrReference: newOrder.utrNumber,
        batchId: `BATCH-${Date.now()}`
      };
      setPayouts(prev => [newPayout, ...prev]);
    }

    logAuditEvent(
      'REDEMPTION_EXECUTED', 
      `${reward.title} (Order ${orderId})`, 
      `Deducted ${pointsCost.toLocaleString()} points. Balance: ${newBalance.toLocaleString()}`
    );

    return { 
      success: true, 
      message: `Successfully redeemed ${reward.title}!`, 
      orderId 
    };
  };

  // Request cash payout
  const requestPayout = (pointsToRedeem: number, destinationType: 'bank' | 'upi'): { success: boolean; message: string } => {
    if (pointsToRedeem < 2000) {
      return { success: false, message: 'Minimum cash redemption is 2,000 points (₹500).' };
    }
    if (currentStore.availablePoints < pointsToRedeem) {
      return { success: false, message: 'Insufficient available points.' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const grossCash = pointsToRedeem * currentStore.cashEquivalentRate;
    const tds = grossCash >= 10000 ? Math.round(grossCash * 0.01) : 0; // TDS 1% over 10k
    const netCash = grossCash - tds;
    const newBalance = currentStore.availablePoints - pointsToRedeem;
    const payoutId = `pay-${Date.now()}`;

    // Update store balance
    setStores(prev => prev.map(s => {
      if (s.id === currentStore.id) {
        return {
          ...s,
          availablePoints: newBalance,
          redeemedPoints: s.redeemedPoints + pointsToRedeem
        };
      }
      return s;
    }));

    const destination = destinationType === 'bank' ? currentStore.bankAccountMasked : currentStore.upiIdMasked;

    const newPayout: PayoutRecord = {
      id: payoutId,
      payoutNumber: `PAY-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      retailerId: currentStore.id,
      retailerName: currentStore.name,
      storeCode: currentStore.code,
      pointsRedeemed: pointsToRedeem,
      grossAmount: grossCash,
      deductionsTds: tds,
      netAmount: netCash,
      status: 'approved',
      destination,
      destinationType,
      requestedDate: nowStr,
      batchId: 'BATCH-QUEUED'
    };

    setPayouts(prev => [newPayout, ...prev]);

    // Add ledger event
    const newLedgerEvent: LedgerEvent = {
      id: `ldg-${Date.now()}`,
      timestamp: nowStr,
      retailerId: currentStore.id,
      type: 'CASH_PAYOUT',
      description: `Cash payout request to ${destination}`,
      referenceId: payoutId,
      points: -pointsToRedeem,
      balanceAfter: newBalance,
      status: 'pending',
      ruleVersion: 'v4.0',
      actor: currentStore.ownerName
    };
    setLedgerEvents(prev => [newLedgerEvent, ...prev]);

    logAuditEvent('REQUEST_CASH_PAYOUT', `Amount: ₹${netCash}`, `Redeemed ${pointsToRedeem} points to ${destination}`);

    return { 
      success: true, 
      message: `Cash payout request of ₹${netCash.toLocaleString()} submitted successfully.` 
    };
  };

  // Finance operations batch execution
  const processPayoutBatch = (payoutIds: string[], action: 'approve' | 'pay' | 'reject') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setPayouts(prev => prev.map(p => {
      if (payoutIds.includes(p.id)) {
        if (action === 'pay') {
          return {
            ...p,
            status: 'paid',
            processedDate: nowStr,
            utrReference: p.utrReference || `UTRHDFC${Math.floor(100000000 + Math.random() * 900000000)}`
          };
        } else if (action === 'approve') {
          return {
            ...p,
            status: 'approved'
          };
        } else {
          return {
            ...p,
            status: 'failed',
            failureReason: 'Rejected by finance maker-checker review'
          };
        }
      }
      return p;
    }));

    logAuditEvent(
      'FINANCE_PAYOUT_BATCH', 
      `Batch count: ${payoutIds.length} items`, 
      `Action: ${action.toUpperCase()} by Finance Console.`
    );
  };

  // Complete a task or survey
  const completeTask = (taskId: string, answers?: Record<string, string>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'approved'
        };
      }
      return t;
    }));

    // Credit points
    const newBalance = currentStore.availablePoints + task.pointsReward;
    setStores(prev => prev.map(s => {
      if (s.id === currentStore.id) {
        return {
          ...s,
          availablePoints: newBalance,
          lifetimePoints: s.lifetimePoints + task.pointsReward
        };
      }
      return s;
    }));

    const newLedgerEvent: LedgerEvent = {
      id: `ldg-${Date.now()}`,
      timestamp: nowStr,
      retailerId: currentStore.id,
      type: 'TASK_COMPLETION',
      description: `Completed task: ${task.title}`,
      referenceId: task.id,
      points: task.pointsReward,
      balanceAfter: newBalance,
      status: 'settled',
      ruleVersion: 'v4.1',
      actor: 'System Auto-Verification'
    };
    setLedgerEvents(prev => [newLedgerEvent, ...prev]);

    logAuditEvent('COMPLETE_TASK', task.title, `Awarded ${task.pointsReward} pts.`);
  };

  // Support tickets
  const createTicket = (subject: string, category: any, message: string, linkedReferenceId?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      retailerId: currentStore.id,
      retailerName: currentStore.name,
      category,
      subject,
      linkedReferenceId,
      status: 'open',
      priority: 'medium',
      createdAt: nowStr,
      updatedAt: nowStr,
      assignedAgent: 'Priority Operations Desk',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          senderName: currentStore.ownerName,
          timestamp: nowStr,
          text: message
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    logAuditEvent('CREATE_SUPPORT_TICKET', newTicket.ticketNumber, subject);
  };

  const replyToTicket = (ticketId: string, text: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'in_progress',
          updatedAt: nowStr,
          messages: [
            ...t.messages,
            {
              id: `m-${Date.now()}`,
              sender: userRole === 'retailer' ? 'user' : 'agent',
              senderName: userRole === 'retailer' ? currentStore.ownerName : 'Operations Desk Agent',
              timestamp: nowStr,
              text
            }
          ]
        };
      }
      return t;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setStores(INITIAL_STORES);
    setInvoices(INITIAL_INVOICES);
    setLedgerEvents(INITIAL_LEDGER_EVENTS);
    setRewards(INITIAL_REWARDS);
    setOrders(INITIAL_ORDERS);
    setPayouts(INITIAL_PAYOUTS);
    setPerformance(INITIAL_PERFORMANCE);
    setTasks(INITIAL_TASKS);
    setTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        stores,
        currentStore,
        switchStore,
        userRole,
        setUserRole,
        activeNav,
        setActiveNav,
        publishedConfig,
        refreshPublishedConfig,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        invoices,
        ledgerEvents,
        rewards,
        orders,
        payouts,
        performance,
        tasks,
        tickets,
        notifications,
        campaigns,
        earnRules,
        auditLogs,
        uploadInvoice,
        reviewClaim,
        redeemReward,
        requestPayout,
        processPayoutBatch,
        completeTask,
        createTicket,
        replyToTicket,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
