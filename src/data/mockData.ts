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
  AuditLogItem 
} from '../types';

export const INITIAL_STORES: StoreContext[] = [
  {
    id: 'store-1',
    code: 'RT-8421',
    name: 'Shree Krishna Electricals & Hardware',
    ownerName: 'Rajesh Sharma',
    phone: '+91 98201 44812',
    email: 'rajesh@shreekrishnaelectricals.com',
    tier: 'Gold',
    program: 'Apex Platinum Partner 2026',
    territory: 'West Mumbai Commercial Zone',
    distributor: 'Reliance Trade Logistics Ltd',
    kycStatus: 'verified',
    availablePoints: 28450,
    pendingPoints: 4200,
    redeemedPoints: 32150,
    lifetimePoints: 64800,
    cashEquivalentRate: 0.25, // 1 pt = ₹0.25 (4 pts = ₹1.00)
    bankAccountMasked: 'HDFC Bank •••• 4091',
    upiIdMasked: 'rajesh.sharma@okhdfcbank'
  },
  {
    id: 'store-2',
    code: 'RT-9102',
    name: 'Apex Industrial Tools & Supplies',
    ownerName: 'Rajesh Sharma',
    phone: '+91 98201 44812',
    email: 'rajesh@apextools.in',
    tier: 'Platinum',
    program: 'Apex Platinum Partner 2026',
    territory: 'Navi Mumbai Industrial Belt',
    distributor: 'Western Industrial Distributors',
    kycStatus: 'verified',
    availablePoints: 46800,
    pendingPoints: 8500,
    redeemedPoints: 51200,
    lifetimePoints: 106500,
    cashEquivalentRate: 0.25,
    bankAccountMasked: 'ICICI Bank •••• 8832',
    upiIdMasked: 'apextools@icici'
  }
];

