import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Scholarship, Application, AcademicLevel, AwardType, ALL_INDIAN_STATES } from '../../types';
import AdminPanel from '../../components/AdminPanel';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  FileCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart3,
  X,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
  const {
    scholarships,
    applications,
    addScholarship,
    deleteScholarship,
    updateApplicationStatus,
  } = useData();

  const customScholarships = scholarships.filter((s) => s.isCustom || s.id.startsWith('custom-'));

  const [activeTab, setActiveTab] = useState<'listings' | 'applicants' | 'analytics'>('applicants');

  // New Scholarship Modal
  const [isAddSchModalOpen, setIsAddSchModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newAmount, setNewAmount] = useState('₹50,000 / year');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newMinGpa, setNewMinGpa] = useState(3.0);
  const [newMaxIncome, setNewMaxIncome] = useState(500000);
  const [newState, setNewState] = useState('All');
  const [newMajor, setNewMajor] = useState('All');
  const [newGender, setNewGender] = useState('All');
  const [newDocs, setNewDocs] = useState('Income Certificate, Marksheet, Domicile');
  const [newLink, setNewLink] = useState('https://scholarships.gov.in');

  // Review Application Modal
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);
  const [reviewStatus, setReviewStatus] = useState<Application['status']>('Under Review');
  const [reviewRemarks, setReviewRemarks] = useState('');

  const handleCreateScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    addScholarship({
      title: newTitle,
      provider: newProvider,
      status: 'Ongoing',
      deadline: newDeadline,
      amount: newAmount,
      awardType: 'Merit Award',
      academicLevels: ['Undergraduate'],
      description: `Official scholarship scheme administered by ${newProvider}.`,
      eligibility: {
        minGpa: Number(newMinGpa),
        maxIncome: Number(newMaxIncome),
        states: newState === 'All' ? ['All'] : [newState],
        majors: newMajor === 'All' ? ['All'] : [newMajor],
        genders: newGender === 'All' ? ['All'] : [newGender],
      },
      awardBreakdown: {
        tuition: 'Tuition reimbursement',
        accommodation: false,
        travel: false,
        booksOrStipend: newAmount,
      },
      docsNeeded: newDocs.split(',').map((d) => d.trim()),
      link: newLink,
      isVerified: true,
    });

    setIsAddSchModalOpen(false);
    setNewTitle('');
    setNewProvider('');
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;

    updateApplicationStatus(reviewingApp.id, reviewStatus, reviewRemarks);
    setReviewingApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Provider & Committee Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Scholarship Administrator Portal</h1>
          <p className="text-xs text-gray-600 mt-1">
            Publish criteria-based schemes, review candidate dossiers, and manage final award disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSchModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Scheme</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('applicants')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'applicants'
              ? 'bg-[#0D9488] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Candidate Dossier Review ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'listings'
              ? 'bg-[#0D9488] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Active Scheme Listings ({scholarships.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'analytics'
              ? 'bg-[#0D9488] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Analytics & Demographics
        </button>
      </div>

      {/* TAB 1: Applicants Review Workflow */}
      {activeTab === 'applicants' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Applicant Submissions Queue</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review applicant Statement of Purpose, score rubrics, and transition statuses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 uppercase text-[10px] tracking-wider text-gray-400 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4">App ID</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Scholarship Scheme</th>
                  <th className="p-4">Dispatched Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 font-bold text-gray-900">#{app.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{app.studentName}</div>
                      <div className="text-[11px] text-gray-400">{app.studentEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800 max-w-xs truncate">
                      {app.scholarshipTitle || 'Direct Portal Application'}
                    </td>
                    <td className="p-4 text-gray-500">{app.dateApplied}</td>
                    <td className="p-4">
                      <span
                        className={clsx(
                          'text-[10px] font-bold px-2.5 py-1 rounded-full border',
                          app.status === 'Shortlisted'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : app.status === 'Awarded'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        )}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setReviewingApp(app);
                          setReviewStatus(app.status);
                          setReviewRemarks(app.adminRemarks || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 font-bold transition-colors"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Listings Management */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <AdminPanel
            customScholarships={customScholarships}
            onAddScholarship={addScholarship}
            onDeleteScholarship={deleteScholarship}
          />

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">All Published Scholarship Opportunities</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage eligibility rules and verified source documentation links across all {scholarships.length} schemes.
                </p>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map((sch) => (
              <div
                key={sch.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      {sch.provider}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{sch.title}</h3>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${sch.title}?`)) deleteScholarship(sch.id);
                    }}
                    className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                    title="Delete Scheme"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-gray-100">
                  <div>
                    Min GPA: <strong>{sch.eligibility.minGpa}</strong>
                  </div>
                  <div>
                    Income Cap: <strong>₹{sch.eligibility.maxIncome.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    States: <strong>{sch.eligibility.states.join(', ')}</strong>
                  </div>
                  <div>
                    Deadline: <strong>{sch.deadline}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-extrabold text-teal-800">{sch.amount}</span>
                  <a
                    href={sch.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-semibold"
                  >
                    <span>Original Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* TAB 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total Published Schemes
              </span>
              <div className="text-3xl font-black text-gray-900">{scholarships.length}</div>
              <p className="text-[11px] text-teal-600 font-medium">100% Deterministic Rules Active</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total Candidate Applications
              </span>
              <div className="text-3xl font-black text-gray-900">{applications.length}</div>
              <p className="text-[11px] text-teal-600 font-medium">Digital ATS Submissions</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Estimated Total Disbursement
              </span>
              <div className="text-3xl font-black text-gray-900">₹42.8 Lakhs</div>
              <p className="text-[11px] text-emerald-600 font-medium">Allocated for 2026-27</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Applicant Regional Distribution</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Assam & North East Domiciles</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0D9488] h-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Other Indian States</span>
                  <span>22%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-300 h-full" style={{ width: '22%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluate Applicant Modal */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#0D9488] to-teal-800 p-6 text-white relative">
              <button
                onClick={() => setReviewingApp(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Evaluate Candidate #{reviewingApp.id}</h2>
              <p className="text-xs text-teal-100 mt-1">{reviewingApp.studentName} ({reviewingApp.studentEmail})</p>
            </div>

            <form onSubmit={handleUpdateReview} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <span className="font-bold text-gray-700 uppercase tracking-wider block">
                  Candidate Statement of Purpose:
                </span>
                <p className="text-gray-700 italic">"{reviewingApp.sopText || 'Standard application'}"</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Transition Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Awarded">Awarded (Approved for Grant)</option>
                  <option value="Rejected">Not Selected / Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Committee Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Enter remarks visible to the student on their tracking timeline..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0D9488] hover:bg-teal-700 text-white rounded-xl shadow-sm"
                >
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Scholarship Modal */}
      {isAddSchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#0D9488] to-teal-800 p-6 text-white relative">
              <button
                onClick={() => setIsAddSchModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-xl font-bold text-white">Post New Scholarship Listing</h2>
              <p className="text-xs text-teal-100 mt-1">Configure transparent eligibility rules</p>
            </div>

            <form onSubmit={handleCreateScholarship} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Scholarship Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NEC Higher Technical Stipend Scheme"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Provider Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="e.g. Ministry of Education"
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Funding Amount
                  </label>
                  <input
                    type="text"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. ₹35,000 / year"
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Min Required GPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    required
                    value={newMinGpa}
                    onChange={(e) => setNewMinGpa(parseFloat(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Max Family Income (₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={newMaxIncome}
                    onChange={(e) => setNewMaxIncome(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Eligible Domicile State
                  </label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  >
                    <option value="All">All States (Pan-India)</option>
                    {ALL_INDIAN_STATES.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Target Gender
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Female (in STEM)">Female (in STEM)</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Required Documents (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={newDocs}
                  onChange={(e) => setNewDocs(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Official Notice Website Link
                </label>
                <input
                  type="url"
                  required
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://scholarships.gov.in"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0D9488] hover:bg-teal-700 text-white rounded-xl shadow-sm"
                >
                  Publish Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
