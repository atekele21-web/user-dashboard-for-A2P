import React from 'react';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { NotificationItem } from '../../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onUpdate: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onUpdate,
}) => {
  const handleMarkAll = () => {
    StorageService.markAllNotificationsRead();
    onUpdate();
  };

  const handleMarkOne = (id: string) => {
    StorageService.markNotificationRead(id);
    onUpdate();
  };

  const getIcon = (sev: NotificationItem['severity']) => {
    switch (sev) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System announcements, Ethio telecom SMMP updates, and batch completion reports.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkOne(n.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              n.read
                ? 'bg-white border-slate-200 opacity-85 hover:border-slate-300'
                : 'bg-blue-50/50 border-blue-200 shadow-2xs hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5">{getIcon(n.severity)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                  {new Date(n.timestamp).toLocaleString()} · Category: {n.category.toUpperCase()}
                </span>
              </div>
            </div>

            {!n.read && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shrink-0 font-semibold">
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
