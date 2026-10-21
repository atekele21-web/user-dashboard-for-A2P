import React from 'react';
import { FileText, Download, Info } from 'lucide-react';
import { PartnerProfile } from '../../types';

interface InvoicesViewProps {
  partner: PartnerProfile;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ partner }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Invoices & Statements
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monthly VAT fiscal invoices, credit receipts, and official tax statements.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-900">ERP Fiscal Synchronization:</strong> Official Ethiopian Ministry of Revenues electronic invoices (with registered TIN <span className="font-mono font-semibold text-blue-700">{partner.tin}</span>) are generated at monthly close. In this preview dashboard, sample statements can be inspected below.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
              <th className="py-3 px-4">Statement Period</th>
              <th className="py-3 px-4">Fiscal Invoice #</th>
              <th className="py-3 px-4 text-right">Prepaid Credits</th>
              <th className="py-3 px-4 text-right">Usage (ETB)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 font-medium text-slate-900">September 2026</td>
              <td className="py-3 px-4 font-mono font-semibold text-blue-700">INV-2026-09-0842</td>
              <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">ETB 5,000.00</td>
              <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">ETB 1,550.00</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[11px]">Paid & Closed</span>
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => alert('Fiscal PDF download will be served by future backend ERP integration.')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
