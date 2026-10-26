import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Calendar, 
  Eye, 
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generatePerformanceCSV, generatePerformancePDF } from '../../utils/exportReport';
import { SALES_TREND_DATA } from '../../data/mockData';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ isOpen, onClose }) => {
  const { currentStore, performance, invoices, payouts } = useApp();
  
  const [reportPeriod, setReportPeriod] = useState<string>('Current Week (19 Oct – 25 Oct 2026)');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure');

  if (!isOpen) return null;

  const handleExportCSV = () => {
    generatePerformanceCSV({
      store: currentStore,
      performance,
      invoices,
      payouts,
      dateRangeLabel: reportPeriod,
      reportPeriod: performance.period
    });
    setDownloadSuccess('CSV report downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleExportPDF = () => {
    generatePerformancePDF({
      store: currentStore,
      performance,
      invoices,
      payouts,
      dateRangeLabel: reportPeriod,
      reportPeriod: performance.period
    });
    setDownloadSuccess('PDF report generated and downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#153B2B] text-[#C8F43D] flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172018]">
                Export Weekly Performance & Audit Report
              </h3>
              <p className="text-[11px] text-[#697565]">
                Download official store performance data for management review, territory reporting, and GST tax records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#697565] hover:text-[#172018] rounded-lg hover:bg-[#F5F7F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#FAFBF9] border-b border-[#E5EAE1]">
          <button
            onClick={() => setActiveTab('configure')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'configure' 
                ? 'border-[#153B2B] text-[#153B2B]' 
                : 'border-transparent text-[#697565] hover:text-[#172018]'
            }`}
          >
            Report Configuration & Downloads
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview' 
                ? 'border-[#153B2B] text-[#153B2B]' 
                : 'border-transparent text-[#697565] hover:text-[#172018]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Data Preview</span>
          </button>
        </div>

        {/* Success alert */}
        {downloadSuccess && (
          <div className="m-6 mb-0 p-3 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#16A34A] font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Modal Body */}
        {activeTab === 'configure' ? (
          <div className="p-6 space-y-6">
            {/* Period selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#172018]">
                Select Audit Timeframe
              </label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl px-3 py-2.5 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
              >
                <option value="Current Week (19 Oct – 25 Oct 2026)">Current Week (19 Oct – 25 Oct 2026)</option>
                <option value="Previous Week (12 Oct – 18 Oct 2026)">Previous Week (12 Oct – 18 Oct 2026)</option>
                <option value="Month-to-Date (October 2026)">Month-to-Date (October 2026)</option>
                <option value="Q4 Festive Surge Period">Q4 Festive Surge Period (Full Cycle)</option>
              </select>
            </div>

            {/* Scope Summary */}
            <div className="p-4 bg-[#F5F7F3] rounded-xl border border-[#E5EAE1] space-y-2 text-xs">
              <div className="font-semibold text-[#172018] flex items-center justify-between">
                <span>Included Audit Sections in Report:</span>
                <span className="text-[10px] text-[#153B2B] font-mono bg-[#EAEFE6] px-2 py-0.5 rounded">
                  Reconciled Invariants
                </span>
              </div>
              <ul className="space-y-1.5 text-[#697565]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Store profile, dealer tier ({currentStore.tier}), and distributor mapping.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Available points balance ({currentStore.availablePoints.toLocaleString()} Pts) & net cash valuation.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Eligible wholesale sales volume & Q4 target progress ({performance.achievementPercentage}%).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Focus SKU breakdown: Polycab copper wires, Havells MCB, Anchor plates.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Audit-grade distributor invoice claims & OCR confidence score verification.</span>
                </li>
              </ul>
            </div>

            {/* Download Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* CSV Card */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-4 bg-[#FFFFFF] hover:bg-[#FAFBF9] border-2 border-[#DDE4D8] hover:border-[#153B2B] rounded-2xl text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#172018]">Download CSV Spreadsheet</div>
                <p className="text-xs text-[#697565] mt-1">
                  Structured multi-section CSV with raw numbers for Excel, Google Sheets, or ERP import.
                </p>
                <div className="mt-3 text-xs font-semibold text-[#153B2B] flex items-center gap-1">
                  <span>Export .CSV File</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* PDF Card */}
              <button
                type="button"
                onClick={handleExportPDF}
                className="p-4 bg-[#153B2B] text-[#FFFFFF] hover:bg-[#1E4D38] rounded-2xl text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#C8F43D] text-[#153B2B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#FFFFFF]">Download Formatted PDF</div>
                <p className="text-xs text-[#DDE4D8] mt-1">
                  Official branded corporate PDF with tables, visual hierarchy, and managerial signoff headers.
                </p>
                <div className="mt-3 text-xs font-semibold text-[#C8F43D] flex items-center gap-1">
                  <span>Export .PDF Document</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
            {/* Header preview */}
            <div className="p-3 bg-[#F5F7F3] rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-[#172018]">{currentStore.name} ({currentStore.code})</div>
                <div className="text-[11px] text-[#697565]">{currentStore.territory} · {currentStore.tier} Tier</div>
              </div>
              <span className="text-[10px] font-semibold text-[#153B2B] bg-[#EAEFE6] px-2 py-1 rounded">
                Period: {reportPeriod}
              </span>
            </div>

            {/* KPI grid preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg">
                <span className="text-[10px] text-[#697565]">Available Balance</span>
                <div className="font-bold text-[#172018] font-tabular mt-0.5">{currentStore.availablePoints.toLocaleString()} Pts</div>
              </div>
              <div className="p-2.5 bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg">
                <span className="text-[10px] text-[#697565]">Target Progress</span>
                <div className="font-bold text-[#153B2B] font-tabular mt-0.5">{performance.achievementPercentage}% Achieved</div>
              </div>
              <div className="p-2.5 bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg">
                <span className="text-[10px] text-[#697565]">Achieved Sales</span>
                <div className="font-bold text-[#172018] font-tabular mt-0.5">₹{performance.achievedSales.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg">
                <span className="text-[10px] text-[#697565]">Paid Cash</span>
                <div className="font-bold text-[#16A34A] font-tabular mt-0.5">₹{payouts.filter(p => p.status === 'paid').reduce((a, b) => a + b.netAmount, 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Focus product table preview */}
            <div>
              <div className="font-bold text-[#172018] mb-1.5">Focus Products Target Status:</div>
              <div className="border border-[#E5EAE1] rounded-xl overflow-hidden divide-y divide-[#E5EAE1]">
                {performance.focusProducts.map(p => (
                  <div key={p.sku} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#172018]">{p.name}</span>
                      <span className="text-[10px] text-[#697565] block">Target: {p.monthlyTargetUnits} U · Achieved: {p.achievedUnits} U ({p.achievementPercentage}%)</span>
                    </div>
                    <span className="font-bold text-[#153B2B] font-tabular">+{p.pointsEarned.toLocaleString()} Pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold text-[#172018] bg-[#F5F7F3] hover:bg-[#EAEFE6] rounded-xl border border-[#DDE4D8] cursor-pointer"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl cursor-pointer"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
