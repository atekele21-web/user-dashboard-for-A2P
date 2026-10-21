import React from 'react';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import { SmsMessage, PartnerProfile } from '../../types';

interface SmsUsageViewProps {
  messages: SmsMessage[];
  partner: PartnerProfile;
}

export const SmsUsageView: React.FC<SmsUsageViewProps> = ({ messages, partner }) => {
  const apiCount = messages.filter((m) => m.channel === 'api').length;
  const dashCount = messages.filter((m) => m.channel === 'dashboard').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          SMS Usage Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Channel breakdown, segment consumption, and traffic distribution over time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total SMS Dispatched</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{messages.length}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">API Gateway Volume</span>
          <p className="text-2xl font-bold text-blue-600 font-mono mt-1">{apiCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Web Portal Volume</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{dashCount}</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900">Channel Ingestion Share</h3>
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-600 mb-1.5 font-medium">
              <span>Web Dashboard Submissions</span>
              <span className="font-mono font-semibold text-blue-700">
                {dashCount} ({messages.length > 0 ? Math.round((dashCount / messages.length) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                style={{ width: `${messages.length > 0 ? (dashCount / messages.length) * 100 : 0}%` }}
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1.5 font-medium">
              <span>Programmatic REST API</span>
              <span className="font-mono font-semibold text-emerald-700">
                {apiCount} ({messages.length > 0 ? Math.round((apiCount / messages.length) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                style={{ width: `${messages.length > 0 ? (apiCount / messages.length) * 100 : 0}%` }}
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
