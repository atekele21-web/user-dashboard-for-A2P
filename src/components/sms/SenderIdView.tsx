import React, { useState } from 'react';
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Info,
  Radio,
  X,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { SenderIdRequest, AuthorizedSenderId, SenderIdStatus } from '../../types';

interface SenderIdViewProps {
  senderIdRequests: SenderIdRequest[];
  authorizedSenderIds: AuthorizedSenderId[];
  onUpdate: () => void;
}

export const SenderIdView: React.FC<SenderIdViewProps> = ({
  senderIdRequests,
  onUpdate,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [proposedId, setProposedId] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [businessPurpose, setBusinessPurpose] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('Dawit Mengistu');
  const [contactPhone, setContactPhone] = useState<string>('+251 91 123 4567');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getStatusBadge = (status: SenderIdStatus) => {
    switch (status) {
      case 'approved_configured':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Configured
          </span>
        );
      case 'pending_external_approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-600" /> Ethio Telecom SMMP Pending
          </span>
        );
      case 'under_review':
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Under SIMConnect Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected by Carrier / Review
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
            Draft
          </span>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = proposedId.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Proposed Sender ID cannot be empty.');
      return;
    }
    if (clean.length < 3 || clean.length > 11) {
      setErrorMsg('Sender ID length must be between 3 and 11 alphanumeric characters.');
      return;
    }
    if (!/^[A-Z0-9_-]+$/.test(clean)) {
      setErrorMsg('Sender ID can only contain letters, numbers, hyphens, and underscores.');
      return;
    }
    if (!brandName.trim()) {
      setErrorMsg('Brand or trading name is required.');
      return;
    }
    if (!businessPurpose.trim()) {
      setErrorMsg('Business purpose / intended message use is required.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('You must certify that you hold legal rights to use this brand identity.');
      return;
    }

    try {
      const result = StorageService.submitSenderIdRequest({
        senderId: clean,
        brandName: brandName.trim(),
        businessPurpose: businessPurpose.trim(),
        contactPerson: contactPerson.trim(),
        contactPhone: contactPhone.trim(),
      });

      setSuccessMsg(result.note);
      onUpdate();
      setTimeout(() => {
        setProposedId('');
        setBrandName('');
        setBusinessPurpose('');
        setAcceptedTerms(false);
        setShowModal(false);
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit Sender ID request.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Sender ID Lifecycle & Approval
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authorized alphanumeric headers for A2P delivery via Ethio telecom SMMP routing.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setSuccessMsg(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Submit Sender ID Request</span>
        </button>
      </div>

      {/* Regulatory Process Explainer Callout */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Ethio Telecom SMMP & Regulatory Compliance Policy</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with Ethiopian telecommunications regulations, business partners cannot unilaterally create or self-approve alphanumeric Sender IDs. Every Sender ID must be vetted by SIMConnect SMS compliance officers and registered in the upstream Ethio telecom SMMP portal before dispatch authorization is enabled.
        </p>

        {/* Multi-step pipeline tracker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-blue-600 font-mono font-bold">STEP 01</span>
            <p className="font-bold text-slate-900 mt-0.5">Partner Request</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Submit proposed alphanumeric ID with business license justification</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-blue-600 font-mono font-bold">STEP 02</span>
            <p className="font-bold text-slate-900 mt-0.5">SIMConnect Review</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Internal compliance audit against trademark & spam guidelines</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-blue-600 font-mono font-bold">STEP 03</span>
            <p className="font-bold text-slate-900 mt-0.5">Carrier SMMP Booking</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Ethio telecom upstream registration & shortcode binding</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-mono font-bold">STEP 04</span>
            <p className="font-bold text-emerald-900 mt-0.5">Channel Activated</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Sender ID unlocked for individual and bulk dispatching</p>
          </div>
        </div>
      </div>

      {/* Requests & Statuses Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Sender ID Registration Records</h3>
          <span className="text-xs text-slate-500 font-medium">{senderIdRequests.length} requests registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                <th className="py-3 px-4">Sender ID</th>
                <th className="py-3 px-4">Brand Identity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Ethio Telecom Job Ref</th>
                <th className="py-3 px-4">Review Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {senderIdRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    {req.senderId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-semibold text-slate-900">{req.brandName}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{req.businessPurpose}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {new Date(req.submissionDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 font-semibold">
                    {req.smmpJobRef || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                    {req.rejectionReason ? (
                      <span className="text-rose-700 font-semibold">{req.rejectionReason}</span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">{req.reviewNotes || 'Under standard review protocol.'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">New Sender ID Request</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Alphanumeric Sender ID <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={11}
                  placeholder="e.g. IBEXSTORE (3-11 characters)"
                  value={proposedId}
                  onChange={(e) => setProposedId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono tracking-wider focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 uppercase font-semibold"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Maximum 11 characters. No spaces or special symbols.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Brand / Company Name <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ibex Technologies PLC"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Purpose & Message Samples <span className="text-blue-600">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the nature of messages (e.g. transactional order alerts, OTPs, promotional) and include a typical sample."
                  value={businessPurpose}
                  onChange={(e) => setBusinessPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="leading-relaxed">
                  I certify that Ibex Techno legally owns or represents this brand identity and agrees to comply with Ethio telecom A2P SMS spam policies.
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  {successMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Submit for Compliance Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
