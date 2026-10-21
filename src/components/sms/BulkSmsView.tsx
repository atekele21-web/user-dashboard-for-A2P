import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AuthorizedSenderId, ContactGroup } from '../../types';

interface BulkSmsViewProps {
  authorizedSenderIds: AuthorizedSenderId[];
  contactGroups: ContactGroup[];
  onBatchCreated: () => void;
}

export const BulkSmsView: React.FC<BulkSmsViewProps> = ({
  authorizedSenderIds,
  contactGroups,
  onBatchCreated,
}) => {
  const activeSenderIds = authorizedSenderIds.filter((s) => s.status === 'active');
  const [selectedSenderId, setSelectedSenderId] = useState<string>(activeSenderIds[0]?.senderId || '');
  const [batchName, setBatchName] = useState<string>('');
  const [recipientInput, setRecipientInput] = useState<string>('+251911223344\n+251922334455\n+251933445566\n0911556677');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('Important partner notification: System updates have completed successfully. Service is fully operational.');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [step, setStep] = useState<'compose' | 'review'>('compose');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Parse recipients
  const parsedNumbers = recipientInput
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const validNumbers: string[] = [];
  const invalidNumbers: string[] = [];

  parsedNumbers.forEach((num) => {
    const clean = num.replace(/[\s-]/g, '');
    if (/^(\+251|0)(9|7)\d{8}$/.test(clean)) {
      validNumbers.push(clean);
    } else {
      invalidNumbers.push(num);
    }
  });

  const hasUnicode = /[^\u0000-\u007F]/.test(messageText);
  const singleLimit = hasUnicode ? 70 : 160;
  const multiLimit = hasUnicode ? 67 : 153;
  const charCount = messageText.length;
  const segments = charCount === 0 ? 0 : charCount <= singleLimit ? 1 : Math.ceil(charCount / multiLimit);
  const totalCostEstimate = (validNumbers.length * segments * 0.35).toFixed(2);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    if (!groupId) return;
    const group = contactGroups.find((g) => g.id === groupId);
    if (group) {
      setRecipientInput('+251911445566\n+251922778899\n+251933112233\n+251711223344');
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!batchName.trim()) {
      setFeedback({ type: 'error', text: 'Batch campaign name is required.' });
      return;
    }
    if (!selectedSenderId) {
      setFeedback({ type: 'error', text: 'Please select an authorized Sender ID.' });
      return;
    }
    if (validNumbers.length === 0) {
      setFeedback({ type: 'error', text: 'At least one valid Ethiopian mobile number is required.' });
      return;
    }
    if (!messageText.trim()) {
      setFeedback({ type: 'error', text: 'Message body cannot be empty.' });
      return;
    }

    setStep('review');
  };

  const handleDispatch = () => {
    try {
      StorageService.createBulkBatch({
        batchName: batchName.trim(),
        senderId: selectedSenderId,
        recipients: validNumbers,
        messageText: messageText.trim(),
        scheduledAt: scheduledAt || undefined,
      });

      setFeedback({
        type: 'success',
        text: `Batch "${batchName}" dispatched in simulated mode (${validNumbers.length} recipients).`,
      });

      onBatchCreated();
      setStep('compose');
      setBatchName('');
      setRecipientInput('');
      setMessageText('');
      setScheduledAt('');
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to dispatch batch.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Bulk SMS Campaign Dispatch
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Broadcast broadcast-grade messages to subscriber lists and contact groups.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.text}</span>
        </div>
      )}

      {step === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleReview} className="lg:col-span-8 bg-white border border-slate-200 shadow-2xs rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campaign Batch Name <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. End of Month Member Statements"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Authorized Sender ID <span className="text-blue-600">*</span>
                </label>
                <select
                  value={selectedSenderId}
                  onChange={(e) => setSelectedSenderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                >
                  {activeSenderIds.map((s) => (
                    <option key={s.id} value={s.senderId}>
                      {s.senderId} ({s.channelType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Contact Group (Optional)
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => handleGroupSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="">-- Or enter recipients manually --</option>
                  {contactGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.contactCount} contacts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipient list / numbers */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Recipient Numbers (one per line or comma-separated) <span className="text-blue-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  {validNumbers.length} valid · {invalidNumbers.length} invalid
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="+251911223344&#10;+251922334455&#10;0911334455"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none"
              />
              {invalidNumbers.length > 0 && (
                <div className="mt-2 p-2.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
                  <strong>Non-standard numbers detected:</strong> {invalidNumbers.slice(0, 3).join(', ')}{invalidNumbers.length > 3 ? ` (+${invalidNumbers.length - 3} more)` : ''}
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Broadcast Message Content <span className="text-blue-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 tabular-nums font-medium">
                  {charCount} chars · {segments} seg/msg
                </span>
              </div>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-sans resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Campaign summary card */}
          <div className="lg:col-span-4 bg-white border border-slate-200 shadow-2xs rounded-xl p-6 space-y-4 self-start">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Batch Estimate
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Valid Recipients:</span>
                <span className="font-mono font-bold text-slate-900">{validNumbers.length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Segments per SMS:</span>
                <span className="font-mono text-slate-700">{segments}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total SMS Units:</span>
                <span className="font-mono text-blue-600 font-bold">
                  {validNumbers.length * segments}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Estimated Cost:</span>
                <span className="font-mono font-bold text-slate-900">ETB {totalCostEstimate}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/70 text-[11px] text-blue-900 leading-relaxed">
              <span className="text-blue-700 font-bold">Demonstration Batching:</span> Batching will execute locally in client memory and write records to the Bulk Monitor. Upstream carrier queues are inactive in prototype mode.
            </div>
          </div>
        </div>
      ) : (
        /* Review Screen */
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-2xs rounded-xl p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900">
            Confirm Bulk SMS Campaign Dispatch
          </h3>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Campaign Name:</span>
              <span className="font-bold text-slate-900">{batchName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sender ID:</span>
              <span className="font-mono text-blue-700 font-bold">{selectedSenderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audience:</span>
              <span className="font-mono text-slate-900 font-semibold">{validNumbers.length} valid recipients</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Message Size:</span>
              <span className="font-mono text-slate-700">{charCount} characters ({segments} segment/recipient)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Cost:</span>
              <span className="font-mono text-slate-900 font-bold">ETB {totalCostEstimate}</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="block text-slate-500 mb-1">Message Preview:</span>
              <p className="p-3 rounded bg-white border border-slate-200 text-slate-800 font-sans leading-relaxed">
                {messageText}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setStep('compose')}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handleDispatch}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Confirm & Dispatch Batch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
