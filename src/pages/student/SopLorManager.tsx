import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileEdit,
  Mail,
  UserCheck,
  Send,
  Save,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function SopLorManager() {
  const { lorRequests, requestLor } = useData();
  const { t } = useLanguage();

  // SOP Draft State
  const [sopTitle, setSopTitle] = useState('Standard Master SOP - Technical & Research Grants');
  const [sopContent, setSopContent] = useState(
    `Respected Selection Committee,\n\nI am writing to express my strong commitment to pursuing higher education and technical excellence in Computer Science and Engineering. Growing up in the North Eastern Region of India, I have observed first-hand both the challenges and tremendous opportunities in leveraging computing to address regional development.\n\nThroughout my academic journey, I have maintained high academic standing (GPA 3.4+) while actively engaging in algorithmic problem solving, collegiate coding contests, and open-source contributions. However, the recurring financial demands of higher tuition, research lab expenses, and educational equipment present significant hurdles.\n\nSecuring this scholarship will provide pivotal financial stability, allowing me to dedicate my complete attention towards innovative engineering research and community mentorship. I thank you sincerely for reviewing my candidacy.`
  );
  const [isSavedSop, setIsSavedSop] = useState(false);

  // LOR Request Modal State
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profOrg, setProfOrg] = useState('');
  const [lorNotes, setLorNotes] = useState('');

  const wordCount = sopContent.trim() === '' ? 0 : sopContent.trim().split(/\s+/).length;

  const handleSaveSop = () => {
    setIsSavedSop(true);
    setTimeout(() => setIsSavedSop(false), 2500);
  };

  const handleRequestLor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail) return;

    requestLor({
      professorName: profName,
      professorEmail: profEmail,
      organization: profOrg || 'University Department',
      notes: lorNotes,
    });

    setProfName('');
    setProfEmail('');
    setProfOrg('');
    setLorNotes('');
    setIsLorModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1B18] p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 rounded-lg">
              <FileEdit className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-amber-400">
              Application Assets
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-950 dark:text-white">{t.sopLorManager}</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Craft high-impact Statements of Purpose (SOP) and request/track Letters of Recommendation from your professors.
          </p>
        </div>

        <button
          onClick={() => setIsLorModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs font-bold shadow-xs transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Request New LOR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOP Editor Column */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E1B18] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                Statement of Purpose (SOP) Studio
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Saved drafts are automatically selectable in your application forms.
              </p>
            </div>
            <button
              onClick={handleSaveSop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FEF4DA] hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300/60 dark:border-amber-800/50 transition-colors"
            >
              {isSavedSop ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Draft Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Draft Title / Preset
            </label>
            <input
              type="text"
              value={sopTitle}
              onChange={(e) => setSopTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-stone-950 dark:text-white outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Statement Content
              </label>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                {wordCount} words (Ideal: 300 - 600 words)
              </span>
            </div>
            <textarea
              rows={14}
              value={sopContent}
              onChange={(e) => setSopContent(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-2xl text-xs text-stone-900 dark:text-stone-100 leading-relaxed outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>
        </div>

        {/* LOR Tracker Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#1E1B18] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-stone-950 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                  Letters of Recommendation (LOR)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Track confidential professor recommendations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {lorRequests.map((lor) => (
                <div
                  key={lor.id}
                  className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-gray-50/70 hover:bg-white hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 dark:text-white">{lor.professorName}</h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">{lor.organization}</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{lor.professorEmail}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        lor.status === 'Received'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {lor.status}
                    </span>
                  </div>

                  {lor.notes && (
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 bg-white p-2 rounded-xl border border-stone-100 dark:border-stone-800 italic">
                      "{lor.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500 pt-1">
                    <span>Requested: {lor.requestedDate}</span>
                    {lor.status === 'Pending' && (
                      <button
                        onClick={() => alert(`Gentle email reminder dispatched to ${lor.professorEmail}`)}
                        className="text-[#D97706] dark:text-amber-400 font-bold hover:underline"
                      >
                        Send Nudge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOP Writing Guide Tips Box */}
          <div className="bg-[#FEF6DF] dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-900/40 rounded-3xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              SOP Writing Best Practices
            </h4>
            <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 list-disc list-inside">
              <li>Open with a clear motivation tied to regional or academic challenges.</li>
              <li>Quantify academic and extracurricular achievements with metrics.</li>
              <li>Explain transparent financial need without ambiguity.</li>
              <li>Keep sentences active and concise for committee reviewers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* LOR Request Modal */}
      {isLorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-100 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-stone-950 dark:bg-black p-6 text-white relative border-b border-stone-800">
              <button
                onClick={() => setIsLorModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Request LOR from Faculty</h2>
              <p className="text-xs text-stone-400 mt-1">An invitation will be delivered to their institutional inbox</p>
            </div>

            <form onSubmit={handleRequestLor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Professor / Mentor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  placeholder="e.g. Dr. Mukul Chandra Das"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  placeholder="e.g. mdas@tezu.ernet.in"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Department / Institution
                </label>
                <input
                  type="text"
                  value={profOrg}
                  onChange={(e) => setProfOrg(e.target.value)}
                  placeholder="e.g. Department of CSE, Tezpur University"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Personal Note to Faculty
                </label>
                <textarea
                  rows={3}
                  value={lorNotes}
                  onChange={(e) => setLorNotes(e.target.value)}
                  placeholder="Mention the scholarship scheme name and upcoming deadline..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
