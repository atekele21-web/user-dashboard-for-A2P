import React from 'react';
import { SmsMessage } from '../../types';

interface DeliveryReportsViewProps {
  messages: SmsMessage[];
}

export const DeliveryReportsView: React.FC<DeliveryReportsViewProps> = ({ messages }) => {
  const total = messages.length;
  const delivered = messages.filter((m) => m.status === 'delivered').length;
  const failed = messages.filter((m) => m.status === 'failed').length;
  const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Delivery Reports (DLR) Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Carrier delivery receipts received from Ethio telecom upstream network nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Delivery Success Rate</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{rate}%</p>
          <span className="text-[11px] text-slate-400 font-medium">Ethio telecom mobile network</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Average DLR Latency</span>
          <p className="text-2xl font-bold text-blue-600 font-mono mt-1">2.4s</p>
          <span className="text-[11px] text-slate-400 font-medium">Dispatch to handset ack</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Delivered Total</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{delivered}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Handset received</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Unreachable / Failed</span>
          <p className="text-2xl font-bold text-rose-600 font-mono mt-1">{failed}</p>
          <span className="text-[11px] text-rose-600 font-medium">Subscriber absent</span>
        </div>
      </div>

      {/* DLR Failure Reason Breakdown */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Carrier Response & Failure Codes</h3>
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 font-medium mb-1.5">
              <span>DELIVRD - Successfully confirmed on device</span>
              <span className="font-mono font-bold text-emerald-600">{delivered} ({rate}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div style={{ width: `${rate}%` }} className="bg-emerald-500 h-full rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-medium mb-1.5">
              <span>ABSENT_SUBSCRIBER (404) - Phone switched off or out of coverage</span>
              <span className="font-mono font-bold text-amber-600">{failed > 0 ? 1 : 0}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div style={{ width: failed > 0 ? '5%' : '0%' }} className="bg-amber-500 h-full rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-medium mb-1.5">
              <span>INVALID_DESTINATION (400) - Number unallocated in national plan</span>
              <span className="font-mono font-bold text-slate-400">0</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div style={{ width: '0%' }} className="bg-rose-500 h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
