import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApplicationStatus } from '../../types';
import {
  FileText,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  FileCheck,
  Award,
  XCircle,
} from 'lucide-react';
import clsx from 'clsx';

export default function Applications() {
  const { user } = useAuth();
  const { applications, withdrawApplication } = useData();
  const { t } = useLanguage();

  const [filterStatus, setFilterStatus] = useState<string>('All');

  const studentApplications = applications.filter((app) => {
    if (user?.role === 'admin') return true;
    return app.studentId === user?.id || app.studentEmail === user?.email;
  });

  const filteredApplications = studentApplications.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  const pipelineStages: ApplicationStatus[] = [
    'Draft',
    'Submitted',
    'Under Review',
    'Shortlisted',
    'Awarded',
  ];

  const statusColors: Record<ApplicationStatus, { bg: string; text: string; icon: any }> = {
    Draft: { bg: 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700', text: 'text-stone-700 dark:text-stone-300', icon: Clock },
    Submitted: { bg: 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700', text: 'text-stone-800 dark:text-stone-200', icon: Clock },
    'Under Review': { bg: 'bg-[#FEF4DA] dark:bg-amber-950/40 border-amber-300/60 dark:border-amber-800/40', text: 'text-amber-900 dark:text-amber-300', icon: Clock },
    Shortlisted: { bg: 'bg-[#FEF4DA] dark:bg-amber-950/50 border-amber-300 dark:border-amber-700', text: 'text-amber-900 dark:text-amber-300 font-bold', icon: Sparkles },
    Awarded: { bg: 'bg-[#FEF3D6] dark:bg-amber-950/60 border-amber-400 dark:border-amber-700', text: 'text-amber-950 dark:text-amber-200 font-extrabold', icon: Award },
    Rejected: { bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800', text: 'text-rose-800 dark:text-rose-300', icon: XCircle },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching Directory Page */}
      <div className="bg-white dark:bg-[#1E1B18] p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
              REAL-TIME SUBMISSION LIFECYCLE &bull; ATS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-white tracking-tight">
            {t.applicationTracker}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Monitor the lifecycle of your scholarship submissions from initial dispatch to committee interview and award disbursement.
          </p>
        </div>

        {/* Pipeline Stage Quick Filters */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 dark:bg-stone-850 p-1.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
          {['All', 'Submitted', 'Under Review', 'Shortlisted', 'Awarded'].map((st) => (
            <button
              type="button"
              key={st}
              onClick={() => setFilterStatus(st)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                filterStatus === st
                  ? 'bg-[#F5B731] text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Kanban Stages Overview in Directory Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {pipelineStages.map((stage, idx) => {
          const count = studentApplications.filter((a) => a.status === stage).length;
          const isActive = filterStatus === stage;
          return (
            <div
              key={stage}
              onClick={() => setFilterStatus(stage)}
              className={clsx(
                'p-4 rounded-2xl border text-center transition-all cursor-pointer hover:shadow-2xs',
                isActive
                  ? 'border-[#F5B731] bg-[#FEF4DA] dark:bg-amber-950/30 text-stone-950 dark:text-amber-200 shadow-2xs'
                  : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#1E1B18] text-stone-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-700/60'
              )}
            >
              <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Step {idx + 1}
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white mt-1">{count}</div>
              <div className="text-xs font-semibold mt-0.5">{stage}</div>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-[#1E1B18] rounded-3xl p-12 text-center border border-stone-200/80 dark:border-stone-800/80 space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF4DA] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-950 dark:text-white">No applications in this category</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Browse the Scholarship Directory to submit direct digital applications to verified scholarships.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const config = statusColors[app.status] || statusColors.Submitted;
            const StatusIcon = config.icon;

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-[#1E1B18] rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-2xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/60 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700">
                        App ID: #{app.id}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Dispatched: {app.dateApplied}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-950 dark:text-white">
                      {app.scholarshipTitle || 'Scholarship Scheme Application'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold',
                        config.bg,
                        config.text
                      )}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress Step Bar in Directory Golden Accent */}
                <div className="pt-2 pb-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5">
                    <span>Application Pipeline Stage</span>
                    <span className="text-stone-900 dark:text-[#F5B731] font-bold">{app.status}</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#F5B731] h-full transition-all duration-500 rounded-full"
                      style={{
                        width:
                          app.status === 'Draft'
                            ? '20%'
                            : app.status === 'Submitted'
                            ? '40%'
                            : app.status === 'Under Review'
                            ? '65%'
                            : app.status === 'Shortlisted'
                            ? '85%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>

                {/* Admin Feedback / Remarks in Stone Box */}
                {app.adminRemarks && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs">
                    <div className="font-bold text-stone-950 dark:text-stone-100 mb-0.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
                      Committee Reviewer Remarks:
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{app.adminRemarks}</p>
                  </div>
                )}

                {/* Score Rubric (if evaluated) */}
                {app.scoreRubric && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200/60 dark:border-stone-800">
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">Academic Merit</span>
                      <strong className="text-stone-900 dark:text-stone-100">{app.scoreRubric.academicScore}/100</strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200/60 dark:border-stone-800">
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">Need / Equity</span>
                      <strong className="text-stone-900 dark:text-stone-100">{app.scoreRubric.needScore}/100</strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200/60 dark:border-stone-800">
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">SOP Quality</span>
                      <strong className="text-stone-900 dark:text-stone-100">{app.scoreRubric.sopScore}/100</strong>
                    </div>
                    <div className="p-2.5 bg-[#FEF4DA] dark:bg-amber-950/40 text-stone-950 dark:text-amber-200 rounded-xl border border-amber-300/60 dark:border-amber-800/40">
                      <span className="text-[10px] text-amber-900 dark:text-amber-300 block font-bold">Weighted Score</span>
                      <strong className="text-stone-950 dark:text-[#F5B731] font-extrabold">{app.scoreRubric.totalScore}%</strong>
                    </div>
                  </div>
                )}

                {/* Attached Docs */}
                {app.attachedDocs && app.attachedDocs.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-stone-800 dark:text-stone-200">Attached Locker Documents:</span>
                    {app.attachedDocs.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 text-[11px] font-semibold"
                      >
                        <FileCheck className="w-3 h-3 text-[#D97706] dark:text-amber-400" />
                        {doc}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Action: Withdraw */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    Candidate: {app.studentName} ({app.studentEmail})
                  </span>
                  {app.status === 'Submitted' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to withdraw this application?')) {
                          withdrawApplication(app.id);
                        }
                      }}
                      className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold hover:underline cursor-pointer transition-colors"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
