import React from 'react';
import { BookOpen, HelpCircle, Shield, Network, Users, CreditCard, Send, FileCode } from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Help & Operational Guidance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Technical specifications, Ethio telecom A2P compliance procedures, and platform integration rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 1: Sending SMS */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wide">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Sending SMS & Character Limits</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard GSM 7-bit text supports up to 160 characters for a single message segment. Messages exceeding 160 characters are split into concatenated segments of 153 characters each. If special Unicode or Amharic characters are included, messages switch to UCS-2 encoding (70 characters single, 67 characters multi-segment).
          </p>
        </div>

        {/* Section 2: Sender ID Approval */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wide">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Sender ID Approval & SMMP Rules</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Partners may only send messages using approved alphanumeric Sender IDs. Entering a Sender ID in the dashboard does not activate it. It must be vetted by SIMConnect compliance and registered with Ethio telecom through the SMMP gateway.
          </p>
        </div>

        {/* Section 3: API Security */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wide">
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>API Key Security</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            API keys must be stored in secure environment variables on your backend servers. Upstream SMSC connection parameters and Ethio telecom carrier credentials belong strictly to SIMConnect infrastructure and are never exposed to partner accounts.
          </p>
        </div>

        {/* Section 4: IP Allowlisting */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wide">
            <Network className="w-4 h-4 text-emerald-600" />
            <span>IP Whitelist Enforcement</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            IP restrictions apply strictly to API calls made using your partner API keys. They do not block ordinary browser logins to this dashboard. Whitelisting ensures only your application servers can dispatch messages.
          </p>
        </div>

        {/* Section 5: Bulk Uploads */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wide">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Bulk Upload Format & Numbers</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recipients must follow the Ethiopian National Numbering Plan (+251 9XXXXXXXX, +251 7XXXXXXXX, 09XXXXXXXX, or 07XXXXXXXX). Invalid and duplicate phone numbers are reported in the validation review gate before dispatch.
          </p>
        </div>

        {/* Section 6: Delivery Reports */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wide">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Delivery Reports (DLR)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            DLR receipts represent terminal handset acknowledgments returned through the Ethio telecom SMSC. An accepted submission is not marked as delivered until upstream delivery confirmation is received.
          </p>
        </div>
      </div>

      {/* Support Contact Note */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700">
        <span className="text-slate-900 font-semibold">Technical Support Channel:</span> Direct SLA and ticketing contact details will be provisioned by your SIMConnect account manager upon production contract completion.
      </div>
    </div>
  );
};
