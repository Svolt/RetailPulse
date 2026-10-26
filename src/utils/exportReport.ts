import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StoreContext, SalesPerformance, InvoiceClaim, PayoutRecord } from '../types';
import { SALES_TREND_DATA } from '../data/mockData';

export interface ExportReportOptions {
  store: StoreContext;
  performance: SalesPerformance;
  invoices: InvoiceClaim[];
  payouts: PayoutRecord[];
  dateRangeLabel?: string;
  reportPeriod?: string;
}

/**
 * Generate and download a comprehensive CSV Weekly Performance Report
 */
export const generatePerformanceCSV = ({
  store,
  performance,
  invoices,
  payouts,
  dateRangeLabel = 'Last 7 Days',
  reportPeriod = 'October 2026'
}: ExportReportOptions) => {
  const now = new Date();
  const dateFormatted = now.toISOString().substring(0, 10);
  const timeFormatted = now.toLocaleTimeString();

  const totalPaidCash = payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.netAmount, 0);
  const totalPendingCash = payouts.filter(p => p.status === 'approved' || p.status === 'requested').reduce((acc, p) => acc + p.netAmount, 0);

  const lines: string[] = [];

  // 1. Report Header
  lines.push(`"RETAILPULSE DIGITAL LOYALTY CRM - WEEKLY PERFORMANCE & AUDIT REPORT"`);
  lines.push(`"Generated On:","${dateFormatted} ${timeFormatted}"`);
  lines.push(`"Reporting Period:","${reportPeriod} (${dateRangeLabel})"`);
  lines.push(`"Store Code:","${store.code}"`);
  lines.push(`"Store Legal Name:","${store.name}"`);
  lines.push(`"Owner / Operator:","${store.ownerName}"`);
  lines.push(`"Territory:","${store.territory}"`);
  lines.push(`"Distributor:","${store.distributor}"`);
  lines.push(`"Programme Tier:","${store.tier} Partner"`);
  lines.push(``);

  // 2. Executive KPI Summary
  lines.push(`"--- EXECUTIVE KPI SUMMARY ---"`);
  lines.push(`"Metric","Value","Notes"`);
  lines.push(`"Available Loyalty Points",${store.availablePoints},"Active spendable wallet balance"`);
  lines.push(`"Points Cash Valuation (INR)",${(store.availablePoints * store.cashEquivalentRate).toFixed(2)},"Conversion rate: 4 pts = 1 INR"`);
  lines.push(`"Pending Points In-Verification",${store.pendingPoints},"Awaiting OCR & Ops audit approval"`);
  lines.push(`"Lifetime Points Earned",${store.lifetimePoints},"Historical cumulative earnings"`);
  lines.push(`"Total Cash Paid to Bank (INR)",${totalPaidCash},"Settled via verified IMPS/UPI"`);
  lines.push(`"Pending Cash in Batch (INR)",${totalPendingCash},"In queue for settlement"`);
  lines.push(`"Monthly Sales Target (INR)",${performance.targetSales},"Target threshold"`);
  lines.push(`"Achieved Wholesale Sales (INR)",${performance.achievedSales},"Eligible distributor purchases"`);
  lines.push(`"Target Achievement Percentage","${performance.achievementPercentage}%","Progress towards tier bonus"`);
  lines.push(`"Remaining Target Gap (INR)",${performance.remainingTarget},"Gap to unlock bonus tier"`);
  lines.push(``);

  // 3. Weekly Sales & Points Dynamics
  lines.push(`"--- WEEKLY SALES & POINTS LOG ---"`);
  lines.push(`"Date","Eligible Wholesale Sales (INR)","Points Issued","Points Redeemed","Net Points Delta"`);
  SALES_TREND_DATA.forEach(row => {
    lines.push(`"${row.date}",${row.eligibleSales},${row.pointsIssued},${row.pointsRedeemed},${row.pointsIssued - row.pointsRedeemed}`);
  });
  lines.push(``);

  // 4. Focus Product SKU Targets
  lines.push(`"--- FOCUS PRODUCT SKU INCENTIVE PERFORMANCE ---"`);
  lines.push(`"SKU Code","Product Name","Brand","Category","Monthly Target Units","Achieved Units","Achievement Rate","Eligible Sales (INR)","Points Earned","Incentive Rule"`);
  performance.focusProducts.forEach(prod => {
    lines.push(
      `"${prod.sku}","${prod.name}","${prod.brand}","${prod.category}",${prod.monthlyTargetUnits},${prod.achievedUnits},"${prod.achievementPercentage}%",${prod.eligibleSales},${prod.pointsEarned},"${prod.incentiveRule}"`
    );
  });
  lines.push(``);

  // 5. Recent Invoice Claims
  lines.push(`"--- RECENT INVOICE CLAIMS SUMMARY ---"`);
  lines.push(`"Invoice Number","Date","Distributor / Supplier","Gross Amount (INR)","Eligible Amount (INR)","Calculated Points","Status","OCR Confidence"`);
  invoices.forEach(inv => {
    lines.push(
      `"${inv.invoiceNumber}","${inv.invoiceDate}","${inv.supplierName}",${inv.totalAmount},${inv.eligibleAmount},${inv.calculatedPoints},"${inv.status}","${inv.ocrConfidence}%"`
    );
  });

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Weekly_Performance_Report_${store.code}_${dateFormatted}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate and download a formatted PDF Weekly Performance Report
 */
