import React, { useState } from 'react';
import { Search, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { SmsMessage } from '../../types';

interface SmsLogViewProps {
  messages: SmsMessage[];
}

export const SmsLogView: React.FC<SmsLogViewProps> = ({ messages }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered' | 'failed'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'api' | 'dashboard'>('all');

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.messageText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || m.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Sender ID,Recipient,Segments,Encoding,Status,Channel,Created At,Cost ETB\n';
    const rows = filtered
      .map(
        (m) =>
          `"${m.id}","${m.senderId}","${m.recipient}",${m.segments},"${m.encoding}","${m.status}","${m.channel}","${m.createdAt}",${m.costETB}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simconnect_sms_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            SMS Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transaction-level audit records of individual and batch dispatches.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by recipient phone, sender ID, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>

          {/* Channel selector */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Channels</option>
            <option value="api">API Submissions</option>
            <option value="dashboard">Dashboard Portal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Message Ref</th>
                <th className="py-3 px-4">Sender ID</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Content Preview</th>
                <th className="py-3 px-4 text-center">Segments</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Dispatched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {msg.id}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {msg.senderId}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {msg.recipient}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {msg.messageText}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">
                      {msg.segments} ({msg.encoding})
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase font-mono font-semibold border border-slate-200">
                        {msg.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          msg.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : msg.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {msg.status === 'delivered' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : msg.status === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      ETB {msg.costETB.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No SMS dispatches match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