export const INITIAL_INVOICES: InvoiceClaim[] = [
  {
    id: 'inv-claim-101',
    invoiceNumber: 'INV-2026-9481',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    supplierName: 'Reliance Trade Logistics Ltd',
    invoiceDate: '2026-10-21',
    submissionDate: '2026-10-22 14:32',
    totalAmount: 112500,
    eligibleAmount: 108000,
    calculatedPoints: 2700,
    status: 'approved',
    ocrConfidence: 97,
    fileUrl: '/assets/sample_invoice_1.pdf',
    fileName: 'reliance_tax_inv_9481.pdf',
    reviewedBy: 'Auto-Audit OCR + Anand V.',
    reviewNotes: 'Verified against distributor dispatch EDI 2026-0922. 1 SKU non-eligible (packing crate fee).',
    decisionDate: '2026-10-23 09:15',
    lineItems: [
      {
        id: 'li-1',
        sku: 'POL-W-250-RD',
        productName: 'Polycab 2.5 sq mm Single Core Copper Wire (Red 90m)',
        brand: 'Polycab',
        category: 'Wires & Cables',
        quantity: 20,
        unitPrice: 2450,
        discount: 2450,
        tax: 8379,
        total: 54929,
        isEligible: true,
        pointsCalculated: 1373
      },
      {
        id: 'li-2',
        sku: 'HAV-MCB-32A',
        productName: 'Havells Euroload 32A Double Pole C-Curve MCB',
        brand: 'Havells',
        category: 'Switchgear',
        quantity: 25,
        unitPrice: 980,
        discount: 1225,
        tax: 4190,
        total: 27465,
        isEligible: true,
        pointsCalculated: 686
      },
      {
        id: 'li-3',
        sku: 'PHI-LED-20W',
        productName: 'Philips Stellar 20W LED T5 Batten Light (Cool White)',
        brand: 'Philips',
        category: 'Lighting',
        quantity: 40,
        unitPrice: 640,
        discount: 1280,
        tax: 4377,
        total: 28704,
        isEligible: true,
        pointsCalculated: 641
      },
      {
        id: 'li-4',
        sku: 'PKG-LOG-CRATE',
        productName: 'Returnable Wooden Logistics Transport Crate',
        brand: 'Non-Brand',
        category: 'Packaging',
        quantity: 1,
        unitPrice: 4500,
        discount: 0,
        tax: 0,
        total: 4500,
        isEligible: false,
        pointsCalculated: 0,
        rejectionReason: 'Ancillary packaging/service line item non-eligible under Apex 2026 rules'
      }
    ]
  },
  {
    id: 'inv-claim-102',
    invoiceNumber: 'INV-2026-9530',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    supplierName: 'Havells India Regional Depot',
    invoiceDate: '2026-10-24',
    submissionDate: '2026-10-24 18:05',
    totalAmount: 84000,
    eligibleAmount: 84000,
    calculatedPoints: 2100,
    status: 'pending_review',
    ocrConfidence: 94,
    fileUrl: '/assets/sample_invoice_2.pdf',
    fileName: 'havells_direct_inv_9530.pdf',
    lineItems: [
      {
        id: 'li-201',
        sku: 'HAV-SW-ROMA-6M',
        productName: 'Anchor Roma Classic 6-Module Polycarbonate Face Plate',
        brand: 'Anchor',
        category: 'Modular Switches',
        quantity: 120,
        unitPrice: 280,
        discount: 1680,
        tax: 5745,
        total: 37665,
        isEligible: true,
        pointsCalculated: 941
      },
      {
        id: 'li-202',
        sku: 'HAV-FAN-1200',
        productName: 'Havells Stealth Air 1200mm BLDC Ceiling Fan',
        brand: 'Havells',
        category: 'Appliances',
        quantity: 12,
        unitPrice: 3860,
        discount: 2316,
        tax: 7921,
        total: 51925,
        isEligible: true,
        pointsCalculated: 1159
      }
    ]
  },
  {
    id: 'inv-claim-103',
    invoiceNumber: 'INV-2026-9311',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    supplierName: 'Western Cable & Conduits Co',
    invoiceDate: '2026-10-18',
    submissionDate: '2026-10-19 11:20',
    totalAmount: 62000,
    eligibleAmount: 0,
    calculatedPoints: 0,
    status: 'needs_info',
    ocrConfidence: 68,
    fileUrl: '/assets/sample_invoice_3.pdf',
    fileName: 'scanned_cable_receipt_page1.jpg',
    reviewedBy: 'Pooja K. (Ops Claim Specialist)',
    reviewNotes: 'Invoice image lower edge is blurred; GSTIN number of distributor partially illegible. Please re-upload clearer photo or PDF.',
    decisionDate: '2026-10-20 16:40',
    lineItems: [
      {
        id: 'li-301',
        sku: 'WCC-PVC-25MM',
        productName: 'Heavy Duty PVC Electrical Conduit 25mm (Bundle 50)',
        brand: 'Western Conduit',
        category: 'Piping',
        quantity: 15,
        unitPrice: 4133,
        discount: 0,
        tax: 0,
        total: 62000,
        isEligible: false,
        pointsCalculated: 0,
        rejectionReason: 'GSTIN obscured - requires legible document proof'
      }
    ]
  },
  {
    id: 'inv-claim-104',
    invoiceNumber: 'INV-2026-9204',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    supplierName: 'Reliance Trade Logistics Ltd',
    invoiceDate: '2026-10-12',
    submissionDate: '2026-10-13 16:50',
    totalAmount: 145000,
    eligibleAmount: 145000,
    calculatedPoints: 3625,
    status: 'approved',
    ocrConfidence: 99,
    fileUrl: '/assets/sample_invoice_4.pdf',
    fileName: 'reliance_oct_batch_9204.pdf',
    reviewedBy: 'Auto-Audit OCR Engine v4',
    decisionDate: '2026-10-14 08:30',
    lineItems: [
      {
        id: 'li-401',
        sku: 'POL-W-400-BL',
        productName: 'Polycab 4.0 sq mm Industrial Copper Cable 180m Blue',
        brand: 'Polycab',
        category: 'Wires & Cables',
        quantity: 15,
        unitPrice: 9666,
        discount: 0,
        tax: 0,
        total: 145000,
        isEligible: true,
        pointsCalculated: 3625
      }
    ]
  }
];

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'ldg-1008',
    timestamp: '2026-10-23 09:15',
    retailerId: 'store-1',
    type: 'INVOICE_CLAIM_APPROVED',
    description: 'Claim INV-2026-9481 approved (Reliance Trade Logistics)',
    referenceId: 'inv-claim-101',
    points: 2700,
    balanceAfter: 28450,
    status: 'settled',
    ruleVersion: 'v4.2-2026Q4',
    actor: 'Auto-Audit OCR + Anand V.'
  },
  {
    id: 'ldg-1007',
    timestamp: '2026-10-21 16:40',
    retailerId: 'store-1',
    type: 'VOUCHER_REDEMPTION',
    description: 'Redeemed ₹2,500 Amazon Pay E-Gift Voucher',
    referenceId: 'ord-v-891',
    points: -10000,
    balanceAfter: 25750,
    status: 'settled',
    ruleVersion: 'v4.0',
    actor: 'Rajesh Sharma (Owner)'
  },
  {
    id: 'ldg-1006',
    timestamp: '2026-10-18 12:10',
    retailerId: 'store-1',
    type: 'TASK_COMPLETION',
    description: 'Completed "Diwali Festive Shelf Display Compliance Photo" survey',
    referenceId: 'tsk-402',
    points: 800,
    balanceAfter: 35750,
    status: 'settled',
    ruleVersion: 'v4.1',
    actor: 'Field Operations Audit'
  },
  {
    id: 'ldg-1005',
    timestamp: '2026-10-15 17:30',
    retailerId: 'store-1',
    type: 'CASH_PAYOUT',
    description: 'Direct UPI Bank Payout processed (UTR: HDFC894410294)',
    referenceId: 'pay-2026-1001',
    points: -20000,
    balanceAfter: 34950,
    status: 'settled',
    ruleVersion: 'v4.0',
    actor: 'Finance Automated Settlement'
  },
  {
    id: 'ldg-1004',
    timestamp: '2026-10-14 08:30',
    retailerId: 'store-1',
    type: 'INVOICE_CLAIM_APPROVED',
    description: 'Claim INV-2026-9204 approved (Reliance Trade Logistics)',
    referenceId: 'inv-claim-104',
    points: 3625,
    balanceAfter: 54950,
    status: 'settled',
    ruleVersion: 'v4.2-2026Q4',
    actor: 'Auto-Audit OCR Engine v4'
  },
  {
    id: 'ldg-1003',
    timestamp: '2026-10-05 10:00',
    retailerId: 'store-1',
    type: 'PROMOTIONAL_BONUS',
    description: 'Q4 Festive Surge Early Bird Multiplier Bonus (20% extra on Polycab)',
    referenceId: 'cmp-festive-2026',
    points: 1500,
    balanceAfter: 51325,
    status: 'settled',
    ruleVersion: 'v4.2-2026Q4',
    actor: 'System Campaign Trigger'
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-v-1',
    title: 'Amazon Pay E-Gift Card ₹2,500',
    type: 'voucher',
    category: 'Digital Vouchers',
    pointsCost: 10000,
    monetaryValue: 2500,
    stock: 145,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
    description: 'Instant digital balance valid for Amazon shopping, bill payments, mobile recharges and partner merchant transactions.',
    brand: 'Amazon India',
    terms: 'Valid for 12 months from issuance. Cannot be transferred to bank directly. Non-reloadable.',
    validityDays: 365
  },
  {
    id: 'rew-v-2',
    title: 'Flipkart Shopping Voucher ₹5,000',
    type: 'voucher',
    category: 'Digital Vouchers',
    pointsCost: 20000,
    monetaryValue: 5000,
    stock: 82,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    description: 'Redeem across millions of electronics, appliances, and tools on Flipkart with instant code activation.',
    brand: 'Flipkart',
    terms: 'Valid on entire Flipkart catalogue. No minimum purchase requirement. 1 year validity.',
    validityDays: 365
  },
  {
    id: 'rew-v-3',
    title: 'IndianOil Fuel SmartPass ₹1,000',
    type: 'voucher',
    category: 'Fuel & Utility',
    pointsCost: 4000,
    monetaryValue: 1000,
    stock: 220,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    description: 'Direct digital fuel card redeemable across 30,000+ IndianOil fuel stations nationwide for petrol and diesel.',
    brand: 'IndianOil',
    terms: 'Show barcode or OTP at billing counter. Valid for 6 months.',
    validityDays: 180
  },
  {
    id: 'rew-g-1',
    title: 'Bosch Professional 550W Impact Drill Kit (13mm)',
    type: 'physical_gift',
    category: 'Hardware & Tools',
    pointsCost: 16000,
    monetaryValue: 4200,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy duty reversible hammer drill with 100 accessories toolbox, masonry and metal bits. 1 Year Bosch India warranty.',
    brand: 'Bosch',
    terms: 'Dispatched via BlueDart Express courier with door delivery and tracking within 4-6 business days.',
    deliveryEstimateDays: 5
  },
  {
    id: 'rew-g-2',
    title: 'Samsung Galaxy Fit3 AMOLED Fitness Smartwatch',
    type: 'physical_gift',
    category: 'Electronics',
    pointsCost: 18500,
    monetaryValue: 4999,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: '1.6-inch vibrant AMOLED display, up to 13 days battery, aluminum case, sleep coaching and 100+ workout trackers.',
    brand: 'Samsung',
    terms: 'Manufacturer warranty included. Insured air transit.',
    deliveryEstimateDays: 4
  },
  {
    id: 'rew-g-3',
    title: 'Prestige 2000W Induction Cooktop with Indian Menu',
    type: 'physical_gift',
    category: 'Home Appliances',
    pointsCost: 14000,
    monetaryValue: 3600,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    description: 'Automatic voltage regulator, anti-magnetic wall, dual heat sensor and preset Indian cooking programs.',
    brand: 'Prestige',
    terms: 'Standard delivery via Delhivery logistics.',
    deliveryEstimateDays: 6
  },
  {
    id: 'rew-c-1',
    title: 'Instant Cash Payout (Bank Account / UPI Transfer)',
    type: 'cash',
    category: 'Cash Transfer',
    pointsCost: 4000, // min 4000 pts = ₹1,000
    monetaryValue: 1000,
    stock: 999999,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    description: 'Direct bank IMPS transfer or UPI settlement directly into your verified KYC bank account at ₹0.25 per loyalty point.',
    brand: 'Apex Finance Network',
    terms: 'Min payout: ₹500 (2,000 pts). Max single payout: ₹50,000. Subject to standard TDS if applicable.'
  }
];

