import React from 'react';
import { Clock } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ScheduledMessage } from '../../types';

interface ScheduleSmsViewProps {
  scheduledMessages: ScheduledMessage[];
  onUpdate: () => void;
}

export const ScheduleSmsView: React.FC<ScheduleSmsViewProps> = ({
  scheduledMessages,
  onUpdate,
}) => {
  const handleCancel = (id: string) => {
    if (confirm('Cancel this scheduled dispatch?')) {
      StorageService.cancelScheduledMessage(id);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Scheduled SMS Queue
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated messages queued for future broadcast in East Africa Time (UTC+3, Addis Ababa).
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Upcoming Timed Dispatches</h3>
          <span className="text-xs text-slate-500 font-mono font-medium">Timezone: Africa/Addis_Ababa</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Schedule ID</th>
                <th className="py-3 px-4">Sender ID</th>
                <th className="py-3 px-4">Target Recipient / Group</th>
                <th className="py-3 px-4">Message Body</th>
                <th className="py-3 px-4">Scheduled Time (EAT)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scheduledMessages.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{sch.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{sch.senderId}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold">{sch.recipientOrGroup}</td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{sch.messageText}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(sch.scheduledTime).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        sch.status === 'scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : sch.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {sch.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {sch.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(sch.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Cancel Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
