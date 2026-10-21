import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface ImportContactsViewProps {
  onUpdate: () => void;
}

export const ImportContactsView: React.FC<ImportContactsViewProps> = ({ onUpdate }) => {
  const [csvText, setCsvText] = useState(
    'Name,Phone,Email\nTewodros Kassahun,+251911440011,teddy@music.et\nMeseret Defar,+251922550022,meseret@athletics.et\nInvalid Guy,09871,\nDuplicate Contact,+251911440011,teddy@music.et'
  );
  const [results, setResults] = useState<{
    total: number;
    valid: Array<{ name: string; phone: string; email?: string }>;
    invalid: Array<{ row: string; reason: string }>;
    duplicates: number;
    imported: boolean;
  } | null>(null);

  const handleParseAndValidate = () => {
    const lines = csvText.trim().split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Check header
    const dataLines = lines[0].toLowerCase().includes('phone') ? lines.slice(1) : lines;

    const valid: Array<{ name: string; phone: string; email?: string }> = [];
    const invalid: Array<{ row: string; reason: string }> = [];
    const seenPhones = new Set<string>();
    let duplicates = 0;

    dataLines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      const name = parts[0] || 'Subscriber';
      const rawPhone = parts[1] || '';
      const email = parts[2] || undefined;

      const cleanPhone = rawPhone.replace(/[\s-]/g, '');
      const isValid = /^(\+251|0)(9|7)\d{8}$/.test(cleanPhone);

      if (!isValid) {
        invalid.push({ row: line, reason: 'Invalid Ethiopian MSISDN format' });
        return;
      }

      if (seenPhones.has(cleanPhone)) {
        duplicates++;
        invalid.push({ row: line, reason: 'Duplicate phone number in CSV file' });
        return;
      }

      seenPhones.add(cleanPhone);
      valid.push({ name, phone: cleanPhone, email });
    });

    setResults({
      total: dataLines.length,
      valid,
      invalid,
      duplicates,
      imported: false,
    });
  };

  const handleCommitImport = () => {
    if (!results || results.valid.length === 0) return;

    results.valid.forEach((c) => {
      StorageService.addContact({
        name: c.name,
        phone: c.phone,
        email: c.email,
        groupIds: [],
      });
    });

    setResults({ ...results, imported: true });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Import Contacts (CSV)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Bulk import customer phone numbers with instant validation of Ethiopian carrier formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
          <label className="block text-xs font-semibold text-slate-700">
            Paste CSV Data (Columns: Name, Phone, Email)
          </label>
          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setResults(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed transition-colors"
          />

          <div className="flex justify-end">
            <button
              onClick={handleParseAndValidate}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Parse & Validate Records</span>
            </button>
          </div>
        </div>

        {/* Validation summary card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            CSV Validation Summary
          </h3>

          {results ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Rows Detected:</span>
                <span className="font-mono font-bold text-slate-900">{results.total}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Valid Ethiopian Numbers:</span>
                <span className="font-mono font-bold text-emerald-600">{results.valid.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Invalid Rows:</span>
                <span className="font-mono font-bold text-rose-600">{results.invalid.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duplicate Entries:</span>
                <span className="font-mono font-bold text-amber-600">{results.duplicates}</span>
              </div>

              {results.imported ? (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Successfully imported {results.valid.length} contacts to directory!</span>
                </div>
              ) : (
                <button
                  onClick={handleCommitImport}
                  disabled={results.valid.length === 0}
                  className="w-full mt-2 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-lg shadow-xs transition-colors"
                >
                  Commit Import of {results.valid.length} Valid Contacts
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste or edit your CSV text and click "Parse & Validate Records" to inspect quality metrics before saving.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
