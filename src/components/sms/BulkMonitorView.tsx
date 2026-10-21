import React from 'react';
import { BulkBatch } from '../../types';

interface BulkMonitorViewProps {
  batches: BulkBatch[];
}

export const BulkMonitorView: React.FC<BulkMonitorViewProps> = ({ batches }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Bulk Campaign Monitor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status tracking for broadcast batches dispatched by your account.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Batches</span>
          <p className="text-xl font-bold text-slate-900 font-mono mt-1">{batches.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Recipients Processed</span>
          <p className="text-xl font-bold text-blue-600 font-mono mt-1">
            {batches.reduce((acc, b) => acc + b.processedRecipients, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Delivered Success</span>
          <p className="text-xl font-bold text-emerald-600 font-mono mt-1">
            {batches.reduce((acc, b) => acc + b.deliveredCount, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Failed Numbers</span>
          <p className="text-xl font-bold text-rose-600 font-mono mt-1">
            {batches.reduce((acc, b) => acc + b.failedCount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Campaign Execution Queue</h3>
          <span className="text-xs text-slate-500 font-mono font-medium">{batches.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Batch ID / Name</th>
                <th className="py-3 px-4">Sender ID</th>
                <th className="py-3 px-4">Created Time</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4 text-right">Recipients</th>
                <th className="py-3 px-4 text-right">Delivered</th>
                <th className="py-3 px-4 text-right">Failed</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => {
                const percent =
                  batch.validRecipients > 0
                    ? Math.round((batch.processedRecipients / batch.validRecipients) * 100)
                    : 100;

                return (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{batch.batchName}</p>
                      <p className="text-[11px] font-mono text-slate-400">{batch.id}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {batch.senderId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(batch.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full ${
                            batch.status === 'completed' ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                        />
                      </div>
                      <span className="block text-center text-[10px] text-slate-500 mt-1 font-mono font-medium">
                        {percent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {batch.validRecipients}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      {batch.deliveredCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                      {batch.failedCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          batch.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : batch.status === 'queued'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {batch.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
