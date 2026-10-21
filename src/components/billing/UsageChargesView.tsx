import React from 'react';
import { DollarSign, BarChart2 } from 'lucide-react';
import { SmsMessage, PartnerProfile } from '../../types';

interface UsageChargesViewProps {
  partner: PartnerProfile;
  messages: SmsMessage[];
}

export const UsageChargesView: React.FC<UsageChargesViewProps> = ({ partner, messages }) => {
  const totalCost = messages.reduce((acc, m) => acc + m.costETB, 0);
  const totalSegments = messages.reduce((acc, m) => acc + m.segments, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          SMS Usage & Consumption Charges
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed consumption analytics broken down by Sender ID, channel, and message segment volume.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Charged</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">ETB {totalCost.toFixed(2)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on {messages.length} messages</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Billable Segments</span>
          <p className="text-2xl font-bold text-blue-600 font-mono mt-1">{totalSegments}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">GSM-7 (160) & Unicode (70)</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Effective Segment Price</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            ETB {partner.ratePerSmsETB.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Ethio telecom wholesale tier</span>
        </div>
      </div>
    </div>
  );
};
