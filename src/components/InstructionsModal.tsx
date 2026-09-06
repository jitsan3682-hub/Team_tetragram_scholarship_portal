import React, { useState } from 'react';
import { X, BookmarkCheck, BookOpen, ShieldCheck, Terminal, CheckCircle2 } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  const [activeTab, setActiveTab] = useState<'hackathon' | 'student' | 'admin' | 'dev'>('hackathon');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-stone-200/80 dark:border-stone-800/80 animate-in fade-in zoom-in-95 duration-200">
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
              TEZHACK 2026 Manual
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FEF4DA] text-amber-950 border border-amber-300/40 px-3 py-1 rounded-full">
              WEB02 + WEB-004(2)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">System Documentation &amp; Judge Guide</h2>
          <p className="text-xs text-stone-300 mt-1">
            Standard operating instructions for Judges, Students, Providers, and Developers.
          </p>

          {/* Navigation Tabs in Directory Palette */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { id: 'hackathon', label: 'Save for Later Twist (Judges)', icon: BookmarkCheck },
              { id: 'student', label: 'Student User Guide', icon: BookOpen },
              { id: 'admin', label: 'Admin & Provider Guide', icon: ShieldCheck },
              { id: 'dev', label: 'Developer Setup', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F5B731] text-stone-950 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-stone-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
          {activeTab === 'hackathon' && (
            <div className="space-y-4">
              <div className="bg-[#FEF6DF] dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-800/40 p-5 rounded-2xl">
                <h3 className="font-bold text-stone-950 dark:text-amber-300 text-base flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                  Judging Verification: &ldquo;SAVE FOR LATER&rdquo; [WEB-004(2)]
                </h3>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                  Challenge requirement: <em>&ldquo;Save two records, remove one, and reload the saved list.&rdquo;</em>
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200/80 dark:border-stone-800">
                  <div className="w-6 h-6 rounded-full bg-[#F5B731] text-stone-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-xs">Step 1: Discovery &amp; Tagging</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      On the <strong>Directory</strong> page, click the bookmark icon on any two scholarship cards. A toast confirms instant persistence in local storage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200/80 dark:border-stone-800">
                  <div className="w-6 h-6 rounded-full bg-[#F5B731] text-stone-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-xs">Step 2: Saved List Dashboard</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      Navigate to <strong>Saved Schemes</strong> (via the sidebar or navbar badge). Both items render cleanly with closing deadlines and rule eligibility tags.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200/80 dark:border-stone-800">
                  <div className="w-6 h-6 rounded-full bg-[#F5B731] text-stone-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-xs">Step 3: Remove One &amp; Reload Test</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      Click the trash icon to remove one scheme. Then click <strong>&ldquo;Reload Page (Test Persistence)&rdquo;</strong>. Only the remaining record persists!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'student' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-950 dark:text-white text-base">Student User Workflow</h3>
              <div className="space-y-3">
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">1. Real-Time Profile Setup</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Enter your State of Domicile, Degree Major, Family Annual Income, and GPA. The deterministic matching engine evaluates all 560+ schemes in 2 milliseconds.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">2. Document Locker Vault</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Upload official marksheets and PRC records or sync verified records with DigiLocker. You can generate single and combined verified PDF summaries anytime.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">3. Direct ATS Submissions</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Click &ldquo;Apply Now&rdquo; to draft a Statement of Purpose and select documents. Monitor application progress in real time across Kanban stages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-950 dark:text-white text-base">Admin &amp; Scholarship Provider Workflow</h3>
              <div className="space-y-3">
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">1. Role Switching</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Click the &ldquo;Switch to Admin Mode&rdquo; toggle in the top navbar. You will immediately access the administrator management console.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">2. Add Custom Schemes</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Define new scholarship criteria with targeted domiciles, degree requirements, income caps, and grant allocations. Schemes instantly appear on student feeds.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">3. Applicant Queue Evaluation</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Review candidate submissions, inspect attached certificates, score rubrics, and update application status from Under Review to Awarded or Shortlisted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dev' && (
            <div className="space-y-3">
              <h3 className="font-bold text-stone-950 dark:text-white text-base">Developer &amp; Setup Documentation</h3>
              <div className="bg-stone-900 text-stone-200 p-4 rounded-xl text-xs space-y-1 border border-stone-800">
                <p className="text-[#F5B731]"># 1. Install dependencies</p>
                <p>npm install</p>
                <p className="text-[#F5B731] pt-2"># 2. Run local development server (Vite)</p>
                <p>npm run dev</p>
                <p className="text-[#F5B731] pt-2"># 3. Build for production</p>
                <p>npm run build</p>
                <p className="text-[#F5B731] pt-2"># 4. Run automated test suite</p>
                <p>npx tsx scratch/run_full_verification.ts</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50/70 dark:bg-stone-900/90 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
