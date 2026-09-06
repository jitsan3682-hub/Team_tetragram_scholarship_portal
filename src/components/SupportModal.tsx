import React, { useState } from 'react';
import { X, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Eligibility Rules');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = Math.floor(1000 + Math.random() * 9000).toString();
    setTicketId(generatedId);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSubject('');
      setMessage('');
      setTicketId('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200/80 dark:border-stone-800/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header in Directory Dark Style */}
        <div className="bg-stone-950 dark:bg-black p-6 text-white relative border-b border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FEF3D6] text-amber-900 border border-amber-300/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
              Student Helpdesk
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Raise an Inquiry or Support Ticket</h2>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-[#FEF4DA] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-stone-950 dark:text-white text-base">Ticket Dispatched!</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Ticket #TK-{ticketId || '8492'} created. A grievance officer will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Issue Topic
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5B731]"
                >
                  <option value="Eligibility Rules">Eligibility Rule Discrepancy</option>
                  <option value="Document Verification">Document Locker / PRC Upload Issue</option>
                  <option value="Application Tracking">Application Pipeline Status</option>
                  <option value="Disbursement Status">Stipend / Direct Bank Transfer</option>
                  <option value="Other">General Technical Help</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Clarification on Ishan Uday income threshold"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5B731]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or difficulty..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5B731]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#F5B731] hover:bg-amber-500 text-stone-950 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Ticket
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
