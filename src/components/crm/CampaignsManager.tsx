import React, { useState } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CampaignsManager: React.FC = () => {
  const { campaigns } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172018]">
            Loyalty Campaigns & Promotional Multipliers
          </h1>
          <p className="text-xs text-[#697565] mt-0.5">
            Manage seasonal surge promotions, volume bonuses, budget burn caps, and target retailer segmentations.
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(camp => {
          const burnPercent = Math.min(100, Math.round((camp.budgetBurned / camp.budgetAllocated) * 100));

          return (
            <div 
              key={camp.id}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5EAE1] shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#153B2B] bg-[#EAEFE6] px-2.5 py-0.5 rounded-md">
                    {camp.multiplier}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    camp.status === 'active' ? 'bg-[#EAF7EE] text-[#16A34A]' : 'bg-[#F5F7F3] text-[#697565]'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#172018]">{camp.name}</h3>
                <p className="text-xs text-[#697565] leading-relaxed line-clamp-2">{camp.description}</p>
                
                <div className="text-[11px] text-[#697565] space-y-1">
                  <div>Audience: <span className="font-semibold text-[#172018]">{camp.targetSegment}</span></div>
                  <div>Period: <span className="font-medium text-[#172018] font-tabular">{camp.startDate} to {camp.endDate}</span></div>
                </div>
              </div>

              {/* Budget Burn Progress Bar */}
              <div className="pt-3 border-t border-[#F5F7F3] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#697565]">
                  <span>Budget Burn:</span>
                  <span className="font-bold text-[#172018] font-tabular">
                    ₹{(camp.budgetBurned / 100000).toFixed(1)}L / ₹{(camp.budgetAllocated / 100000).toFixed(1)}L ({burnPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#E5EAE1] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#153B2B] h-2 rounded-full" 
                    style={{ width: `${burnPercent}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
