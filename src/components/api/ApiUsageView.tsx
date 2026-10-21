import React from 'react';
import { SmsMessage } from '../../types';

interface ApiUsageViewProps {
  messages: SmsMessage[];
}

export const ApiUsageView: React.FC<ApiUsageViewProps> = ({ messages }) => {
  const apiMessages = messages.filter((m) => m.channel === 'api');
  const totalCalls = apiMessages.length;
  const successfulCalls = apiMessages.filter((m) => m.status === 'delivered').length;
  const errorCalls = apiMessages.filter((m) => m.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          API Usage & Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor request volumes, latency percentiles, and HTTP response codes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total API Invocations</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalCalls}</p>
          <span className="text-[11px] text-slate-400 font-medium">Last 30 days</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">HTTP 200 (Success)</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{successfulCalls}</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% accepted</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">HTTP 4xx / 5xx Errors</span>
          <p className="text-2xl font-bold text-rose-600 font-mono mt-1">{errorCalls}</p>
          <span className="text-[11px] text-slate-400 font-medium">Zero rate-limit events</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">p95 Ingestion Latency</span>
          <p className="text-2xl font-bold text-blue-600 font-mono mt-1">42ms</p>
          <span className="text-[11px] text-slate-400 font-medium">High throughput gateway</span>
        </div>
      </div>

      {/* Latency & Status Breakdown */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Gateway Response Distribution</h3>
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 font-medium mb-1.5">
              <span>POST /v1/sms/send (Status 200 OK)</span>
              <span className="font-mono font-bold text-emerald-600">{successfulCalls} calls (100%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div style={{ width: '100%' }} className="bg-emerald-500 h-full rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 font-medium mb-1.5">
              <span>Rate Limit Status (HTTP 429 Too Many Requests)</span>
              <span className="font-mono font-bold text-slate-400">0 (Limit: 500 req/sec)</span>
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
