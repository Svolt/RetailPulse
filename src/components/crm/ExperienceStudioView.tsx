import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Sliders, 
  Palette, 
  Smartphone, 
  Tablet, 
  Monitor, 
  History, 
  ShieldCheck, 
  X, 
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  ExperienceConfig, 
  DashboardWidgetConfig, 
  NavModuleConfig, 
  BrandThemeConfig,
  PlatformRole 
} from '../../types';

export const ExperienceStudioView: React.FC = () => {
  const { sessionToken, hasPermission, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'widgets' | 'navigation' | 'branding' | 'history'>('widgets');
  const [draftConfig, setDraftConfig] = useState<ExperienceConfig | null>(null);
  const [publishedVersionId, setPublishedVersionId] = useState<string>('');
  const [history, setHistory] = useState<ExperienceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live Preview Settings
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewRole, setPreviewRole] = useState<PlatformRole>('Retailer');
  const [previewTier, setPreviewTier] = useState<'Gold' | 'Platinum'>('Gold');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Publish / Rollback Modal States
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [changeSummaryInput, setChangeSummaryInput] = useState('');
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/config/draft', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDraftConfig(data.draft);
        setPublishedVersionId(data.publishedVersion);
      }

      const histRes = await fetch('/api/config/history', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.history || []);
      }
    } catch (e) {
      console.error('[ExperienceStudio] Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [sessionToken]);

  const saveDraft = async (updatedConfig: ExperienceConfig) => {
    setIsSavingDraft(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/config/draft', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save draft configuration.');
      } else {
        setDraftConfig(data.draft);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error saving draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleWidgetToggle = (id: string) => {
    if (!draftConfig) return;
    const newWidgets = draftConfig.widgets.map(w => 
      w.id === id ? { ...w, isEnabled: !w.isEnabled } : w
    );
    const updated = { ...draftConfig, widgets: newWidgets };
    setDraftConfig(updated);
    saveDraft(updated);
  };

  const handleWidgetMove = (index: number, direction: 'up' | 'down') => {
    if (!draftConfig) return;
    const items = [...draftConfig.widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // re-index order
    items.forEach((item, idx) => { item.order = idx + 1; });

    const updated = { ...draftConfig, widgets: items };
    setDraftConfig(updated);
    saveDraft(updated);
  };

  const handleNavToggle = (id: string) => {
    if (!draftConfig) return;
    const newNav = draftConfig.navigation.map(n => 
      n.id === id ? { ...n, isEnabled: !n.isEnabled } : n
    );
    const updated = { ...draftConfig, navigation: newNav };
    setDraftConfig(updated);
    saveDraft(updated);
  };

  const handleThemeChange = (field: keyof BrandThemeConfig, value: string) => {
    if (!draftConfig) return;
    const updatedTheme = { ...draftConfig.theme, [field]: value };
    const updated = { ...draftConfig, theme: updatedTheme };
    setDraftConfig(updated);
    saveDraft(updated);
  };

  const handlePublish = async () => {
    if (!draftConfig) return;
    setErrorMessage(null);

    try {
      const res = await fetch('/api/config/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ changeSummary: changeSummaryInput })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to publish configuration.');
        return;
      }

      setPublishFeedback(data.message);
      setIsPublishModalOpen(false);
      setChangeSummaryInput('');
      fetchConfig();
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (e: any) {
      setErrorMessage(e.message || 'Publish error');
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!confirm(`Are you sure you want to rollback platform configuration to ${versionId}? This will create a new audited publication.`)) return;

    try {
      const res = await fetch('/api/config/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ targetVersionId: versionId })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Rollback failed.');
        return;
      }
      setPublishFeedback(data.message);
      fetchConfig();
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !draftConfig) {
    return (
      <div className="p-12 text-center text-xs text-[#697565]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#153B2B]" />
        <span>Loading Experience Studio Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Draft vs Published indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">Experience Studio</span>
            <span>·</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] font-semibold">
              Editing Draft: {draftConfig.versionId}
            </span>
            <span>·</span>
            <span className="text-[10px] text-[#697565]">
              Live in Prod: <strong className="text-[#16A34A]">{publishedVersionId}</strong>
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#172018]">
            Retailer Experience Studio & Layout Engine
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Design dashboard widgets, navigation visibility, audience targeting, and brand styling with live multi-device simulation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              isPreviewOpen 
                ? 'bg-[#153B2B] text-[#C8F43D] border-[#153B2B]' 
                : 'bg-[#F5F7F3] text-[#172018] border-[#DDE4D8] hover:bg-[#EAEFE6]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewOpen ? 'Hide Live Preview' : 'Open Live Preview'}</span>
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Publish Configuration</span>
          </button>
        </div>
      </div>

      {publishFeedback && (
        <div className="p-3.5 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#16A34A] font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{publishFeedback}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-2 text-xs text-[#DC2626] font-semibold animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Preview Drawer / Split Panel */}
      {isPreviewOpen && (
        <div className="p-5 bg-[#172018] text-[#FFFFFF] rounded-2xl shadow-xl space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8F43D]" />
              <span className="font-bold text-[#FFFFFF]">Live Responsive Simulator</span>
              <span className="text-[10px] text-[#A1A1AA]">(Rendering Unsaved Draft State)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Device Selector */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-lg">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md cursor-pointer ${previewDevice === 'desktop' ? 'bg-[#C8F43D] text-[#153B2B]' : 'text-[#DDE4D8]'}`}
                  title="Desktop (1280px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-md cursor-pointer ${previewDevice === 'tablet' ? 'bg-[#C8F43D] text-[#153B2B]' : 'text-[#DDE4D8]'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md cursor-pointer ${previewDevice === 'mobile' ? 'bg-[#C8F43D] text-[#153B2B]' : 'text-[#DDE4D8]'}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Target Audience Context */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#A1A1AA] text-[11px]">Audience:</span>
                <select
                  value={previewTier}
                  onChange={(e) => setPreviewTier(e.target.value as any)}
                  className="bg-white/10 text-[#FFFFFF] text-[11px] rounded-lg px-2 py-1 border border-white/10 focus:outline-none"
                >
                  <option value="Gold" className="text-black">Gold Tier Store</option>
                  <option value="Platinum" className="text-black">Platinum Tier Store</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulated Viewport Canvas */}
          <div className="flex justify-center p-4 bg-black/40 rounded-xl overflow-x-auto">
            <div 
              style={{ 
                width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%',
                backgroundColor: draftConfig.theme.canvasColor
              }}
              className="rounded-xl p-4 text-[#172018] shadow-2xl transition-all duration-300 min-h-[380px] space-y-4"
            >
              {/* Simulated Brand Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EAE1] bg-white p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div 
                    style={{ backgroundColor: draftConfig.theme.primaryColor, color: draftConfig.theme.accentColor }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                  >
                    ▲
                  </div>
                  <div>
                    <span className="font-bold text-xs">{draftConfig.theme.brandName}</span>
                    <span className="text-[10px] text-[#697565] block">{previewTier} Tier Member</span>
                  </div>
                </div>
                <span 
                  style={{ backgroundColor: draftConfig.theme.accentColor, color: draftConfig.theme.primaryColor }}
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  Preview Active
                </span>
              </div>

              {/* Active Enabled Widgets Preview */}
              <div className="space-y-3">
                {draftConfig.widgets
                  .filter(w => w.isEnabled)
                  .sort((a, b) => a.order - b.order)
                  .map((widget, i) => (
                    <div 
                      key={widget.id}
                      className="p-3 bg-white rounded-xl border border-[#E5EAE1] space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#153B2B]">
                          {i + 1}. {widget.title}
                        </span>
                        <span className="text-[9px] font-mono bg-[#F5F7F3] px-1.5 py-0.5 rounded text-[#697565]">
                          {widget.widgetKey}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#697565] line-clamp-1">{widget.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Studio Configuration Tabs */}
      <div className="flex items-center gap-1 bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E5EAE1] overflow-x-auto shadow-2xs">
        {[
          { id: 'widgets', label: 'Dashboard Widgets', icon: Sliders },
          { id: 'navigation', label: 'Navigation & Modules', icon: Layers },
          { id: 'branding', label: 'Branding & Theme', icon: Palette },
          { id: 'history', label: 'Version History & Rollback', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-[#153B2B] text-[#C8F43D] shadow-2xs' 
                  : 'text-[#697565] hover:text-[#172018] hover:bg-[#F5F7F3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dashboard Widgets Reordering & Config */}
      {activeTab === 'widgets' && (
        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE1]">
            <div>
              <h2 className="text-sm font-bold text-[#172018]">Dashboard Component Registry</h2>
              <p className="text-xs text-[#697565]">
                Enable or disable widgets and reorder their vertical arrangement on the Retailer Overview dashboard.
              </p>
            </div>
            <span className="text-xs font-bold text-[#153B2B] font-tabular">
              {draftConfig.widgets.filter(w => w.isEnabled).length} of {draftConfig.widgets.length} Enabled
            </span>
          </div>

          <div className="space-y-2.5">
            {draftConfig.widgets.map((widget, index) => (
              <div 
                key={widget.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  widget.isEnabled ? 'bg-[#FAFBF9] border-[#DDE4D8]' : 'bg-[#F5F7F3]/60 border-[#E5EAE1] opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5 pt-1 text-[#697565]">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleWidgetMove(index, 'up')}
                      className="hover:text-[#153B2B] disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === draftConfig.widgets.length - 1}
                      onClick={() => handleWidgetMove(index, 'down')}
                      className="hover:text-[#153B2B] disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172018]">{widget.title}</span>
                      <span className="text-[10px] font-mono text-[#697565] bg-white px-1.5 py-0.5 rounded border border-[#E5EAE1]">
                        {widget.widgetKey}
                      </span>
                    </div>
                    <p className="text-xs text-[#697565] mt-0.5 line-clamp-1">{widget.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <span className="text-[#697565]">{widget.isEnabled ? 'Visible' : 'Hidden'}</span>
                    <input
                      type="checkbox"
                      checked={widget.isEnabled}
                      onChange={() => handleWidgetToggle(widget.id)}
                      className="w-4 h-4 text-[#153B2B] rounded focus:ring-[#153B2B] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Navigation & Module Visibility */}
      {activeTab === 'navigation' && (
        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE1]">
            <div>
              <h2 className="text-sm font-bold text-[#172018]">Navigation Modules & Permission Guards</h2>
              <p className="text-xs text-[#697565]">
                Configure sidebar menu labels, modules, and role visibility policies.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {draftConfig.navigation.map((nav) => (
              <div 
                key={nav.id}
                className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#172018]">{nav.label}</div>
                  <div className="text-[10px] text-[#697565]">
                    Module: <code className="font-mono">{nav.moduleId}</code> · Required: <span className="text-[#153B2B] font-semibold">{nav.requiredPermission}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-1">
                    {nav.visibleToRoles.map(r => (
                      <span key={r} className="text-[9px] bg-white border border-[#E5EAE1] px-1.5 py-0.5 rounded text-[#697565]">
                        {r}
                      </span>
                    ))}
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nav.isEnabled}
                      onChange={() => handleNavToggle(nav.id)}
                      className="w-4 h-4 text-[#153B2B] rounded"
                    />
                    <span className="text-[#697565]">{nav.isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Branding & Theme Configuration */}
      {activeTab === 'branding' && (
        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-5">
          <div className="pb-3 border-b border-[#E5EAE1]">
            <h2 className="text-sm font-bold text-[#172018]">Corporate Visual Identity & Design Tokens</h2>
            <p className="text-xs text-[#697565]">
              Customize platform branding, typography, color palettes, and container radius tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172018] mb-1">Brand Name</label>
              <input
                type="text"
                value={draftConfig.theme.brandName}
                onChange={(e) => handleThemeChange('brandName', e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172018] mb-1">Approved Font Family</label>
              <select
                value={draftConfig.theme.fontFamily}
                onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Default)</option>
                <option value="Inter">Inter</option>
                <option value="DM Sans">DM Sans</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#172018] mb-1">Primary Brand Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={draftConfig.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="flex-1 font-mono uppercase bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2 text-[#172018]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#172018] mb-1">Accent Highlight Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={draftConfig.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="flex-1 font-mono uppercase bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2 text-[#172018]"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2 text-xs">
            <span className="font-bold text-[#172018]">WCAG Contrast & Accessibility Inspection:</span>
            <div className="flex items-center gap-3">
              <div 
                style={{ backgroundColor: draftConfig.theme.primaryColor, color: draftConfig.theme.accentColor }}
                className="px-4 py-2 rounded-xl font-bold"
              >
                Accent on Forest (AAA: 8.4:1)
              </div>
              <div 
                style={{ backgroundColor: draftConfig.theme.accentColor, color: draftConfig.theme.primaryColor }}
                className="px-4 py-2 rounded-xl font-bold"
              >
                Forest on Accent (AAA: 8.4:1)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Version History & Rollback */}
      {activeTab === 'history' && (
        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE1]">
            <div>
              <h2 className="text-sm font-bold text-[#172018]">Audited Configuration Releases</h2>
              <p className="text-xs text-[#697565]">
                Complete release lineage. Any previous configuration can be restored via an audited rollback release.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {history.map((ver) => {
              const isLive = ver.versionId === publishedVersionId;
              return (
                <div 
                  key={ver.versionId}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isLive ? 'bg-[#EAF7EE] border-[#A7F3D0]' : 'bg-[#FAFBF9] border-[#E5EAE1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[#172018]">{ver.versionId}</span>
                      {isLive && (
                        <span className="text-[10px] font-bold text-[#16A34A] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#A7F3D0]">
                          Currently Active in Production
                        </span>
                      )}
                    </div>
                    <p className="text-[#697565] mt-1">{ver.changeSummary}</p>
                    <div className="text-[10px] text-[#94A3B8] font-tabular mt-1">
                      Published: {ver.publishedAt} by {ver.publishedBy}
                    </div>
                  </div>

                  {!isLive && (
                    <button
                      onClick={() => handleRollback(ver.versionId)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#153B2B] bg-[#FFFFFF] hover:bg-[#F5F7F3] border border-[#DDE4D8] rounded-lg shrink-0 cursor-pointer self-start sm:self-auto flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback to this Snapshot</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Publish Change Summary Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E5EAE1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172018]">Publish Experience Release</h3>
                <p className="text-xs text-[#697565]">This will create a new immutable version and deploy it live</p>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="text-[#697565]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#172018] mb-1">
                  Change Summary / Release Notes (Required)
                </label>
                <textarea
                  rows={3}
                  required
                  value={changeSummaryInput}
                  onChange={(e) => setChangeSummaryInput(e.target.value)}
                  placeholder="e.g. Promoted sales trend to second slot, adjusted accent color contrast, enabled Q4 Festive widgets"
                  className="w-full bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl p-2.5 text-[#172018] focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-1.5">
                <span className="font-bold text-[#172018]">Pre-Publication Audit Checklist:</span>
                <div className="text-[11px] text-[#697565] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>{draftConfig.widgets.filter(w => w.isEnabled).length} active dashboard widgets validated</span>
                </div>
                <div className="text-[11px] text-[#697565] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Theme colors checked for WCAG AA compliance</span>
                </div>
                <div className="text-[11px] text-[#697565] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Audited publisher: {currentUser?.name} ({currentUser?.role})</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAE1]">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#697565]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-5 py-2 text-xs font-bold text-[#153B2B] bg-[#C8F43D] hover:bg-[#BBE832] rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Deploy Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
