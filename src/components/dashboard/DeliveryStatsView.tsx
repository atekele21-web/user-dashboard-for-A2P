import React from 'react';
import { CheckCircle2, Clock, XCircle, Activity } from 'lucide-react';
import { SmsMessage } from '../../types';

interface DeliveryStatsViewProps {
  messages: SmsMessage[];
}

export const DeliveryStatsView: React.FC<DeliveryStatsViewProps> = ({ messages }) => {
  const delivered = messages.filter((m) => m.status === 'delivered').length;
  const failed = messages.filter((m) => m.status === 'failed').length;
  const total = messages.length;
  const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Delivery Performance & Latency
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Handset acknowledgment rates and delivery receipts from Ethio telecom mobile networks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Delivered Success Rate</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{rate}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Upstream SMSC acknowledgment</span>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Deliveries Confirmed</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{delivered}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active recipient handsets</span>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Network Discard / Unreachable</span>
          <p className="text-2xl font-bold text-rose-600 font-mono mt-1">{failed}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Carrier rejection or expiration</span>
        </div>
      </div>
    </div>
  );
};