export const INITIAL_ORDERS: RedemptionOrder[] = [
  {
    id: 'ord-v-891',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    rewardId: 'rew-v-1',
    rewardTitle: 'Amazon Pay E-Gift Card ₹2,500',
    type: 'voucher',
    pointsSpent: 10000,
    createdAt: '2026-10-21 16:40',
    status: 'redeemed',
    voucherCode: 'AMZ-9941-8842-KL77',
    voucherExpiry: '2027-10-21'
  },
  {
    id: 'ord-g-412',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    rewardId: 'rew-g-1',
    rewardTitle: 'Bosch Professional 550W Impact Drill Kit (13mm)',
    type: 'physical_gift',
    pointsSpent: 16000,
    createdAt: '2026-10-10 11:15',
    status: 'delivered',
    trackingNumber: 'BLUEDART-849921092',
    carrier: 'BlueDart Express',
    deliveryAddress: 'Shop No. 4, Ground Floor, Laxmi Niwas, SV Road, Malad West, Mumbai 400064'
  },
  {
    id: 'ord-c-1001',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    rewardId: 'rew-c-1',
    rewardTitle: 'Instant Cash Payout (Bank Account / UPI Transfer)',
    type: 'cash',
    pointsSpent: 20000,
    createdAt: '2026-10-15 17:30',
    status: 'redeemed',
    cashAmount: 5000,
    destinationAccount: 'HDFC Bank •••• 4091',
    utrNumber: 'HDFC894410294'
  }
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-2026-1001',
    payoutNumber: 'PAY-OCT-8419',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    storeCode: 'RT-8421',
    pointsRedeemed: 20000,
    grossAmount: 5000,
    deductionsTds: 0,
    netAmount: 5000,
    status: 'paid',
    destination: 'HDFC Bank •••• 4091',
    destinationType: 'bank',
    requestedDate: '2026-10-15 14:10',
    processedDate: '2026-10-15 17:30',
    utrReference: 'HDFC894410294',
    batchId: 'BATCH-20261015-01'
  },
  {
    id: 'pay-2026-0902',
    payoutNumber: 'PAY-SEP-7712',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    storeCode: 'RT-8421',
    pointsRedeemed: 32000,
    grossAmount: 8000,
    deductionsTds: 0,
    netAmount: 8000,
    status: 'paid',
    destination: 'rajesh.sharma@okhdfcbank',
    destinationType: 'upi',
    requestedDate: '2026-09-28 10:20',
    processedDate: '2026-09-28 15:45',
    utrReference: 'UPI2026092899410',
    batchId: 'BATCH-20260928-03'
  },
  {
    id: 'pay-2026-1002',
    payoutNumber: 'PAY-OCT-9904',
    retailerId: 'store-2',
    retailerName: 'Apex Industrial Tools & Supplies',
    storeCode: 'RT-9102',
    pointsRedeemed: 40000,
    grossAmount: 10000,
    deductionsTds: 100,
    netAmount: 9900,
    status: 'approved',
    destination: 'ICICI Bank •••• 8832',
    destinationType: 'bank',
    requestedDate: '2026-10-24 16:00',
    batchId: 'BATCH-20261025-PENDING'
  }
];

