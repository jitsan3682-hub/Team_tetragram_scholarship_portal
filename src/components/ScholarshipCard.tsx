import React, { useState } from 'react';
import { Scholarship, User, EligibilityResult } from '../types';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { evaluateEligibility } from '../utils/ruleEngine';
import { getDeadlineUrgency, formatDaysLeftLabel } from '../utils/dateUtils';
import RuleExplanationModal from './RuleExplanationModal';
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Trash2,
  ShieldCheck,
  Globe,
  Award,
} from 'lucide-react';
import clsx from 'clsx';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  student: User | null;
  precomputedEligibility?: EligibilityResult;
  index?: number;
}

export default function ScholarshipCard({
  scholarship,
  student,
  precomputedEligibility,
  index = 0,
}: ScholarshipCardProps) {
  const { savedScholarshipIds, toggleSaveScholarship, deleteScholarship } = useData();
  const { t } = useLanguage();
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [showDocChecklist, setShowDocChecklist] = useState(false);

  const title = scholarship.title || 'Untitled Scheme';
  const provider = scholarship.provider || 'Scholarship Provider';
  const category = scholarship.category || 'General';
  const amount = scholarship.amount || 'Funding Assistance Available';
  const description = scholarship.description || '';
  const requiredDocs = scholarship.docsNeeded || [];
  const isCustom = scholarship.isCustom || false;

  const saved = savedScholarshipIds.includes(scholarship.id);
  const eligibilityResult = precomputedEligibility || evaluateEligibility(student, scholarship);

  // Deadline urgency tracking
  const daysLeftLabel = formatDaysLeftLabel(scholarship.deadline);

  // Alternating 3-tier card palette from screenshot:
  // Variant 0: Primary Warm Gold (#F6BA33)
  // Variant 1: Soft Buttercream (#FEF6DF)
  // Variant 2: Pure Alabaster White (#FFFFFF)
  const variant = index % 3;

  const containerStyles = [
    // Variant 0: Gold
    'bg-[#F6BA33] dark:bg-[#322610] text-stone-950 dark:text-amber-100 border border-amber-400/40 dark:border-amber-700/40 shadow-xs',
    // Variant 1: Soft Buttercream
    'bg-[#FEF6DF] dark:bg-[#201D19] text-stone-900 dark:text-stone-100 border border-amber-200/70 dark:border-stone-800 shadow-2xs',
    // Variant 2: Pure White
    'bg-white dark:bg-[#1A1815] text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-800 shadow-xs'
  ][variant];

  const providerBadgeStyle = [
    'bg-black/10 text-stone-950 dark:text-amber-200',
    'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40',
    'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
  ][variant];

  const applyButtonStyle = [
    // On gold card: high contrast dark button
    'bg-stone-950 hover:bg-black text-white',
    // On cream card: dark button
    'bg-stone-950 hover:bg-black text-white',
    // On white card: vibrant golden button
    'bg-[#F5B731] hover:bg-amber-500 text-stone-950'
  ][variant];

  const matchedRulesCount = eligibilityResult.criteriaPassed.filter(c => c.satisfied).length;

  return (
    <div className={clsx(
      'rounded-3xl p-6 transition-all flex flex-col justify-between relative overflow-hidden group hover:shadow-lg',
      containerStyles
    )}>
      {/* Top Details */}
      <div className="space-y-3.5">
        {/* Provider Tag & Actions */}
        <div className="flex items-center justify-between gap-2">
          <span className={clsx(
            'text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full truncate max-w-[220px]',
            providerBadgeStyle
          )}>
            {provider}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCustom && (
              <button
                type="button"
                onClick={() => deleteScholarship(scholarship.id)}
                className="p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 transition-colors cursor-pointer"
                title="Delete Administrator Added Scheme"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={clsx(
                'p-1.5 rounded-full transition-all cursor-pointer',
                saved
                  ? 'bg-stone-950 text-[#F5B731] shadow-xs'
                  : 'hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-300'
              )}
              title={saved ? 'Saved for Later (Click to Remove)' : 'Save for Later'}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 fill-[#F5B731]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-snug tracking-tight">
          {title}
        </h3>

        {/* Tag Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3D6] dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300/40 dark:border-amber-800/40">
            ✓ Verified
          </span>

          {scholarship.awardType && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
              {scholarship.awardType}
            </span>
          )}

          {scholarship.academicLevels && scholarship.academicLevels[0] && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
              {scholarship.academicLevels[0]}
            </span>
          )}

          {scholarship.country && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300">
              <Globe className="w-3 h-3" />
              {scholarship.country}
            </span>
          )}
        </div>

        {/* Award Value & Deadline */}
        <div className="pt-2 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-70">Award Value:</span>
            <span className="font-bold text-xs">{amount}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold opacity-70">Application Deadline:</span>
            <span className={clsx(
              'px-2.5 py-0.5 rounded-full text-[11px] font-bold',
              variant === 0
                ? 'bg-white/90 text-stone-950 shadow-2xs'
                : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs'
            )}>
              {scholarship.deadline || 'Ongoing'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-5 mt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsRuleModalOpen(true)}
          className="text-xs font-bold underline hover:opacity-80 transition-opacity text-left cursor-pointer"
        >
          Rule Details ({matchedRulesCount} Matched)
        </button>

        {scholarship.link ? (
          <a
            href={scholarship.link}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer',
              applyButtonStyle
            )}
          >
            <span>Apply Scheme</span>
            <span>→</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setIsRuleModalOpen(true)}
            className={clsx(
              'inline-flex items-center gap-1 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer',
              applyButtonStyle
            )}
          >
            <span>Apply Scheme</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Transparent Deterministic Rule Breakdown Modal */}
      {isRuleModalOpen && (
        <RuleExplanationModal
          onClose={() => setIsRuleModalOpen(false)}
          scholarship={scholarship}
          student={student}
        />
      )}
    </div>
  );
}
