import React, { useState } from 'react';
import { Plus, Trash2, Info, X } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { IpWhitelistEntry } from '../../types';

interface IpWhitelistViewProps {
  whitelist: IpWhitelistEntry[];
  onUpdate: () => void;
}

export const IpWhitelistView: React.FC<IpWhitelistViewProps> = ({ whitelist, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validate IPv4 or CIDR
  const isValidIp = (ip: string) => {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4Regex.test(ip.trim());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clean = ipAddress.trim();
    if (!isValidIp(clean)) {
      setErrorMsg('Invalid IPv4 address or CIDR notation (e.g. 197.156.104.22 or 196.188.64.0/24).');
      return;
    }
    if (!label.trim()) {
      setErrorMsg('Label / Server identifier is required.');
      return;
    }

    StorageService.addIpWhitelist({
      ipAddress: clean,
      label: label.trim(),
      description: description.trim() || 'Custom ingress allowlist entry',
    });

    onUpdate();
    setShowModal(false);
    setIpAddress('');
    setLabel('');
    setDescription('');
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove this IP address from your account allowlist?')) {
      StorageService.removeIpWhitelist(id);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            IP Whitelist / Allowlist
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Restrict REST API invocation exclusively to verified enterprise servers and VPN gateways.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Allowed IP / CIDR</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 shadow-2xs text-xs text-blue-950 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-blue-900">API Boundary:</strong> IP whitelist rules govern programmatic REST API invocations via API keys. They do not block web dashboard logins from normal authorized user browsers.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">IP Address / CIDR</th>
                <th className="py-3 px-4">Server Label</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Added Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {whitelist.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700 text-xs">
                    {item.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.label}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.description}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Allowlist
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Add Allowed IP</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IPv4 Address or Subnet CIDR <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 197.156.104.22 or 196.188.64.0/24"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Server Identifier / Label <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Europe Gateway Node 1"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Main production database egress proxy"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {errorMsg}
                </div>
              )}

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
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs"
                >
                  Save IP Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
