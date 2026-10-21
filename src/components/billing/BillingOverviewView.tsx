import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { PartnerProfile, BillingTransaction } from '../../types';

interface BillingOverviewViewProps {
  partner: PartnerProfile;
  transactions: BillingTransaction[];
}

export const BillingOverviewView: React.FC<BillingOverviewViewProps> = ({
  partner,
  transactions,
}) => {
  const [showTopUpNotice, setShowTopUpNotice] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Billing & Credit Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prepaid account credit, commercial rates, and transaction settlement.
          </p>
        </div>

        <button
          onClick={() => setShowTopUpNotice(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Top Up Prepaid Credit</span>
        </button>
      </div>

      {showTopUpNotice && (
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-2xs text-xs text-blue-950 space-y-2">
          <div className="flex items-center justify-between text-blue-900 font-bold">
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" /> Prepaid Top-Up Integration Point
            </span>
            <button onClick={() => setShowTopUpNotice(false)} className="text-slate-400 hover:text-slate-700">
              Dismiss
            </button>
          </div>
          <p className="leading-relaxed text-blue-900">
            Payment gateways (Telebirr SuperApp, Commercial Bank of Ethiopia CbeBirr, and Bank Wire transfers) will be integrated directly via the future production backend. In this prototype dashboard, account credit reflects the configured demonstration balance.
          </p>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Available Prepaid Balance</span>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1.5">
            ETB {partner.balanceETB.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold text-emerald-600">
            <span>Prepaid Account Active</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Current Base Tariff</span>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono mt-1.5">
            ETB {partner.ratePerSmsETB.toFixed(2)}
          </p>
          <div className="mt-2.5 text-[11px] text-slate-500 font-medium">
            Per standard GSM-7 message segment
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Partner Tier</span>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">{partner.tier}</p>
          <div className="mt-2.5 text-[11px] text-emerald-700 font-semibold">
            Enterprise Tier SLA Active
          </div>
        </div>
      </div>

      {/* Recent billing ledger */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Recent Financial Transactions</h3>
          <span className="text-xs text-slate-500 font-medium">Currency: Ethiopian Birr (ETB)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount (ETB)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11px]">
                    {txn.reference}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-mono font-bold text-blue-700">
                    {txn.type.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{txn.description}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono font-bold ${
                      txn.amountETB > 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {txn.amountETB > 0 ? `+${txn.amountETB.toFixed(2)}` : txn.amountETB.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                      Settled
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
                    {new Date(txn.date).toLocaleDateString()}
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
