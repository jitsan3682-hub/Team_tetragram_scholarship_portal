import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  X,
  Trash2,
  Calendar,
  Link as LinkIcon,
  FileText,
  Info,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { INDIAN_STATES, MAJORS_LIST, CATEGORIES, FIELD_OF_STUDY_CATEGORIES } from '../data/constants';
import { Scholarship } from '../types';
import clsx from 'clsx';

interface AdminPanelProps {
  customScholarships: Scholarship[];
  onAddScholarship: (scholarship: Scholarship) => void;
  onDeleteScholarship: (id: string) => void;
}

interface FormState {
  title: string;
  provider: string;
  category: string;
  amount: string;
  deadline: string;
  original_link: string;
  description: string;
  required_docs: string;
  min_gpa: string;
  max_income: string;
  eligible_states: string[];
  allowed_majors: string[];
}

const EMPTY_FORM: FormState = {
  title: '',
  provider: '',
  category: 'Private',
  amount: '',
  deadline: '',
  original_link: '',
  description: '',
  required_docs: '',
  min_gpa: '',
  max_income: '',
  eligible_states: ['All'],
  allowed_majors: ['All'],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminPanel({
  customScholarships,
  onAddScholarship,
  onDeleteScholarship,
}: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMultiValue = (field: 'eligible_states' | 'allowed_majors', value: string) => {
    setForm((prev) => {
      const current = prev[field];
      // "All" is an exclusive shortcut — selecting any specific value clears it.
      if (value === 'All') {
        return { ...prev, [field]: ['All'] };
      }
      const withoutAll = current.filter((v) => v !== 'All');
      const exists = withoutAll.includes(value);
      const next = exists ? withoutAll.filter((v) => v !== value) : [...withoutAll, value];
      return { ...prev, [field]: next.length > 0 ? next : ['All'] };
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.provider.trim() || !form.deadline || !form.original_link.trim()) {
      setError(
        'Title, Provider, Deadline and Original Notice Link are required — these are what students rely on to verify a scheme is genuine.'
      );
      return;
    }

    const docs = form.required_docs
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const minGpaNum = form.min_gpa === '' ? 0 : parseFloat(form.min_gpa);
    const maxIncNum = form.max_income === '' ? 999999999 : parseFloat(form.max_income);

    const newScholarship: Scholarship = {
      id: `custom-${slugify(form.title)}-${Date.now()}`,
      title: form.title.trim(),
      provider: form.provider.trim(),
      category: form.category,
      amount: form.amount.trim() || 'Amount not specified',
      deadline: form.deadline,
      link: form.original_link.trim(),
      description: form.description.trim() || 'No additional description provided by the administrator.',
      docsNeeded: docs.length > 0 ? docs : ['Identity Proof', 'Academic Transcript'],
      status: 'Ongoing',
      awardType: 'Merit Award',
      academicLevels: ['Undergraduate', 'Postgraduate'],
      awardBreakdown: {
        tuition: 'Direct Financial Grant',
        accommodation: false,
        travel: false,
        booksOrStipend: form.amount.trim() || 'Direct Financial Grant',
      },
      isVerified: true,
      isCustom: true,
      eligibility: {
        minGpa: minGpaNum,
        maxIncome: maxIncNum,
        states: form.eligible_states,
        majors: form.allowed_majors,
        categories: ['All'],
        genders: ['All'],
      },
      // Dual-compatibility properties for reference code consumers
      ...({
        original_link: form.original_link.trim(),
        required_docs: docs.length > 0 ? docs : ['Identity Proof', 'Academic Transcript'],
        criteria: {
          min_gpa: minGpaNum === 0 ? null : minGpaNum,
          max_income: maxIncNum >= 999999999 ? null : maxIncNum,
          eligible_states: form.eligible_states,
          allowed_majors: form.allowed_majors,
        },
      } as any),
    };

    onAddScholarship(newScholarship);
    resetForm();
    setShowForm(false);
    setSuccessMessage(`Successfully published "${newScholarship.title}"!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-teal-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Administrator Scheme Console</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Deterministic Policy Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Add a scholarship with visible eligibility rules. Every field you enter here becomes a deterministic rule
              the engine checks against student profiles with zero hidden scoring.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setError('');
          }}
          className={clsx(
            'px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0',
            showForm
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              : 'bg-[#0D9488] hover:bg-teal-700 text-white shadow-md'
          )}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add New Scholarship
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Publish Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Scholarship Title *
              </label>
              <input
                type="text"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.title}
                onChange={(e) => handleField('title', e.target.value)}
                placeholder="e.g. Foundation Merit-Cum-Means Scholarship"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Provider / Issuing Body *
              </label>
              <input
                type="text"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.provider}
                onChange={(e) => handleField('provider', e.target.value)}
                placeholder="e.g. Tata Trusts / MSJE"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.category}
                onChange={(e) => handleField('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Award Amount
              </label>
              <input
                type="text"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.amount}
                onChange={(e) => handleField('amount', e.target.value)}
                placeholder="e.g. ₹50,000 / year"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Application Deadline *</span>
              </label>
              <input
                type="date"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.deadline}
                onChange={(e) => handleField('deadline', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Original Notice Link *</span>
              </label>
              <input
                type="url"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                value={form.original_link}
                onChange={(e) => handleField('original_link', e.target.value)}
                placeholder="https://official-source.gov.in/notice"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              rows={2}
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="Short summary a student will see on their feed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Required Documents (comma-separated)</span>
            </label>
            <input
              type="text"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
              value={form.required_docs}
              onChange={(e) => handleField('required_docs', e.target.value)}
              placeholder="Aadhaar Card, Income Certificate, Class 12 Marksheet, Domicile Certificate"
            />
          </div>

          {/* Eligibility Rules Block */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Deterministic Eligibility Rules
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Every criterion selected below directly powers the transparent rule explanation breakdown.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Minimum GPA / CGPA (optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  value={form.min_gpa}
                  onChange={(e) => handleField('min_gpa', e.target.value)}
                  placeholder="e.g. 3.0 (leave blank for no minimum)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Maximum Family Income ₹ (optional)
                </label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  value={form.max_income}
                  onChange={(e) => handleField('max_income', e.target.value)}
                  placeholder="e.g. 500000 (leave blank for no limit)"
                />
              </div>
            </div>

            {/* Clickable Multi-Select State Tags */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Eligible States of Domicile (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleMultiValue('eligible_states', 'All')}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    form.eligible_states.includes('All')
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  All States (Pan-India)
                </button>
                {INDIAN_STATES.map((st) => {
                  const isSelected = form.eligible_states.includes(st);
                  return (
                    <button
                      type="button"
                      key={st}
                      onClick={() => toggleMultiValue('eligible_states', st)}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs transition-all',
                        isSelected
                          ? 'bg-[#0D9488] text-white font-bold shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clickable Multi-Select Majors Tags Grouped by Standard Field of Study Clusters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Allowed Fields of Study & Majors (Click to toggle)
                </label>
                <button
                  type="button"
                  onClick={() => toggleMultiValue('allowed_majors', 'All')}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    form.allowed_majors.includes('All')
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  All Disciplines
                </button>
              </div>

              <div className="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-[340px] overflow-y-auto">
                {FIELD_OF_STUDY_CATEGORIES.map((group) => {
                  const allGroupSelected = group.options.every((opt) => form.allowed_majors.includes(opt));
                  return (
                    <div key={group.category} className="space-y-1.5 pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {group.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const allInGroup = group.options;
                            if (allGroupSelected) {
                              setForm((prev) => ({
                                ...prev,
                                allowed_majors: prev.allowed_majors.filter((m) => !allInGroup.includes(m)),
                              }));
                            } else {
                              setForm((prev) => ({
                                ...prev,
                                allowed_majors: Array.from(
                                  new Set([...prev.allowed_majors.filter((m) => m !== 'All'), ...allInGroup])
                                ),
                              }));
                            }
                          }}
                          className="text-[11px] text-teal-700 hover:underline font-semibold"
                        >
                          {allGroupSelected ? 'Deselect cluster' : 'Select entire cluster'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.options.map((m) => {
                          const isSelected = form.allowed_majors.includes(m);
                          return (
                            <button
                              type="button"
                              key={m}
                              onClick={() => toggleMultiValue('allowed_majors', m)}
                              className={clsx(
                                'px-2.5 py-1 rounded-lg text-xs transition-all',
                                isSelected
                                  ? 'bg-[#0D9488] text-white font-bold shadow-xs'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              )}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D9488] hover:bg-teal-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Scholarship</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Custom Added Scholarships */}
      {customScholarships.length > 0 && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Administrator-Added Scholarships</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold">
                {customScholarships.length}
              </span>
            </h4>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {customScholarships.map((s) => (
              <div
                key={s.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{s.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                      {s.category || 'Custom'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{s.provider}</span>
                    <span>•</span>
                    <span>Deadline: {s.deadline}</span>
                    <span>•</span>
                    <strong className="text-teal-700">
                      {typeof s.amount === 'number' ? `₹${s.amount.toLocaleString('en-IN')}` : s.amount}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteScholarship(s.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                  title="Remove this scholarship listing"
                  aria-label={`Delete ${s.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
