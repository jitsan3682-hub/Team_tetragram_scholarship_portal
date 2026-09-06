import React from 'react';
import { Scholarship, User } from '../types';
import { evaluateEligibility } from '../utils/ruleEngine';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, ShieldCheck, X } from 'lucide-react';
import clsx from 'clsx';

interface RuleExplanationModalProps {
  scholarship: Scholarship | null;
  student: User | null;
  onClose: () => void;
  onApply?: (scholarship: Scholarship) => void;
}

export default function RuleExplanationModal({
  scholarship,
  student,
  onClose,
  onApply,
}: RuleExplanationModalProps) {
  const { t } = useLanguage();

  if (!scholarship) return null;

  const result = evaluateEligibility(student, scholarship);

  const statusBadge = {
    Eligible: {
      bg: 'bg-[#FEF3D6] dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800/60',
      icon: CheckCircle2,
      label: t.eligible,
    },
    'Possibly Eligible': {
      bg: 'bg-[#FEF4DA] dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 border-amber-300/60 dark:border-amber-800/60',
      icon: AlertCircle,
      label: t.possiblyEligible,
    },
    'Not Eligible': {
      bg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 border-rose-200 dark:border-rose-800/60',
      icon: XCircle,
      label: t.notEligible,
    },
  }[result.status];

  const StatusIcon = statusBadge.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200/80 dark:border-stone-800/80 animate-in fade-in zoom-in-95 duration-200">
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
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FEF3D6] text-amber-900 border border-amber-300/40 px-3 py-1 rounded-full">
              {scholarship.provider}
            </span>
            {scholarship.isVerified && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-full border border-amber-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B731]" />
                {t.verifiedSource}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {scholarship.title}
          </h2>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Result Banner in Warm Directory Style */}
          <div className={clsx('p-4 rounded-2xl border flex items-start gap-3', statusBadge.bg)}>
            <StatusIcon className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{statusBadge.label}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-stone-900 dark:text-stone-200 border border-black/5 dark:border-white/10">
                  Deterministic Rule Match
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-amber-600 dark:text-amber-400">&bull;</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rule Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              {t.ruleCheckTitle}
            </h4>
            <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
              {result.criteriaPassed.map((crit, idx) => (
                <div key={idx} className="p-4 flex items-start justify-between gap-4 bg-white dark:bg-[#1E1B18] hover:bg-stone-50/70 dark:hover:bg-stone-850/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {crit.satisfied ? (
                        <CheckCircle2 className="w-4 h-4 text-[#D97706] dark:text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                      )}
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{crit.rule}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 pl-6">{crit.message}</p>
                    <div className="pl-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 pt-1">
                      <span>
                        Required: <strong className="text-stone-800 dark:text-stone-200">{String(crit.requiredValue)}</strong>
                      </span>
                      <span>
                        Your Profile: <strong className={crit.satisfied ? 'text-amber-900 dark:text-amber-300 font-bold' : 'text-rose-600 dark:text-rose-400'}>
                          {String(crit.userValue)}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'text-xs font-bold px-2.5 py-1 rounded-full shrink-0',
                      crit.satisfied ? 'bg-[#FEF3D6] dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    )}
                  >
                    {crit.satisfied ? 'Passed' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Award Breakdown & Documents in Stone Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800">
              <h5 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Award Breakdown
              </h5>
              <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                <p>
                  <strong>Amount:</strong> {scholarship.amount}
                </p>
                {scholarship.awardBreakdown.tuition && (
                  <p>
                    <strong>Tuition:</strong> {String(scholarship.awardBreakdown.tuition)}
                  </p>
                )}
                {scholarship.awardBreakdown.booksOrStipend && (
                  <p>
                    <strong>Books / Stipend:</strong> {String(scholarship.awardBreakdown.booksOrStipend)}
                  </p>
                )}
                {scholarship.awardBreakdown.accommodation && (
                  <p>
                    <strong>Hostel:</strong> {String(scholarship.awardBreakdown.accommodation)}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800">
              <h5 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                {t.requiredDocuments}
              </h5>
              <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 list-disc list-inside">
                {scholarship.docsNeeded.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Verification Link & Disclaimer in Warm Buttercream/Amber */}
          <div className="bg-[#FEF6DF] dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-900/40 p-4 rounded-2xl text-xs text-stone-900 dark:text-amber-200 space-y-2">
            <p className="font-bold text-stone-950 dark:text-amber-300">{t.disclaimer}</p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={scholarship.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-950 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 font-bold underline"
              >
                <span>{t.officialNotice}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50/70 dark:bg-stone-900/90 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          {onApply && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(scholarship);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {t.applyNow}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