export const INITIAL_PERFORMANCE: SalesPerformance = {
  period: 'October 2026',
  targetSales: 450000,
  achievedSales: 382500,
  achievementPercentage: 85,
  remainingTarget: 67500,
  invoiceCount: 4,
  activeSkusCount: 18,
  pointsEarned: 8425,
  focusProducts: [
    {
      sku: 'POL-W-250-RD',
      name: 'Polycab 2.5 sq mm Copper Wire 90m',
      brand: 'Polycab',
      category: 'Wires & Cables',
      monthlyTargetUnits: 80,
      achievedUnits: 72,
      achievementPercentage: 90,
      eligibleSales: 176400,
      pointsEarned: 4410,
      incentiveRule: '2.5% points rate + 20% festive surge bonus',
      trend: 'up'
    },
    {
      sku: 'HAV-MCB-32A',
      name: 'Havells 32A DP MCB Switchgear',
      brand: 'Havells',
      category: 'Switchgear',
      monthlyTargetUnits: 50,
      achievedUnits: 44,
      achievementPercentage: 88,
      eligibleSales: 43120,
      pointsEarned: 1078,
      incentiveRule: '2.5% standard eligible points',
      trend: 'up'
    },
    {
      sku: 'PHI-LED-20W',
      name: 'Philips Stellar 20W LED Batten Light',
      brand: 'Philips',
      category: 'Lighting',
      monthlyTargetUnits: 90,
      achievedUnits: 65,
      achievementPercentage: 72,
      eligibleSales: 41600,
      pointsEarned: 1040,
      incentiveRule: '2.5% standard eligible points',
      trend: 'stable'
    },
    {
      sku: 'HAV-SW-ROMA-6M',
      name: 'Anchor Roma Classic 6M Face Plate',
      brand: 'Anchor',
      category: 'Modular Switches',
      monthlyTargetUnits: 200,
      achievedUnits: 185,
      achievementPercentage: 92.5,
      eligibleSales: 51800,
      pointsEarned: 1295,
      incentiveRule: '2.5% standard + 10% volume kicker',
      trend: 'up'
    }
  ]
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk-402',
    title: 'Diwali Festive Shelf Display Compliance Photo',
    category: 'display_compliance',
    pointsReward: 800,
    estimatedMinutes: 3,
    dueDate: '2026-10-31',
    status: 'approved',
    description: 'Capture a clear storefront photo showing the branded Havells & Polycab festive display banner prominently visible at counter height.'
  },
  {
    id: 'tsk-403',
    title: 'Store Expansion & Smart Home Retailer Survey',
    category: 'survey',
    pointsReward: 500,
    estimatedMinutes: 4,
    dueDate: '2026-11-05',
    status: 'assigned',
    description: 'Provide quick feedback on customer demand for Wi-Fi enabled smart switches and BLDC fan accessories in your locality.',
    surveyQuestions: [
      {
        id: 'q1',
        question: 'What percentage of your walk-in customers inquire about IoT / Smart Home switches?',
        options: ['Less than 10%', '10% to 25%', '25% to 50%', 'More than 50%']
      },
      {
        id: 'q2',
        question: 'Which brand currently leads customer preference for BLDC ceiling fans in your area?',
        options: ['Havells', 'Atomberg', 'Orient Electric', 'Crompton', 'Other']
      },
      {
        id: 'q3',
        question: 'Are you interested in holding direct stock consignments for premium touch switches?',
        options: ['Yes, immediately', 'Yes, next quarter', 'Need distributor demo first', 'Not at this stage']
      }
    ]
  },
  {
    id: 'tsk-404',
    title: 'Polycab Green Wire FR-LSH Safety Certification Quiz',
    category: 'training',
    pointsReward: 600,
    estimatedMinutes: 5,
    dueDate: '2026-11-10',
    status: 'assigned',
    description: 'Watch the 2-minute product video and answer 3 technical questions about Flame Retardant Low Smoke zero halogen wire standards.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    surveyQuestions: [
      {
        id: 'tq1',
        question: 'What does FR-LSH stand for in commercial wiring specs?',
        options: ['Fast Resistance Low Shock Heat', 'Flame Retardant Low Smoke Low Halogen', 'Fireproof Rubber Line Safe High', 'Flexible Rigid Low Synthetic Housing']
      },
      {
        id: 'tq2',
        question: 'What is the oxygen index rating of Polycab FR-LSH wires?',
        options: ['Greater than 29%', 'Less than 15%', 'Exactly 21%', 'Greater than 45%']
      }
    ]
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-701',
    ticketNumber: 'TKT-2026-701',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    category: 'invoice',
    subject: 'Query regarding OCR re-upload for invoice INV-2026-9311',
    linkedReferenceId: 'inv-claim-103',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-10-21 14:15',
    updatedAt: '2026-10-22 10:30',
    assignedAgent: 'Pooja K. (Ops Support)',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'Rajesh Sharma',
        timestamp: '2026-10-21 14:15',
        text: 'Hello, the system requested a re-upload of INV-2026-9311 due to blur. I have requested the distributor for the original digital PDF. Can I upload it here directly?'
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Pooja K. (Ops Support)',
        timestamp: '2026-10-22 10:30',
        text: 'Hello Rajesh ji, yes! You can either use the "Re-upload Document" button on the invoice claim detail screen or upload it right away in the portal. Once submitted, our team will process the 62,000 INR eligible value within 4 business hours.'
      }
    ]
  },
  {
    id: 'tkt-702',
    ticketNumber: 'TKT-2026-682',
    retailerId: 'store-1',
    retailerName: 'Shree Krishna Electricals & Hardware',
    category: 'payout',
    subject: 'Confirmation of UPI Settlement UTR HDFC894410294',
    linkedReferenceId: 'pay-2026-1001',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-10-16 09:00',
    updatedAt: '2026-10-16 11:20',
    assignedAgent: 'Vikram S. (Finance Operations)',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        senderName: 'Rajesh Sharma',
        timestamp: '2026-10-16 09:00',
        text: 'Received the ₹5,000 payout in my HDFC account. Thanks for the quick processing!'
      },
      {
        id: 'm4',
        sender: 'agent',
        senderName: 'Vikram S. (Finance Operations)',
        timestamp: '2026-10-16 11:20',
        text: 'Glad to assist Rajesh ji. Your loyalty payout statement has been archived in the Payments tab for your GST bookkeeping.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Claim Approved: 2,700 Points Credited',
    message: 'Invoice claim INV-2026-9481 from Reliance Trade Logistics has been verified and settled.',
    timestamp: '2026-10-23 09:15',
    category: 'claim',
    isRead: false,
    linkAction: 'invoices'
  },
  {
    id: 'notif-2',
    title: 'Action Needed: Invoice INV-2026-9311 Needs Info',
    message: 'Distributor GSTIN was obscured in the uploaded receipt. Please re-upload a clear copy to unlock points.',
    timestamp: '2026-10-20 16:40',
    category: 'claim',
    isRead: false,
    linkAction: 'invoices'
  },
  {
    id: 'notif-3',
    title: 'Payout Dispatched: ₹5,000 Settled',
    message: 'Your cash payout request has been transferred via IMPS to HDFC Bank (UTR: HDFC894410294).',
    timestamp: '2026-10-15 17:35',
    category: 'payout',
    isRead: true,
    linkAction: 'payments'
  },
  {
    id: 'notif-4',
    title: 'New Campaign: 20% Festive Surge Active',
    message: 'Earn 1.2x points on all Polycab wire invoices submitted before 10th November 2026.',
    timestamp: '2026-10-05 10:00',
    category: 'campaign',
    isRead: true,
    linkAction: 'performance'
  }
];

