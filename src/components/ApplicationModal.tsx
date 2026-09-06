import React, { useState } from 'react';
import { Scholarship, User } from '../types';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Send, FileCheck, X, Check, AlertCircle } from 'lucide-react';

interface ApplicationModalProps {
  scholarship: Scholarship | null;
  student: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationModal({
  scholarship,
  student,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const { applyForScholarship, documents } = useData();
  const { t } = useLanguage();

  const [sopText, setSopText] = useState(
    'I am writing to express my interest in this scholarship opportunity. As a dedicated student pursuing my academic goals, this financial support will enable me to focus on my coursework, research, and technical project development.'
  );
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    documents.map((d) => d.title).slice(0, 3)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!scholarship) return null;

  const wordCount = sopText.trim() === '' ? 0 : sopText.trim().split(/\s+/).length;

  const toggleDoc = (docTitle: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docTitle) ? prev.filter((d) => d !== docTitle) : [...prev, docTitle]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      applyForScholarship(scholarship.id, sopText, selectedDocs);
      setIsSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200/80 dark:border-stone-800/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header matching Directory Dark Mode */}
        <div className="bg-stone-950 dark:bg-black p-6 text-white relative border-b border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FEF3D6] text-amber-900 border border-amber-300/40 px-3 py-1 rounded-full inline-block">
            Digital ATS Application
          </span>
          <h2 className="text-xl font-bold text-white mt-2 leading-snug">{scholarship.title}</h2>
          <p className="text-xs text-stone-300 mt-1">Provider: {scholarship.provider}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Student Profile Quick Audit in Stone Theme */}
          <div className="bg-[#FAF9F5] dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Applicant Profile Data
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300">
              <div>
                Candidate: <strong className="text-stone-950 dark:text-white">{student?.name || 'Guest User'}</strong>
              </div>
              <div>
                State: <strong className="text-stone-950 dark:text-white">{student?.state || 'Not specified'}</strong>
              </div>
              <div>
                Major: <strong className="text-stone-950 dark:text-white">{student?.major || 'Not specified'}</strong>
              </div>
              <div>
                GPA: <strong className="text-stone-950 dark:text-white">{student?.gpa || 'N/A'}</strong>
              </div>
              <div>
                Category: <strong className="text-stone-950 dark:text-white">{student?.category || 'General'}</strong>
              </div>
              <div>
                Income:{' '}
                <strong className="text-stone-950 dark:text-white">
                  {student?.familyIncome ? `₹${student.familyIncome.toLocaleString('en-IN')}` : 'N/A'}
                </strong>
              </div>
            </div>
          </div>

          {/* Document Locker Attachments */}
          <div>
            <label className="block text-sm font-bold text-stone-950 dark:text-white mb-2 flex items-center justify-between">
              <span>Attach Documents from Locker ({selectedDocs.length} selected)</span>
              <span className="text-xs font-semibold text-[#D97706] dark:text-amber-400">Reusable Verified Vault</span>
            </label>
            <div className="space-y-2">
              {documents.map((doc) => {
                const isSelected = selectedDocs.includes(doc.title);
                return (
                  <button
                    type="button"
                    key={doc.id}
                    onClick={() => toggleDoc(doc.title)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#F5B731] bg-[#FEF4DA] dark:bg-amber-950/40 text-stone-950 dark:text-amber-200 shadow-2xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-[#1E1B18]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-[#D97706] dark:text-amber-400 shrink-0" />
                      <span className="text-xs font-semibold">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FEF3D6] dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold border border-amber-300/40 dark:border-amber-800/40">
                        {doc.status}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#F5B731] border-[#F5B731] text-stone-950' : 'border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Statement of Purpose / SOP */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-stone-950 dark:text-white">
                Statement of Purpose / Justification
              </label>
              <span className="text-xs text-stone-500 dark:text-stone-400">{wordCount} words</span>
            </div>
            <textarea
              rows={4}
              required
              value={sopText}
              onChange={(e) => setSopText(e.target.value)}
              className="w-full p-3.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-[#F5B731] focus:border-transparent outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 leading-relaxed"
              placeholder="Explain why you are an ideal recipient for this grant and how it aligns with your academic goals..."
            />
          </div>

          {/* Confirmation Notice in Warm Buttercream/Amber */}
          <div className="flex items-start gap-2.5 p-3.5 bg-[#FEF6DF] dark:bg-amber-950/30 rounded-xl text-[11px] text-stone-800 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/40">
            <AlertCircle className="w-4 h-4 text-[#D97706] dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              By submitting, your profile details, verified locker documents, and statement are dispatched to the selection committee. You can track this in real-time on your Application Pipeline.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Dispatching Application...' : 'Submit Application Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
