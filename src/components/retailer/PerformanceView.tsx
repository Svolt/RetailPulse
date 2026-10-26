import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Award, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CATEGORY_DISTRIBUTION } from '../../data/mockData';

export const PerformanceView: React.FC = () => {
  const { performance, currentStore, setActiveNav, setIsUploadModalOpen } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('October 2026');

  const focusData = performance.focusProducts.map(p => ({
    name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
    achieved: p.achievedUnits,
    target: p.monthlyTargetUnits,
    percentage: p.achievementPercentage
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">{performance.period}</span>
            <span>·</span>
            <span className="text-[#153B2B] font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#D97706]" /> {currentStore.tier} Tier Status
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Sales Targets & Focus Product Intelligence
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Monitor target progress across distributor dispatches, focus brand SKUs, and volume tier bonuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            Upload Invoices for Target
          </button>
        </div>
      </div>

      {/* Target Progress Hero Card */}
      <div className="bg-[#153B2B] text-[#FFFFFF] p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#C8F43D] font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Target Achievement Status · {performance.period}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              ₹{performance.achievedSales.toLocaleString()} <span className="text-sm font-normal text-[#DDE4D8]">of ₹{performance.targetSales.toLocaleString()} Target</span>
            </h2>
            <p className="text-xs text-[#DDE4D8] max-w-lg leading-relaxed">
              You are currently at {performance.achievementPercentage}% of your monthly eligible wholesale threshold. Only ₹{performance.remainingTarget.toLocaleString()} needed to unlock the 5,000 Pts Platinum Tier bonus!
            </p>

            {/* Main Progress Bar */}
            <div className="w-full bg-[#1E4D38] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#C8F43D] h-3 rounded-full transition-all duration-700"
                style={{ width: `${performance.achievementPercentage}%` }}
              />
            </div>
          </div>

          <div className="md:col-span-4 bg-[#1E4D38]/60 p-4 rounded-xl border border-[#C8F43D]/20 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#DDE4D8]">
              <span>Invoices Processed:</span>
              <span className="font-bold text-[#FFFFFF] font-tabular">{performance.invoiceCount} Claims</span>
            </div>
            <div className="flex items-center justify-between text-[#DDE4D8]">
              <span>Active SKUs Sold:</span>
              <span className="font-bold text-[#FFFFFF] font-tabular">{performance.activeSkusCount} Catalog Items</span>
            </div>
            <div className="flex items-center justify-between text-[#DDE4D8]">
              <span>Reward Points Credited:</span>
              <span className="font-bold text-[#C8F43D] font-tabular">+{performance.pointsEarned.toLocaleString()} Pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Focus Products Achievement Bar Chart + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Target vs Actual Units */}
        <div className="lg:col-span-8 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#172018]">Focus SKU Unit Target vs Achieved</h2>
              <p className="text-xs text-[#697565]">Units sold through verified distributor invoices</p>
            </div>
            <span className="text-[11px] font-semibold text-[#153B2B] bg-[#EAEFE6] px-2.5 py-1 rounded-md">
              Monthly Progress
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAE1" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#697565' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#697565' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5EAE1', fontSize: 12 }}
                />
                <Bar dataKey="target" name="Target Units" fill="#E5EAE1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="achieved" name="Achieved Units" fill="#153B2B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Donut */}
        <div className="lg:col-span-4 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172018] mb-1">Eligible Category Mix</h2>
            <p className="text-xs text-[#697565] mb-4">Percentage share of wholesale sales</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5EAE1', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#F5F7F3] text-xs">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#697565]">{cat.name}</span>
                </div>
                <span className="font-bold text-[#172018] font-tabular">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Products Master Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EAE1] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E5EAE1]">
          <h2 className="text-sm font-bold text-[#172018]">Focus Product Incentive Matrix</h2>
          <p className="text-xs text-[#697565]">Line items qualifying for enhanced points multipliers</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#697565] border-b border-[#E5EAE1]">
                <th className="py-3 px-4 font-semibold">SKU / Product Name</th>
                <th className="py-3 px-4 font-semibold">Brand / Category</th>
                <th className="py-3 px-4 font-semibold text-center">Monthly Target</th>
                <th className="py-3 px-4 font-semibold text-center">Achieved</th>
                <th className="py-3 px-4 font-semibold text-right">Eligible Sales</th>
                <th className="py-3 px-4 font-semibold text-right">Points Earned</th>
                <th className="py-3 px-4 font-semibold">Incentive Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE1]">
              {performance.focusProducts.map((prod) => (
                <tr key={prod.sku} className="hover:bg-[#FAFBF9] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#172018]">{prod.name}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{prod.sku}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#172018]">{prod.brand}</div>
                    <div className="text-[10px] text-[#697565]">{prod.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-tabular text-[#697565]">
                    {prod.monthlyTargetUnits} Units
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-[#153B2B] font-tabular">
                      {prod.achievedUnits} Units
                    </span>
                    <div className="text-[10px] text-[#16A34A] font-semibold">
                      ({prod.achievementPercentage}%)
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#172018] font-tabular">
                    ₹{prod.eligibleSales.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#16A34A] font-tabular">
                    +{prod.pointsEarned.toLocaleString()} Pts
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-medium bg-[#EAEFE6] text-[#153B2B] px-2 py-1 rounded">
                      {prod.incentiveRule}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
