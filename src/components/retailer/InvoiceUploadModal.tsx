import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck,
  RefreshCw,
  Camera,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceLineItem } from '../../types';

export const InvoiceUploadModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    uploadInvoice, 
    invoices, 
    currentStore,
    setActiveNav
  } = useApp();

  const [step, setStep] = useState<'upload' | 'ocr_processing' | 'review'>('upload');
  const [fileName, setFileName] = useState('polycab_reliance_inv_8820.pdf');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-' + Math.floor(1000 + Math.random() * 9000));
  const [supplierName, setSupplierName] = useState('Reliance Trade Logistics Ltd');
  const [invoiceDate, setInvoiceDate] = useState('2026-10-25');
  const [totalAmount, setTotalAmount] = useState(98500);
  const [ocrConfidence, setOcrConfidence] = useState(96);
  const [isDuplicate, setIsDuplicate] = useState(false);
  
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'li-new-1',
      sku: 'POL-W-250-RD',
      productName: 'Polycab 2.5 sq mm Single Core Copper Wire (Red 90m)',
      brand: 'Polycab',
      category: 'Wires & Cables',
      quantity: 15,
      unitPrice: 2450,
      discount: 0,
      tax: 6615,
      total: 43365,
      isEligible: true,
      pointsCalculated: 1084
    },
    {
      id: 'li-new-2',
      sku: 'HAV-MCB-32A',
      productName: 'Havells Euroload 32A Double Pole MCB',
      brand: 'Havells',
      category: 'Switchgear',
      quantity: 30,
      unitPrice: 980,
      discount: 1470,
      tax: 5027,
      total: 32957,
      isEligible: true,
      pointsCalculated: 824
    },
    {
      id: 'li-new-3',
      sku: 'PHI-LED-20W',
      productName: 'Philips Stellar 20W LED T5 Batten Light',
      brand: 'Philips',
      category: 'Lighting',
      quantity: 30,
      unitPrice: 640,
      discount: 960,
      tax: 3283,
      total: 21523,
      isEligible: true,
      pointsCalculated: 538
    }
  ]);

  if (!isUploadModalOpen) return null;

  const handleSimulateOCR = () => {
    setStep('ocr_processing');
    setTimeout(() => {
      // Check duplicate
      const duplicateExists = invoices.some(i => i.invoiceNumber.toLowerCase() === invoiceNumber.toLowerCase());
      setIsDuplicate(duplicateExists);
      setStep('review');
    }, 700);
  };

  const handleQuickSample = (sampleType: 'clean' | 'duplicate' | 'needs_info') => {
    if (sampleType === 'duplicate') {
      const existing = invoices[0]?.invoiceNumber || 'INV-2026-9481';
      setInvoiceNumber(existing);
      setSupplierName('Reliance Trade Logistics Ltd');
      setFileName('reliance_oct_batch_duplicate.pdf');
    } else if (sampleType === 'needs_info') {
      setInvoiceNumber('INV-2026-7719');
      setOcrConfidence(64);
      setFileName('blurred_photo_scan.jpg');
    } else {
      setInvoiceNumber('INV-2026-' + Math.floor(1000 + Math.random() * 9000));
      setOcrConfidence(97);
      setFileName('polycab_reliance_inv_8820.pdf');
    }
    handleSimulateOCR();
  };

  const handleAddLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: `li-${Date.now()}`,
      sku: 'SKU-CUSTOM',
      productName: 'Custom Wholesale Hardware Item',
      brand: 'Polycab',
      category: 'Wires & Cables',
      quantity: 10,
      unitPrice: 1000,
      discount: 0,
      tax: 1800,
      total: 11800,
      isEligible: true,
      pointsCalculated: 295
    };
    setLineItems(prev => [...prev, newItem]);
    setTotalAmount(prev => prev + 11800);
  };

  const handleRemoveLineItem = (id: string) => {
    const item = lineItems.find(l => l.id === id);
    if (item) {
      setTotalAmount(prev => Math.max(0, prev - item.total));
    }
    setLineItems(prev => prev.filter(l => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eligibleTotal = lineItems.filter(l => l.isEligible).reduce((acc, l) => acc + l.total, 0);

    uploadInvoice({
      invoiceNumber,
      supplierName,
      invoiceDate,
      totalAmount,
      eligibleAmount: eligibleTotal,
      ocrConfidence,
      fileName,
      lineItems
    });

    setIsUploadModalOpen(false);
    setActiveNav('invoices');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#153B2B] text-[#C8F43D] flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172018]">Upload Distributor Invoice</h3>
              <p className="text-[11px] text-[#697565]">Instant AI OCR scanning & loyalty reward points verification</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1.5 text-[#697565] hover:text-[#172018] rounded-lg hover:bg-[#F5F7F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'upload' && (
          <div className="p-6 space-y-6">
            <div 
              onClick={handleSimulateOCR}
              className="border-2 border-dashed border-[#DDE4D8] hover:border-[#153B2B] rounded-2xl p-8 text-center bg-[#FAFBF9] hover:bg-[#F5F7F3] transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#172018]">
                Click to browse or drop invoice file here
              </h4>
              <p className="text-xs text-[#697565] mt-1 max-w-sm mx-auto">
                Supports PDF, JPG, PNG up to 15MB. Multi-page tax invoices, credit memos, and distributor dispatches.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#153B2B] bg-[#EAEFE6] px-2.5 py-1 rounded-md">
                  <Camera className="w-3.5 h-3.5" /> Camera Photo
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#153B2B] bg-[#EAEFE6] px-2.5 py-1 rounded-md">
                  <FileText className="w-3.5 h-3.5" /> Digital PDF
                </span>
              </div>
            </div>

            {/* Quick Presets for Demo Evaluation */}
            <div className="bg-[#F5F7F3] p-4 rounded-xl border border-[#E5EAE1]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#172018]">Sample Invoice Scenarios (Quick Test):</span>
                <span className="text-[10px] text-[#697565] uppercase tracking-wider">Automated OCR</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSample('clean')}
                  className="p-2.5 text-left bg-[#FFFFFF] hover:bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="text-xs font-bold text-[#153B2B]">Standard Invoice</div>
                  <div className="text-[10px] text-[#697565]">₹98,500 · 97% confidence</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSample('duplicate')}
                  className="p-2.5 text-left bg-[#FFFFFF] hover:bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="text-xs font-bold text-[#D97706]">Duplicate Invoice</div>
                  <div className="text-[10px] text-[#697565]">Tests collision check</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSample('needs_info')}
                  className="p-2.5 text-left bg-[#FFFFFF] hover:bg-[#FAFBF9] border border-[#E5EAE1] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="text-xs font-bold text-[#DC2626]">Low OCR Quality</div>
                  <div className="text-[10px] text-[#697565]">Requires re-upload</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'ocr_processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAEFE6] text-[#153B2B] flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#172018]">Analyzing Invoice & Extracting Line Items...</h4>
            <p className="text-xs text-[#697565] max-w-sm mx-auto">
              Scanning distributor GSTIN, invoice date, SKUs, discounts, arithmetic sums, and eligible brand catalog.
            </p>
          </div>
        )}

        {step === 'review' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Duplicate Flag Alert */}
            {isDuplicate && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3 text-xs text-[#991B1B]">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#DC2626]" />
                <div>
                  <span className="font-bold">Duplicate Warning:</span> Invoice number {invoiceNumber} matches an existing claim. Submitting will flag it for human operations review.
                </div>
              </div>
            )}

            {/* OCR Confidence Header */}
            <div className="flex items-center justify-between p-3 bg-[#FAFBF9] border border-[#E5EAE1] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#153B2B]" />
                <span className="font-semibold text-[#172018]">{fileName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4" />
                <span>OCR Confidence: {ocrConfidence}%</span>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    const duplicateExists = invoices.some(i => i.invoiceNumber.toLowerCase() === e.target.value.toLowerCase());
                    setIsDuplicate(duplicateExists);
                  }}
                  className="w-full text-xs font-tabular bg-[#FFFFFF] border border-[#DDE4D8] rounded-lg px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Supplier / Distributor
                </label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-lg px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                >
                  <option value="Reliance Trade Logistics Ltd">Reliance Trade Logistics Ltd</option>
                  <option value="Havells India Regional Depot">Havells India Regional Depot</option>
                  <option value="Western Cable & Conduits Co">Western Cable & Conduits Co</option>
                  <option value="Philips Lighting Distribution">Philips Lighting Distribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  required
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full text-xs bg-[#FFFFFF] border border-[#DDE4D8] rounded-lg px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Total Gross Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="w-full text-xs font-tabular bg-[#FFFFFF] border border-[#DDE4D8] rounded-lg px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                />
              </div>
            </div>

            {/* Extracted Line Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#172018]">
                  Extracted Line Items ({lineItems.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddLineItem}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#153B2B] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto border border-[#E5EAE1] rounded-xl divide-y divide-[#E5EAE1] bg-[#FAFBF9]">
                {lineItems.map((item) => (
                  <div key={item.id} className="p-3 text-xs flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#697565]">{item.sku}</span>
                        <span className="font-semibold text-[#172018] truncate">{item.productName}</span>
                      </div>
                      <div className="text-[11px] text-[#697565] mt-0.5 font-tabular">
                        Qty: {item.quantity} · Unit: ₹{item.unitPrice} · Points: +{item.pointsCalculated}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-[#172018] font-tabular">
                        ₹{item.total.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="text-[#94A3B8] hover:text-[#DC2626] p-1 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Reward Preview */}
            <div className="p-3.5 bg-[#EAEFE6] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#153B2B]">Estimated Loyalty Reward:</span>
                <p className="text-[11px] text-[#3E4A3D]">2.5% standard wholesale earn rate</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#153B2B] font-tabular">
                  +{Math.round(totalAmount * 0.025).toLocaleString()} Points
                </span>
                <div className="text-[10px] text-[#3E4A3D] font-tabular">
                  ≈ ₹{(totalAmount * 0.025 * currentStore.cashEquivalentRate).toFixed(2)} Cash Equivalent
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 text-xs font-medium text-[#697565] hover:text-[#172018] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                Submit Invoice Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
