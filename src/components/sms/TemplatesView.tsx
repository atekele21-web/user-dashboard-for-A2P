import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { SmsTemplate } from '../../types';

interface TemplatesViewProps {
  templates: SmsTemplate[];
  onUpdate: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ templates, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SmsTemplate['category']>('Transaction Alert');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Transaction Alert');
    setContent('');
    setShowModal(true);
  };

  const handleOpenEdit = (t: SmsTemplate) => {
    setEditingId(t.id);
    setTitle(t.title);
    setCategory(t.category);
    setContent(t.content);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      StorageService.deleteTemplate(id);
      onUpdate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    StorageService.saveTemplate({
      id: editingId || undefined,
      title: title.trim(),
      category,
      content: content.trim(),
      variables: [],
    });

    onUpdate();
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            SMS Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pre-approved message boilerplates with dynamic variables (e.g. {'{{order_id}}'}, {'{{otp_code}}'}).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <h3 className="text-sm font-bold text-slate-900">{tmpl.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase font-mono font-semibold">
                  {tmpl.category}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-sans leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 whitespace-pre-wrap">
                {tmpl.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              <span>{tmpl.variables.length} variable{tmpl.variables.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(tmpl)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(tmpl.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Template' : 'Create Template'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Order Delivery Alert"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="Transaction Alert">Transaction Alert</option>
                  <option value="OTP/Authentication">OTP/Authentication</option>
                  <option value="Promotional">Promotional</option>
                  <option value="Notification">Notification</option>
                  <option value="Appointment">Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Content (use {'{{variable}}'})
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Dear {{name}}, your receipt #{{code}} is confirmed."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none font-sans"
                />
              </div>

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
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
