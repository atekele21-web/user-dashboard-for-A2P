import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AuthorizedSenderId } from '../../types';

interface QuickSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorizedSenderIds: AuthorizedSenderId[];
  onMessageSent: () => void;
}

export const QuickSmsModal: React.FC<QuickSmsModalProps> = ({
  isOpen,
  onClose,
  authorizedSenderIds,
  onMessageSent,
}) => {
  const activeSenderIds = authorizedSenderIds.filter((s) => s.status === 'active');
  const [selectedSenderId, setSelectedSenderId] = useState<string>(
    activeSenderIds[0]?.senderId || ''
  );
  const [recipient, setRecipient] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
    details?: string;
  } | null>(null);

  if (!isOpen) return null;

  // Ethiopian mobile validation: +251 9... or +251 7... or 09... or 07...
  const cleanRecipient = recipient.trim().replace(/[\s-]/g, '');
  const isValidPhone = /^(\+251|0)(9|7)\d{8}$/.test(cleanRecipient);

  // Segment and encoding calculation
  const hasUnicode = /[^\u0000-\u007F]/.test(messageText);
  const charLimit = hasUnicode ? 70 : 160;
  const multiLimit = hasUnicode ? 67 : 153;
  const charCount = messageText.length;
  const segments = charCount === 0 ? 0 : charCount <= charLimit ? 1 : Math.ceil(charCount / multiLimit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedSenderId) {
      setFeedback({
        type: 'error',
        text: 'Please select an authorized Sender ID.',
      });
      return;
    }

    if (!isValidPhone) {
      setFeedback({
        type: 'error',
        text: 'Invalid Ethiopian mobile number. Format: +251 9XXXXXXXX, +251 7XXXXXXXX, or 09XXXXXXXX.',
      });
      return;
    }

    if (!messageText.trim()) {
      setFeedback({
        type: 'error',
        text: 'Message body cannot be empty.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = StorageService.sendSingleSms({
        senderId: selectedSenderId,
        recipient: cleanRecipient,
        messageText: messageText.trim(),
        channel: 'dashboard',
      });

      setFeedback({
        type: 'success',
        text: 'Demo submission recorded in audit log.',
        details: result.notice,
      });

      onMessageSent();
      setTimeout(() => {
        setIsSubmitting(false);
        setRecipient('');
        setMessageText('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to submit message.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick SMS Dispatch</h3>
              <p className="text-[11px] text-slate-500 font-medium">Send an individual A2P message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Authorized Sender ID <span className="text-blue-600">*</span>
            </label>
            {activeSenderIds.length > 0 ? (
              <select
                value={selectedSenderId}
                onChange={(e) => setSelectedSenderId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
              >
                {activeSenderIds.map((s) => (
                  <option key={s.id} value={s.senderId}>
                    {s.senderId} ({s.channelType.toUpperCase()} - Ethio telecom configured)
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 text-xs bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  No approved Sender IDs found for this account. Sender IDs must be reviewed and configured via Ethio telecom SMMP before sending.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Recipient Mobile Number <span className="text-blue-600">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono font-medium">Ethiopia (+251)</span>
            </div>
            <input
              type="text"
              placeholder="+251911223344 or 0911223344"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                recipient && !isValidPhone
                  ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/10'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
            {recipient && !isValidPhone && (
              <p className="mt-1 text-[11px] text-amber-600 font-medium">
                Format must be an Ethiopian mobile number starting with +251 9/7 or 09/07.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Message Text <span className="text-blue-600">*</span>
              </label>
              <span className="text-[11px] text-slate-500 tabular-nums font-medium">
                {charCount} chars · {segments} segment{segments !== 1 ? 's' : ''} ({hasUnicode ? 'Unicode' : 'GSM 7-bit'})
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Enter message text here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none font-sans"
            />
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{feedback.text}</p>
                {feedback.details && (
                  <p className="text-[11px] opacity-90 mt-0.5">{feedback.details}</p>
                )}
              </div>
            </div>
          )}

          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/70 text-[11px] text-blue-900 leading-relaxed">
            <span className="text-blue-700 font-bold">Demo Submission:</span> Dispatches are recorded locally in your demonstration audit log. Upstream Ethio telecom SMSC credentials are protected in server-side infrastructure and will connect in the future backend.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || activeSenderIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>{isSubmitting ? 'Recording...' : 'Send Message'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
