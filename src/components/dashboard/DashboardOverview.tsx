import React, { useState } from 'react';
import {
  Wallet,
  MessageSquare,
  TrendingUp,
  LayoutGrid,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { NavigationSection, PartnerProfile, SmsMessage, AuthorizedSenderId, SenderIdRequest } from '../../types';

interface DashboardOverviewProps {
  partner: PartnerProfile;
  messages: SmsMessage[];
  authorizedSenderIds: AuthorizedSenderId[];
  senderIdRequests: SenderIdRequest[];
  contactsCount: number;
  onNavigate: (section: NavigationSection) => void;
  onOpenQuickSms: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  partner,
  messages,
  authorizedSenderIds,
  senderIdRequests,
  contactsCount,
  onNavigate,
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('7days');
  const [useStrictScreenshotValues] = useState<boolean>(false);

  // Computed metrics
  const totalSms = messages.length;
  const apiSent = messages.filter((m) => m.channel === 'api').length;
  const dashboardSent = messages.filter((m) => m.channel === 'dashboard').length;
  const deliveredCount = messages.filter((m) => m.status === 'delivered').length;
  const failedCount = messages.filter((m) => m.status === 'failed').length;
  const pendingRequests = senderIdRequests.filter(
    (r) => r.status === 'submitted' || r.status === 'under_review' || r.status === 'pending_external_approval'
  ).length;

  // Chart data for daily volume over 7 days
  const volumeData = [
    { date: '07-02', api: 0, dashboard: 0 },
    { date: '07-03', api: 0, dashboard: 0 },
    { date: '07-04', api: 0, dashboard: 0 },
    { date: '07-05', api: 0, dashboard: 0 },
    { date: '07-06', api: 0, dashboard: 0 },
    { date: '07-07', api: 0, dashboard: 1 },
    { date: '07-08', api: 0, dashboard: dashboardSent > 1 ? dashboardSent : 1 },
  ];

  // Weekly API calls distribution (Thu - Wed)
  const apiDays = [
    { day: 'Thu', calls: 0 },
    { day: 'Fri', calls: 0 },
    { day: 'Sat', calls: 0 },
    { day: 'Sun', calls: 0 },
    { day: 'Mon', calls: 0 },
    { day: 'Tue', calls: apiSent > 0 ? 1 : 0 },
    { day: 'Wed', calls: apiSent > 1 ? apiSent : 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Dashboards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back! Here's what's happening with your SMS campaigns.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                timeFilter === 'today'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                timeFilter === '7days'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                timeFilter === '30days'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Primary Summary Metrics Row - Crisp White Cards with Blue/Green Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Balance */}
        <div
          onClick={() => onNavigate('billing-overview')}
          className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Balance</span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {useStrictScreenshotValues ? 'ETB 0' : `ETB ${partner.balanceETB.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-600">
              <span>+0%</span>
              <span className="text-slate-400 font-normal text-[10px]">· Prepaid balance</span>
            </div>
          </div>
        </div>

        {/* Card 2: Number of SMS */}
        <div
          onClick={() => onNavigate('sms-log')}
          className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Number of SMS</span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {useStrictScreenshotValues ? '1' : totalSms}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-600">
              <span>+0%</span>
              <span className="text-slate-400 font-normal text-[10px]">· Total volume</span>
            </div>
          </div>
        </div>

        {/* Card 3: API Sent SMS */}
        <div
          onClick={() => onNavigate('api-usage')}
          className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">API Sent SMS</span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {useStrictScreenshotValues ? '0' : apiSent}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-600">
              <span>+0%</span>
              <span className="text-slate-400 font-normal text-[10px]">· Via REST API</span>
            </div>
          </div>
        </div>

        {/* Card 4: Dashboard Sent SMS */}
        <div
          onClick={() => onNavigate('sms-log')}
          className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dashboard Sent SMS</span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {useStrictScreenshotValues ? '1' : dashboardSent}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-600">
              <span>+0%</span>
              <span className="text-slate-400 font-normal text-[10px]">· Direct portal</span>
            </div>
          </div>
        </div>

        {/* Card 5: Active Contacts */}
        <div
          onClick={() => onNavigate('contacts-list')}
          className="cursor-pointer group p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Contacts</span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {useStrictScreenshotValues ? '0' : contactsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-600">
              <span>+0%</span>
              <span className="text-slate-400 font-normal text-[10px]">· Address book</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Delivered Success Rate</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 font-mono">
            {totalSms > 0 ? `${((deliveredCount / totalSms) * 100).toFixed(1)}%` : '100%'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Failed Dispatches</span>
          </div>
          <span className="text-xs font-bold text-slate-900 font-mono">{failedCount}</span>
        </div>

        <div
          onClick={() => onNavigate('sms-sender-ids')}
          className="cursor-pointer flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Sender IDs Under Review</span>
          </div>
          <span className="text-xs font-bold text-amber-700 font-mono">
            {pendingRequests} pending
          </span>
        </div>
      </div>

      {/* Charts Section - White cards with Blue & Green series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: SMS Volume */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">SMS Volume</h3>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-600 font-medium">API Sent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 font-medium">Dashboard Sent</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Daily SMS sending patterns over the last week
            </p>
          </div>

          {/* SVG Line Chart */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="relative h-48 w-full">
              {/* Y Axis Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none">
                {[4, 3, 2, 1, 0].map((tick) => (
                  <div key={tick} className="flex items-center w-full">
                    <span className="w-5 shrink-0 text-left">{tick}</span>
                    <div className="flex-1 border-b border-slate-100 ml-2" />
                  </div>
                ))}
              </div>

              {/* Chart SVG Canvas */}
              <svg className="absolute inset-0 w-full h-full pl-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Dashboard Sent Line (Emerald/Green) */}
                <path
                  d="M 20 170 L 110 170 L 200 170 L 290 170 L 380 170 L 470 120 L 560 80"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* API Sent Line (Enterprise Blue dashed) */}
                <path
                  d="M 20 170 L 110 170 L 200 170 L 290 170 L 380 170 L 470 170 L 560 140"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                <circle cx="470" cy="120" r="4.5" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="560" cy="80" r="4.5" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="560" cy="140" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between pl-6 mt-2 text-[10px] text-slate-500 font-mono font-medium">
              {volumeData.map((d) => (
                <span key={d.date}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Weekly API Call */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Weekly API Call</h3>
              <span className="text-[11px] font-semibold text-slate-500">Total calls: {apiSent}</span>
            </div>
            <p className="text-xs text-slate-500">Weekly API call distribution</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="relative h-48 w-full">
              {/* Y Axis Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none">
                {[4, 3, 2, 1, 0].map((tick) => (
                  <div key={tick} className="flex items-center w-full">
                    <span className="w-5 shrink-0 text-left">{tick}</span>
                    <div className="flex-1 border-b border-slate-100 ml-2" />
                  </div>
                ))}
              </div>

              {/* Bar Elements */}
              <div className="absolute inset-0 pl-6 flex items-end justify-between px-3">
                {apiDays.map((col, idx) => {
                  const heightPercent = col.calls === 0 ? 3 : (col.calls / 4) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-7 rounded-t transition-all duration-300 ${
                          col.calls > 0
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between pl-6 mt-2 text-[10px] text-slate-500 font-mono font-medium">
              {apiDays.map((d) => (
                <span key={d.day} className="flex-1 text-center">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch & Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Authorized Sender IDs Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Authorized Sender IDs
            </h3>
            <button
              onClick={() => onNavigate('sms-sender-ids')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {authorizedSenderIds.length > 0 ? (
              authorizedSenderIds.map((sid) => (
                <div
                  key={sid.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {sid.senderId}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 uppercase">
                      {sid.channelType}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Configured
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No authorized Sender IDs configured.</p>
            )}
          </div>
        </div>

        {/* Recent SMS Activity Feed */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent SMS Dispatches
            </h3>
            <button
              onClick={() => onNavigate('sms-log')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
            >
              Full Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Sender ID</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.slice(0, 4).map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{msg.recipient}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{msg.senderId}</td>
                    <td className="py-2.5 px-3 text-slate-500 uppercase text-[10px] font-mono">{msg.channel}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          msg.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : msg.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            msg.status === 'delivered'
                              ? 'bg-emerald-500'
                              : msg.status === 'failed'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[11px] font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
