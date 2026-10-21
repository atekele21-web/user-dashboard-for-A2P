import React, { useState } from 'react';
import { Receipt, Search, Download } from 'lucide-react';
import { BillingTransaction } from '../../types';

interface TransactionLogViewProps {
  transactions: BillingTransaction[];
}

export const TransactionLogView: React.FC<TransactionLogViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((t) =>
    t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Billing Transaction Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete audit trail of prepaid top-ups, SMS usage deductions, and carrier fees.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
          <input
            type="text"
            placeholder="Search by reference or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <span className="text-xs text-slate-500 font-mono font-medium">{filtered.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Transaction Description</th>
                <th className="py-3 px-4 text-right">Debit / Credit (ETB)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Settled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-[11px]">
                    {t.reference}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block uppercase text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{t.description}</td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                      t.amountETB > 0 ? 'text-emerald-600' : 'text-slate-700'
                    }`}
                  >
                    {t.amountETB > 0 ? `+${t.amountETB.toFixed(2)}` : t.amountETB.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500 text-[11px]">
                    {new Date(t.date).toLocaleString()}
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
