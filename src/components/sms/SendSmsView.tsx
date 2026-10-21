import React, { useState } from 'react';
import {
  Send,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AuthorizedSenderId, SmsTemplate } from '../../types';

interface SendSmsViewProps {
  authorizedSenderIds: AuthorizedSenderId[];
  templates: SmsTemplate[];
  onMessageSent: () => void;
}

export const SendSmsView: React.FC<SendSmsViewProps> = ({
  authorizedSenderIds,
  templates,
  onMessageSent,
}) => {
  const activeSenderIds = authorizedSenderIds.filter((s) => s.status === 'active');
  const [selectedSenderId, setSelectedSenderId] = useState<string>(
    activeSenderIds[0]?.senderId || ''
  );
  const [recipient, setRecipient] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
    details?: string;
  } | null>(null);

  // Validate Ethiopian mobile number
  const cleanPhone = recipient.trim().replace(/[\s-]/g, '');
  const isValidPhone = /^(\+251|0)(9|7)\d{8}$/.test(cleanPhone);

  // Encoding & segments
  const hasUnicode = /[^\u0000-\u007F]/.test(messageText);
  const singleLimit = hasUnicode ? 70 : 160;
  const multiLimit = hasUnicode ? 67 : 153;
  const charCount = messageText.length;
  const segments = charCount === 0 ? 0 : charCount <= singleLimit ? 1 : Math.ceil(charCount / multiLimit);

  const handleTemplateSelect = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    if (!tmplId) return;
    const found = templates.find((t) => t.id === tmplId);
    if (found) {
      setMessageText(found.content);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedSenderId) {
      setFeedback({ type: 'error', text: 'Please select an authorized Sender ID.' });
      return;
    }
    if (!isValidPhone) {
      setFeedback({
        type: 'error',
        text: 'Invalid Ethiopian mobile number. Expected format: +251911223344 or 0911223344.',
      });
      return;
    }
    if (!messageText.trim()) {
      setFeedback({ type: 'error', text: 'Message body cannot be empty.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = StorageService.sendSingleSms({
        senderId: selectedSenderId,
        recipient: cleanPhone,
        messageText: messageText.trim(),
        channel: 'dashboard',
      });

      setFeedback({
        type: 'success',
        text: 'Demo message dispatch recorded.',
        details: result.notice,
      });

      onMessageSent();
      setRecipient('');
      setMessageText('');
      setSelectedTemplateId('');
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setFeedback({ type: 'error', text: err.message || 'Failed to dispatch message.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Send Individual SMS
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compose and dispatch a single message via authorized Ethiopian telecom channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-2xs rounded-xl p-6 space-y-5">
          <form onSubmit={handleSend} className="space-y-4">
            {/* Sender ID selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Authorized Sender ID <span className="text-blue-600">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Must be active & approved</span>
              </div>
              {activeSenderIds.length > 0 ? (
                <select
                  value={selectedSenderId}
                  onChange={(e) => setSelectedSenderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono font-medium"
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

            {/* Template quick loader */}
            {templates.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Insert Message Template (Optional)
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="">-- Select a template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recipient */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Recipient Mobile Number <span className="text-blue-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Ethiopian MSISDN (+251)</span>
              </div>
              <input
                type="text"
                placeholder="+251 91 123 4567 or 0911234567"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                  recipient && !isValidPhone
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/10'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
                }`}
              />
              {recipient && !isValidPhone && (
                <p className="mt-1 text-[11px] text-amber-600 font-medium">
                  Number must match Ethiopian format: +251 9XXXXXXXX, +251 7XXXXXXXX, 09XXXXXXXX, or 07XXXXXXXX.
                </p>
              )}
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Message Content <span className="text-blue-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 tabular-nums font-medium">
                  {charCount} chars · {segments} segment{segments !== 1 ? 's' : ''} · {hasUnicode ? 'Unicode (70 char/seg)' : 'GSM-7 (160 char/seg)'}
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="Type your message text here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-sans resize-none"
              />
            </div>

            {/* Feedback alert */}
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

            {/* Demo Notice */}
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong className="text-blue-950 font-semibold">Prototype Environment:</strong> Submitted messages are validated and recorded into your partner session audit log. Carrier dispatch to Ethio telecom upstream SMSC will be handled by the production backend.
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || activeSenderIds.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>{isSubmitting ? 'Dispatching...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Phone Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white border border-slate-200 shadow-2xs rounded-xl">
          <div className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>Handset Preview</span>
          </div>

          {/* Smartphone Frame */}
          <div className="w-68 h-[440px] bg-slate-900 border-4 border-slate-300 rounded-[32px] p-3 shadow-xl flex flex-col text-slate-100">
            {/* Top Speaker bar */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-3" />

            {/* Recipient status bar */}
            <div className="text-center pb-2 border-b border-slate-800">
              <p className="text-xs font-bold text-white tracking-wide">
                {selectedSenderId || 'Sender ID'}
              </p>
              <p className="text-[9px] text-slate-400">SIMConnect SMS · Ethio telecom</p>
            </div>

            {/* Message Bubble area */}
            <div className="flex-1 py-4 px-1 overflow-y-auto space-y-2">
              <div className="text-[9px] text-center text-slate-400 mb-1">
                Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              {messageText.trim() ? (
                <div className="p-3 rounded-2xl rounded-tl-xs bg-blue-600 text-white text-xs shadow-sm max-w-[92%] whitespace-pre-wrap leading-relaxed">
                  {messageText}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-xs italic">
                  Enter message text to preview appearance on subscriber mobile screen.
                </div>
              )}
            </div>

            {/* Bottom Home indicator */}
            <div className="w-20 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