export const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'cmp-festive-2026',
    name: 'Diwali Festive Surge 2026',
    status: 'active',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    budgetAllocated: 2500000,
    budgetBurned: 1680000,
    targetSegment: 'Gold & Platinum Tier Stores',
    multiplier: '1.2x Points',
    description: 'Promotional loyalty multiplier on high-tension copper wiring and designer switches for festive season renovations.'
  },
  {
    id: 'cmp-switchgear-blitz',
    name: 'Havells Switchgear Volume Blitz',
    status: 'active',
    startDate: '2026-10-15',
    endDate: '2026-11-30',
    budgetAllocated: 1200000,
    budgetBurned: 420000,
    targetSegment: 'All Retailers',
    multiplier: '+500 Pts per 50 Units',
    description: 'Flat bonus points tier unlocked on reaching 50+ units of modular MCB switches.'
  },
  {
    id: 'cmp-monsoon-clearance',
    name: 'Monsoon Waterproofing Clearance',
    status: 'completed',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    budgetAllocated: 800000,
    budgetBurned: 792000,
    targetSegment: 'West & South Territores',
    multiplier: '1.15x Points',
    description: 'Accelerated reward payout for heavy-duty outdoor junction boxes and conduit lines.'
  }
];

export const INITIAL_EARN_RULES: EarnRuleItem[] = [
  {
    id: 'rule-base-tier',
    name: 'Standard Wholesale Eligible Line Reward',
    description: 'Base loyalty reward rate applied to all eligible distributor tax invoices.',
    category: 'Universal Base',
    rateDescription: '2.5% of net invoice value (1 Point per ₹40 purchase)',
    minInvoiceValue: 5000,
    maxCapPoints: 10000,
    isActive: true,
    ruleVersion: 'v4.2-2026Q4'
  },
  {
    id: 'rule-festive-polycab',
    name: 'Polycab High-Performance Copper Surge',
    description: 'Tier kicker for premium certified copper wire SKUs.',
    category: 'Wires & Cables',
    rateDescription: '3.0% of net invoice value (1.2x multiplier applied)',
    minInvoiceValue: 10000,
    maxCapPoints: 15000,
    isActive: true,
    ruleVersion: 'v4.2-2026Q4'
  },
  {
    id: 'rule-task-compliance',
    name: 'Merchandising & Survey Incentives',
    description: 'Flat reward credited instantly upon verified task/photo approval.',
    category: 'Field Execution',
    rateDescription: '500 - 1,000 Points per verified survey/compliance evidence',
    minInvoiceValue: 0,
    maxCapPoints: 5000,
    isActive: true,
    ruleVersion: 'v4.1'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-991',
    timestamp: '2026-10-23 09:15:22 UTC',
    actor: 'Anand V. (Ops Reviewer)',
    actorRole: 'operations',
    action: 'APPROVE_INVOICE_CLAIM',
    target: 'INV-2026-9481 (Retailer: RT-8421)',
    details: 'Approved claim for ₹1,08,000 eligible value. Credited 2,700 points to wallet ledger.',
    ipAddress: '10.240.12.84'
  },
  {
    id: 'aud-990',
    timestamp: '2026-10-21 16:40:05 UTC',
    actor: 'Rajesh Sharma',
    actorRole: 'retailer',
    action: 'REDEEM_VOUCHER',
    target: 'AMZ-9941-8842-KL77 (Amazon Pay ₹2,500)',
    details: 'Deducted 10,000 points. Atomic inventory decrease. Code encrypted & revealed in portal.',
    ipAddress: '157.34.192.40'
  },
  {
    id: 'aud-989',
    timestamp: '2026-10-20 16:40:11 UTC',
    actor: 'Pooja K. (Ops Claim Specialist)',
    actorRole: 'operations',
    action: 'SET_CLAIM_NEEDS_INFO',
    target: 'INV-2026-9311 (Retailer: RT-8421)',
    details: 'Flagged for blurred distributor GSTIN. Dispatched push & SMS notification to store owner.',
    ipAddress: '10.240.14.19'
  },
  {
    id: 'aud-988',
    timestamp: '2026-10-15 17:30:48 UTC',
    actor: 'Finance Automated Settlement Gateway',
    actorRole: 'finance',
    action: 'EXECUTE_PAYOUT_BATCH',
    target: 'PAY-OCT-8419 (Amount: ₹5,000)',
    details: 'Settled via HDFC IMPS gateway. Bank reference UTR HDFC894410294 verified. Reconciled.',
    ipAddress: '10.128.0.5'
  }
];