export const generatePerformancePDF = ({
  store,
  performance,
  invoices,
  payouts,
  dateRangeLabel = 'Last 7 Days',
  reportPeriod = 'October 2026'
}: ExportReportOptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const dateFormatted = now.toISOString().substring(0, 10);
  const totalPaidCash = payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.netAmount, 0);

  // Brand Header Banner
  doc.setFillColor(21, 59, 43); // Deep forest #153B2B
  doc.rect(0, 0, 210, 24, 'F');

  // Brand Title & Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(200, 244, 61); // Vivid Lime #C8F43D
  doc.text('▲ RETAILPULSE LOYALTY CRM', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(245, 247, 243);
  doc.text('WEEKLY PERFORMANCE & OPERATIONS AUDIT REPORT', 14, 17);

  doc.setFontSize(8);
  doc.setTextColor(200, 244, 61);
  doc.text(`CONFIDENTIAL · ${dateFormatted}`, 160, 14);

  // Store Metadata Box
  doc.setFillColor(245, 247, 243); // #F5F7F3
  doc.rect(14, 28, 182, 22, 'F');
  doc.setDrawColor(229, 234, 225);
  doc.rect(14, 28, 182, 22, 'S');

  doc.setTextColor(23, 32, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`${store.name} (${store.code})`, 18, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(105, 117, 101);
  doc.text(`Owner: ${store.ownerName}  |  Territory: ${store.territory}  |  Distributor: ${store.distributor}`, 18, 41);
  doc.text(`Tier: ${store.tier} Member  |  Period: ${reportPeriod} (${dateRangeLabel})  |  Generated: ${now.toLocaleTimeString()}`, 18, 46);

  // KPI Summary Cards Section
  const startY = 54;
  const cardW = 43.5;
  const cardH = 17;
  const kpis = [
    { title: 'AVAILABLE POINTS', value: `${store.availablePoints.toLocaleString()} Pts`, sub: `₹${(store.availablePoints * store.cashEquivalentRate).toFixed(2)} Net Cash` },
    { title: 'PENDING CLAIMS', value: `${store.pendingPoints.toLocaleString()} Pts`, sub: 'In Verification SLA' },
    { title: 'TOTAL CASH PAID', value: `₹${totalPaidCash.toLocaleString()}`, sub: '100% Settled via IMPS' },
    { title: 'TARGET ATTAINMENT', value: `${performance.achievementPercentage}%`, sub: `₹${(performance.achievedSales / 1000).toFixed(1)}k of ₹${(performance.targetSales / 1000).toFixed(1)}k` }
  ];

  kpis.forEach((kpi, index) => {
    const x = 14 + index * (cardW + 2.7);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, startY, cardW, cardH, 2, 2, 'FD');
    doc.setDrawColor(229, 234, 225);
    doc.roundedRect(x, startY, cardW, cardH, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(105, 117, 101);
    doc.text(kpi.title, x + 3, startY + 5);

    doc.setFontSize(9.5);
    doc.setTextColor(21, 59, 43);
    doc.text(kpi.value, x + 3, startY + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(105, 117, 101);
    doc.text(kpi.sub, x + 3, startY + 14.5);
  });

  // Table 1: Focus Products SKU Target Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(23, 32, 24);
  doc.text('Focus Product SKU Targets & Incentive Achievement', 14, 77);

  autoTable(doc, {
    startY: 80,
    head: [['SKU', 'Product Name', 'Brand', 'Target', 'Achieved', 'Rate', 'Sales (INR)', 'Points Earned']],
    body: performance.focusProducts.map(p => [
      p.sku,
      p.name,
      p.brand,
      `${p.monthlyTargetUnits} U`,
      `${p.achievedUnits} U`,
      `${p.achievementPercentage}%`,
      `₹${p.eligibleSales.toLocaleString()}`,
      `+${p.pointsEarned.toLocaleString()}`
    ]),
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, textColor: [23, 32, 24] },
    headStyles: { fillColor: [21, 59, 43], textColor: [200, 244, 61], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 246] },
    margin: { left: 14, right: 14 }
  });

  // Table 2: Weekly Wholesale Sales & Points Trend
  const currentY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(23, 32, 24);
  doc.text('Weekly Wholesale Purchase Volume & Loyalty Flow', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Date', 'Eligible Sales (INR)', 'Points Issued', 'Points Redeemed', 'Net Balance Impact']],
    body: SALES_TREND_DATA.map(d => [
      d.date,
      `₹${d.eligibleSales.toLocaleString()}`,
      `+${d.pointsIssued.toLocaleString()} Pts`,
      d.pointsRedeemed > 0 ? `-${d.pointsRedeemed.toLocaleString()} Pts` : '0 Pts',
      `+${(d.pointsIssued - d.pointsRedeemed).toLocaleString()} Pts`
    ]),
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, textColor: [23, 32, 24] },
    headStyles: { fillColor: [245, 247, 243], textColor: [21, 59, 43], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });

  // Table 3: Recent Invoices & Audit Status
  const invoiceTableY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(23, 32, 24);
  doc.text('Recent Wholesale Invoice Claim Decisions', 14, invoiceTableY);

  autoTable(doc, {
    startY: invoiceTableY + 3,
    head: [['Invoice #', 'Supplier / Distributor', 'Date', 'Gross Amount', 'Eligible', 'Status', 'Points']],
    body: invoices.slice(0, 4).map(inv => [
      inv.invoiceNumber,
      inv.supplierName,
      inv.invoiceDate,
      `₹${inv.totalAmount.toLocaleString()}`,
      `₹${inv.eligibleAmount.toLocaleString()}`,
      inv.status.toUpperCase(),
      `+${inv.calculatedPoints.toLocaleString()}`
    ]),
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, textColor: [23, 32, 24] },
    headStyles: { fillColor: [21, 59, 43], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: 14, right: 14 }
  });

  // Report Footer
  const footerY = 286;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This document is an automated electronic performance audit produced by RetailPulse Loyalty CRM. All point balances reconcile to verified distributor dispatches.', 14, footerY);
  doc.text('Page 1 of 1', 188, footerY);

  doc.save(`Weekly_Performance_Report_${store.code}_${dateFormatted}.pdf`);
};
