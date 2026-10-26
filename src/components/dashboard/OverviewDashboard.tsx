import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  FileText, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Gift, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { SALES_TREND_DATA, CATEGORY_DISTRIBUTION } from '../../data/mockData';

export const OverviewDashboard: React.FC = () => {
  const { 
    currentStore, 
    userRole, 
    setActiveNav, 
    setIsUploadModalOpen, 
    invoices, 
    ledgerEvents,
    performance,
    payouts,
    tasks
  } = useApp();

  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const pendingClaims = invoices.filter(i => i.status === 'pending_review' || i.status === 'needs_info');
  const totalPaidCash = payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.netAmount, 0);
  const totalPendingCash = payouts.filter(p => p.status === 'requested' || p.status === 'approved').reduce((acc, p) => acc + p.netAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Greeting & Primary Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">{currentStore.code}</span>
            <span>·</span>
            <span>{currentStore.territory}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#153B2B]">
              <Award className="w-3.5 h-3.5 text-[#D97706]" />
              {currentStore.tier} Tier Partner
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#172018]">
            Good morning, {currentStore.ownerName}
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Overview of your store loyalty earnings, invoice claims, and Q4 sales targets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveNav('performance')}
            className="px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] border border-[#DDE4D8] rounded-xl transition-colors cursor-pointer"
          >
            Target: {performance.achievementPercentage}% Achieved
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. Distinctive Banking-Style KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Available Points */}
        <div 
          onClick={() => setActiveNav('wallet')}
          className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] hover:border-[#153B2B] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#697565] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Wallet</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center group-hover:bg-[#153B2B] group-hover:text-[#C8F43D] transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#172018] font-tabular">
            {currentStore.availablePoints.toLocaleString()} <span className="text-xs font-semibold text-[#697565]">Pts</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F7F3] text-xs">
            <span className="text-[#697565] font-tabular">
              ≈ ₹{(currentStore.availablePoints * currentStore.cashEquivalentRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} Cash
            </span>
            <span className="flex items-center gap-0.5 font-semibold text-[#16A34A] text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
        </div>

        {/* Metric 2: Pending Claims */}
        <div 
          onClick={() => setActiveNav(userRole === 'retailer' ? 'invoices' : 'crm-claims')}
          className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] hover:border-[#153B2B] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#697565] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">In Verification</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#172018] font-tabular">
            {currentStore.pendingPoints.toLocaleString()} <span className="text-xs font-semibold text-[#697565]">Pts</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F7F3] text-xs">
            <span className="text-[#697565]">
              {pendingClaims.length} active claims pending
            </span>
            <span className="text-[#D97706] font-semibold text-[11px]">
              Est. ~4h SLA
            </span>
          </div>
        </div>

        {/* Metric 3: Total Cash Settled */}
        <div 
          onClick={() => setActiveNav('payments')}
          className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] hover:border-[#153B2B] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#697565] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Cash Paid</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#172018] font-tabular">
            ₹{totalPaidCash.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F7F3] text-xs">
            <span className="text-[#697565]">
              Settled to Bank/UPI
            </span>
            <span className="text-[#16A34A] font-semibold text-[11px] flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Verified
            </span>
          </div>
        </div>

        {/* Metric 4: Target Attainment */}
        <div 
          onClick={() => setActiveNav('performance')}
          className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] hover:border-[#153B2B] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#697565] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">October Target</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#172018] font-tabular">
            {performance.achievementPercentage}% <span className="text-xs font-normal text-[#697565]">of ₹4.5L</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#EAEFE6] rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className="bg-[#153B2B] h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${performance.achievementPercentage}%` }} 
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-[#697565]">
            <span>₹{(performance.remainingTarget / 1000).toFixed(1)}k to target</span>
            <span className="font-semibold text-[#153B2B]">Tier Bonus Unlocks</span>
          </div>
        </div>
      </div>

      {/* 3. Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart: Eligible Sales Trend */}
        <div className="lg:col-span-8 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#172018]">
                Eligible Wholesale Sales Trend
              </h2>
              <p className="text-xs text-[#697565]">
                Verified distributor purchases qualifying for 2.5% points rate and festive multipliers.
              </p>
            </div>
            {/* Segmented Time Control */}
            <div className="flex items-center bg-[#F5F7F3] p-1 rounded-lg border border-[#E5EAE1] self-start sm:self-auto">
              {(['daily', 'weekly', 'monthly'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setTrendPeriod(period)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                    trendPeriod === period 
                      ? 'bg-[#FFFFFF] text-[#153B2B] font-semibold shadow-2xs' 
                      : 'text-[#697565] hover:text-[#172018]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#153B2B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#153B2B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAE1" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={{ stroke: '#E5EAE1' }} 
                  tick={{ fontSize: 11, fill: '#697565' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 11, fill: '#697565' }} 
                  tickFormatter={(val) => `₹${val / 1000}k`} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Eligible Sales']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5EAE1', fontSize: 12 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="eligibleSales" 
                  stroke="#153B2B" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#salesGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart: Points Inflow vs Redemptions */}
        <div className="lg:col-span-4 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-[#172018]">Points Dynamics</h2>
              <span className="text-[11px] font-semibold text-[#153B2B] bg-[#EAEFE6] px-2 py-0.5 rounded-md">
                October
              </span>
            </div>
            <p className="text-xs text-[#697565] mb-4">
              Points earned via invoices vs redeemed for vouchers & cash.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_TREND_DATA.slice(0, 5)} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAE1" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#697565' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#697565' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5EAE1', fontSize: 12 }}
                  />
                  <Bar dataKey="pointsIssued" name="Earned" fill="#153B2B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pointsRedeemed" name="Redeemed" fill="#C8F43D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5EAE1] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#153B2B]" />
              <span className="text-[#697565]">Points Earned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#C8F43D]" />
              <span className="text-[#697565]">Points Redeemed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Operational Panels: Needs Attention & Unified Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Needs Attention Queue */}
        <div className="lg:col-span-6 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-sm font-bold text-[#172018]">Needs Attention Queue</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              2 Action Items
            </span>
          </div>

          <div className="space-y-3">
            {/* Item 1: Invoice Needs Info */}
            <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172018]">
                    INV-2026-9311: Distributor GSTIN Blurred
                  </h4>
                  <p className="text-xs text-[#697565] mt-0.5">
                    Uploaded receipt had blurry lower edge. Re-upload clean digital PDF to claim ₹62,000 eligible value.
                  </p>
                  <span className="text-[10px] text-[#94A3B8] font-tabular mt-1 inline-block">
                    Age: 3 days · Ops Reviewer: Pooja K.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-lg shrink-0 cursor-pointer shadow-2xs"
              >
                Re-upload
              </button>
            </div>

            {/* Item 2: Task survey pending */}
            <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172018]">
                    Smart Home Retailer Survey (+500 Pts)
                  </h4>
                  <p className="text-xs text-[#697565] mt-0.5">
                    Share customer demand feedback for Wi-Fi touch switches in West Mumbai. Takes 3 mins.
                  </p>
                  <span className="text-[10px] text-[#94A3B8] font-tabular mt-1 inline-block">
                    Due: 05 Nov 2026
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveNav('tasks')}
                className="px-2.5 py-1 text-xs font-semibold text-[#172018] bg-[#FFFFFF] hover:bg-[#F5F7F3] border border-[#DDE4D8] rounded-lg shrink-0 cursor-pointer"
              >
                Complete
              </button>
            </div>
          </div>
        </div>

        {/* Unified Activity Timeline */}
        <div className="lg:col-span-6 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#172018]">Recent Loyalty Activity</h2>
            <button
              onClick={() => setActiveNav('wallet')}
              className="text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer"
            >
              View Full Ledger →
            </button>
          </div>

          <div className="space-y-3">
            {ledgerEvents.slice(0, 4).map((evt) => {
              const isCredit = evt.points > 0;
              return (
                <div key={evt.id} className="flex items-center justify-between py-2 border-b border-[#F5F7F3] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCredit ? 'bg-[#EAF7EE] text-[#16A34A]' : 'bg-[#F5F7F3] text-[#172018]'
                    }`}>
                      {isCredit ? '+' : '−'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172018]">{evt.description}</div>
                      <div className="text-[11px] text-[#697565] font-tabular">
                        {evt.timestamp} · {evt.actor}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-bold font-tabular ${
                      isCredit ? 'text-[#16A34A]' : 'text-[#172018]'
                    }`}>
                      {isCredit ? '+' : ''}{evt.points.toLocaleString()} Pts
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-tabular">
                      Bal: {evt.balanceAfter.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Focus Products High-Yield Grid */}
      <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#172018]">Focus Incentive Products (Q4 Target)</h2>
            <p className="text-xs text-[#697565]">Higher reward multipliers and distributor volume kickers</p>
          </div>
          <button
            onClick={() => setActiveNav('performance')}
            className="text-xs font-semibold text-[#153B2B] hover:underline cursor-pointer self-start sm:self-auto"
          >
            Explore Performance Breakdown →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performance.focusProducts.map((prod) => (
            <div key={prod.sku} className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#697565]">
                <span>{prod.brand}</span>
                <span className="font-semibold text-[#153B2B]">{prod.category}</span>
              </div>
              <h4 className="text-xs font-bold text-[#172018] line-clamp-1">
                {prod.name}
              </h4>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-[#697565]">Progress:</span>
                <span className="text-xs font-bold text-[#172018] font-tabular">
                  {prod.achievedUnits} / {prod.monthlyTargetUnits} Units ({prod.achievementPercentage}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#E5EAE1] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#153B2B] h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, prod.achievementPercentage)}%` }} 
                />
              </div>
              <div className="text-[10px] text-[#153B2B] font-medium bg-[#EAEFE6] px-2 py-1 rounded">
                ⚡ {prod.incentiveRule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
