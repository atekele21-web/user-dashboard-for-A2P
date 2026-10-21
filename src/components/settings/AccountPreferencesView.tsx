import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { PartnerProfile, AuthorizedSenderId } from '../../types';

interface AccountPreferencesViewProps {
  partner: PartnerProfile;
  authorizedSenderIds: AuthorizedSenderId[];
  onUpdate: () => void;
}

export const AccountPreferencesView: React.FC<AccountPreferencesViewProps> = ({
  partner,
  authorizedSenderIds,
  onUpdate,
}) => {
  const [defaultSenderId, setDefaultSenderId] = useState(partner.defaultSenderId);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateProfile({ defaultSenderId });
    setSaved(true);
    onUpdate();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Account Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure default dispatch defaults and alert preferences.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default Sender ID for Quick SMS
            </label>
            <select
              value={defaultSenderId}
              onChange={(e) => setDefaultSenderId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {authorizedSenderIds.map((s) => (
                <option key={s.id} value={s.senderId}>
                  {s.senderId} ({s.channelType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System Timezone
            </label>
            <input
              type="text"
              disabled
              value="Africa/Addis_Ababa (East Africa Time, UTC+3)"
              className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
