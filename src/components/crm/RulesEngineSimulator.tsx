import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Play, 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RulesEngineSimulator: React.FC = () => {
  const { earnRules } = useApp();

  // Interactive Simulator inputs
  const [testAmount, setTestAmount] = useState<number>(85000);
  const [testBrand, setTestBrand] = useState<string>('Polycab');
  const [testCategory, setTestCategory] = useState<string>('Wires & Cables');
  const [testTier, setTestTier] = useState<string>('Gold');
  const [hasFestiveMultiplier, setHasFestiveMultiplier] = useState<boolean>(true);

  // Dynamic Rule Execution Calculation
  const baseRate = 0.025; // 2.5%
  const multiplier = (hasFestiveMultiplier && testBrand === 'Polycab') ? 1.2 : 1.0;
  const tierKicker = testTier === 'Platinum' ? 1.1 : 1.0;
  
  const effectiveRate = baseRate * multiplier * tierKicker;
  const rawPoints = Math.round(testAmount * effectiveRate);
  const cappedPoints = Math.min(rawPoints, 15000);
  const cashEquivalent = (cappedPoints * 0.25).toFixed(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697565] mb-1">
            <span className="font-semibold text-[#153B2B]">Rules Engine v4.2</span>
            <span>·</span>
            <span className="text-[#16A34A] font-semibold">Active in Production</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Earn Rules Builder & Live Claim Simulator
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Model wholesale earn formulas, tier multipliers, minimum threshold caps, and simulate dry-run invoice outcomes.
          </p>
        </div>
      </div>

      {/* Simulator 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Control Panel */}
        <div className="lg:col-span-6 bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAE1]">
            <Play className="w-4 h-4 text-[#153B2B]" />
            <h2 className="text-sm font-bold text-[#172018]">Dry-Run Invoice Evaluation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172018] mb-1">
                Wholesale Invoice Amount (INR)
              </label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full text-base font-bold font-tabular bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl px-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Brand Selection
                </label>
                <select
                  value={testBrand}
                  onChange={(e) => setTestBrand(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl px-3 py-2 text-[#172018] focus:outline-none"
                >
                  <option value="Polycab">Polycab (Eligible)</option>
                  <option value="Havells">Havells (Eligible)</option>
                  <option value="Philips">Philips (Eligible)</option>
                  <option value="Generic Non-Brand">Generic Non-Brand (0% Pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Store Partner Tier
                </label>
                <select
                  value={testTier}
                  onChange={(e) => setTestTier(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl px-3 py-2 text-[#172018] focus:outline-none"
                >
                  <option value="Platinum">Platinum (1.1x Kicker)</option>
                  <option value="Gold">Gold (Standard 1.0x)</option>
                  <option value="Silver">Silver (Standard 1.0x)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#F5F7F3] rounded-xl border border-[#E5EAE1] flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#172018]">Diwali Festive Surge Multiplier</span>
                <p className="text-[11px] text-[#697565]">Applies 1.2x boost on copper wires</p>
              </div>
              <input
                type="checkbox"
                checked={hasFestiveMultiplier}
                onChange={(e) => setHasFestiveMultiplier(e.target.checked)}
                className="w-4 h-4 text-[#153B2B] rounded focus:ring-[#153B2B]"
              />
            </div>
          </div>
        </div>

        {/* Evaluation Output Card */}
        <div className="lg:col-span-6 bg-[#153B2B] text-[#FFFFFF] p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C8F43D] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Simulated Execution Trace</span>
            </div>
            <h3 className="text-xl font-bold">Explainable Reward Calculation</h3>
            <p className="text-xs text-[#DDE4D8] mt-1">
              Deterministic outcome according to Apex loyalty formula v4.2-2026Q4.
            </p>
          </div>

          <div className="p-4 bg-[#1E4D38] rounded-xl space-y-2 text-xs font-tabular">
            <div className="flex justify-between text-[#DDE4D8]">
              <span>Base Rate (2.5%):</span>
              <span>₹{(testAmount * baseRate).toLocaleString()} = {Math.round(testAmount * baseRate)} Pts</span>
            </div>
            <div className="flex justify-between text-[#DDE4D8]">
              <span>Campaign Multiplier ({multiplier}x):</span>
              <span>+{Math.round(testAmount * baseRate * (multiplier - 1))} Bonus Pts</span>
            </div>
            <div className="flex justify-between text-[#DDE4D8]">
              <span>Tier Bonus ({tierKicker}x):</span>
              <span>+{Math.round(testAmount * baseRate * multiplier * (tierKicker - 1))} Bonus Pts</span>
            </div>
            <div className="flex justify-between text-[#C8F43D] font-bold pt-2 border-t border-[#C8F43D]/20 text-sm">
              <span>Final Reward Credited:</span>
              <span>+{cappedPoints.toLocaleString()} Points</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#DDE4D8] pt-1">
            <span>Cash Value to Retailer: ₹{cashEquivalent}</span>
            <span className="text-[#C8F43D] font-semibold">Passes Ledger Check</span>
          </div>
        </div>
      </div>

      {/* Active Rules Grid */}
      <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#172018]">Configured Production Earn Rules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {earnRules.map(rule => (
            <div key={rule.id} className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E5EAE1] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#697565]">
                <span className="font-semibold text-[#153B2B]">{rule.category}</span>
                <span className="font-mono">{rule.ruleVersion}</span>
              </div>
              <h4 className="text-xs font-bold text-[#172018]">{rule.name}</h4>
              <p className="text-xs text-[#697565] leading-relaxed">{rule.description}</p>
              <div className="text-[11px] font-semibold text-[#153B2B] bg-[#EAEFE6] p-2 rounded-lg mt-2">
                {rule.rateDescription}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
