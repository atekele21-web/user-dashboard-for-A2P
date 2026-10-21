import React, { useState } from 'react';
import { Plus, ShieldCheck, Copy, Check } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ApiKey } from '../../types';

interface ApiKeysViewProps {
  apiKeys: ApiKey[];
  onUpdate: () => void;
}

export const ApiKeysView: React.FC<ApiKeysViewProps> = ({ apiKeys, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [label, setLabel] = useState('');
  const [permissions] = useState<string[]>(['sms:send', 'sms:read', 'dlr:read']);
  const [ipRestricted, setIpRestricted] = useState(true);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const result = StorageService.generateApiKey({
      label: label.trim(),
      permissions,
      ipRestricted,
    });

    setRevealedKey(result.plaintextSecret);
    onUpdate();
    setLabel('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Revoke this API Key? Any integrated servers using this key will immediately lose access.')) {
      StorageService.revokeApiKey(id);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            API Keys Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authenticate programmatic REST API calls from your application or backend servers.
          </p>
        </div>

        <button
          onClick={() => {
            setRevealedKey(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* Security Best Practices Callout */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 shadow-2xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed">
          <p className="font-bold text-blue-900">Security & Credential Isolation</p>
          <p className="mt-0.5 text-blue-800">
            Never embed API keys into client-side code, mobile apps, or public GitHub repositories. Use server-to-server HTTP POST requests. Upstream SMSC connection parameters and Ethio telecom carrier credentials belong strictly to SIMConnect SMS infrastructure and are never exposed to partner API keys.
          </p>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Active Partner API Credentials</h3>
          <span className="text-xs text-slate-500 font-mono font-medium">{apiKeys.length} keys</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Key Label</th>
                <th className="py-3 px-4">Token Prefix & Masked Secret</th>
                <th className="py-3 px-4">IP Restricted</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{key.label}</td>
                  <td className="py-3.5 px-4 font-mono text-blue-700 font-semibold text-xs">{key.maskedKey}</td>
                  <td className="py-3.5 px-4">
                    {key.ipRestricted ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                        Enforced
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                        Any IP
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        key.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {key.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {key.status === 'active' && (
                      <button
                        onClick={() => handleRevoke(key.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Programmatic API Key</h3>

            {revealedKey ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
                  <p className="font-bold">API Key Generated Successfully!</p>
                  <p className="mt-1">
                    Please copy this secret key now. For your security, this key will <strong>never be shown again</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-blue-700 font-bold select-all break-all">
                    {revealedKey}
                  </span>
                  <button
                    onClick={() => handleCopy(revealedKey)}
                    className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shrink-0 shadow-2xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Done (I Have Stored the Key Securely)
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Core eCommerce Backend Dispatcher"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ipRestricted}
                    onChange={(e) => setIpRestricted(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Restrict this key to registered IP Whitelist entries only (Recommended)</span>
                </label>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