// Historical trend data for real Recharts area and bar charts
export const SALES_TREND_DATA = [
  { date: '10/01', eligibleSales: 32000, pointsIssued: 800, pointsRedeemed: 0 },
  { date: '10/05', eligibleSales: 48000, pointsIssued: 1200, pointsRedeemed: 2500 },
  { date: '10/09', eligibleSales: 65000, pointsIssued: 1625, pointsRedeemed: 0 },
  { date: '10/13', eligibleSales: 145000, pointsIssued: 3625, pointsRedeemed: 0 },
  { date: '10/16', eligibleSales: 52000, pointsIssued: 1300, pointsRedeemed: 20000 },
  { date: '10/20', eligibleSales: 78000, pointsIssued: 1950, pointsRedeemed: 0 },
  { date: '10/23', eligibleSales: 112500, pointsIssued: 2700, pointsRedeemed: 10000 },
  { date: '10/25', eligibleSales: 84000, pointsIssued: 2100, pointsRedeemed: 0 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Wires & Cables', value: 46, color: '#153B2B' },
  { name: 'Modular Switches', value: 24, color: '#C8F43D' },
  { name: 'Switchgear (MCB)', value: 18, color: '#0284C7' },
  { name: 'LED Lighting', value: 12, color: '#D97706' }
];
