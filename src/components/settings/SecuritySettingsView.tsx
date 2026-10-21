import React from 'react';
import { Shield, KeyRound, Lock, Smartphone } from 'lucide-react';

export const SecuritySettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Security & Access Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Two-factor authentication, session management, and authentication policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-500">Time-based OTP via Authenticator app</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Protect account credentials and programmatic dispatch keys from unauthorized compromise.
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
              2FA Configured (Enforced)
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">API Key Auto-Expiry Policy</h3>
              <p className="text-xs text-slate-500">Regular 90-day secret rotation</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            API tokens are recommended to be rotated every 90 days to prevent stale token exposure in continuous integration logs.
          </p>
        </div>
      </div>
    </div>
  );
};
