import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SupportModal from '../components/SupportModal';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  Award,
  FileEdit,
  UserCheck,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

export default function Resources() {
  const { t } = useLanguage();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const guides = [
    {
      id: 'g1',
      title: 'How to Write a Winning Statement of Purpose (SOP)',
      category: 'Essays & Statements',
      readTime: '5 min read',
      icon: FileEdit,
      description:
        'Proven structures for communicating financial need, academic passion, and community vision to university scholarship committees.',
      tips: [
        'Hook the reader with a concrete experience rather than generic quotes.',
        'Address your financial reality with transparency and dignity.',
        'Quantify achievements (e.g. ranked top 5%, built an app used by 500+ peers).',
        'Demonstrate how you intend to give back to the region upon graduation.',
      ],
    },
    {
      id: 'g2',
      title: 'Acing Scholarship Committee Interviews',
      category: 'Interview Panels',
      readTime: '7 min read',
      icon: Award,
      description:
        'Tactics for answering behavioral questions, explaining career objectives, and making a lasting impression on panel evaluators.',
      tips: [
        'Review the foundation’s mission statement and core philanthropic goals.',
        'Be ready to explain how grant funds will be allocated across semesters.',
        'Prepare 2-3 thoughtful questions about mentorship or alumni networks.',
        'Practice concise 90-second summaries of your technical projects.',
      ],
    },
    {
      id: 'g3',
      title: 'Securing Strong Letters of Recommendation (LOR)',
      category: 'Faculty Endorsements',
      readTime: '4 min read',
      icon: UserCheck,
      description:
        'The right way to approach professors, provide comprehensive brag sheets, and ensure timely submissions before cut-offs.',
      tips: [
        'Reach out at least 3-4 weeks before the deadline.',
        'Provide your professors with your updated CV and course assignment scores.',
        'Send gentle calendar reminders 7 days and 2 days prior to closure.',
        'Follow up with a sincere thank-you email once received.',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How is my eligibility calculated on this portal?',
      answer:
        'Eligibility is computed deterministically by comparing your verified profile attributes (such as GPA, annual family income, state of domicile, and study major) against explicit official rules set by scholarship providers. No black-box or hidden AI score is used.',
    },
    {
      question: 'Does this portal guarantee official scholarship approval?',
      answer:
        'No. As per the official guidelines, the portal calculates rule matching and dispatches applications directly to selection committees. Final award disbursements and sanctions rest exclusively with the respective ministry, university, or charitable trust.',
    },
    {
      question: 'How does the "Save for Later" bookmarking feature work?',
      answer:
        'Clicking the bookmark icon immediately saves any opportunity to your local browser storage. It persists across reloads, allowing you to audit closing deadlines and manage your shortlist even without maintaining active internet connectivity.',
    },
    {
      question: 'Can I reuse documents across different scholarship schemes?',
      answer:
        'Yes! The built-in Document Locker securely stores your verified certificates (PRC, Income Certificate, Marksheets). When applying, simply select the required credentials from your locker with a single click.',
    },
    {
      question: 'What if my state domicile or category certificate is pending renewal?',
      answer:
        'You can indicate "Pending" in your Document Locker. Schemes that allow provisional consideration will display as "Possibly Eligible" with clear guidance on required renewal paperwork.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner matching Directory Page */}
      <div className="bg-white dark:bg-[#1E1B18] p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
              GUIDANCE &amp; KNOWLEDGE BASE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-white tracking-tight">
            {t.resourceCenter}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Essential guides, writing frameworks, and answers to help you navigate grant opportunities and assemble flawless applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSupportModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* Guides Section in Directory Card Style */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
            Scholarship Strategy Playbooks
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Step-by-step masterclasses curated by academic advisors and successful awardees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-2xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF4DA] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200/60 dark:border-stone-700">
                      {g.readTime}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] dark:text-amber-400">
                    {g.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-950 dark:text-white mt-1">{g.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">{g.description}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5 text-xs">
                    <span className="font-bold text-[11px] text-stone-900 dark:text-stone-200 block">Key Takeaways:</span>
                    <ul className="space-y-1 text-[11px] list-disc list-inside text-stone-600 dark:text-stone-400">
                      {g.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Opening full playbook for "${g.title}"`)}
                  className="w-full pt-3 text-xs font-bold text-stone-900 dark:text-[#F5B731] hover:text-[#D97706] dark:hover:text-amber-300 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 cursor-pointer"
                >
                  <span>Read Full Playbook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ & Knowledge Base Section */}
      <div className="bg-white dark:bg-[#1E1B18] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Clear answers on transparent rules, documents, and application lifecycles.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#F5B731]"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200/80 dark:border-stone-800/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-white dark:bg-[#1E1B18] hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{faq.question}</span>
                  <ChevronDown
                    className={clsx(
                      'w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[#D97706] dark:text-amber-400'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 bg-[#FAF9F5] dark:bg-stone-900/50 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-100 dark:border-stone-800 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Ticket Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
