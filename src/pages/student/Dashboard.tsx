import React, { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ScholarshipCard from '../../components/ScholarshipCard';
import { Scholarship, AcademicLevel, AwardType, ALL_INDIAN_STATES, GENDER_CATEGORIES, FIELD_OF_STUDY_CATEGORIES } from '../../types';
import { evaluateEligibility } from '../../utils/ruleEngine';
import { INDIAN_STATES, MAJORS_LIST, CATEGORIES } from '../../data/constants';
import { getDaysLeft } from '../../utils/dateUtils';
import {
  Search,
  Filter,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  RefreshCw,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const { scholarships, savedScholarshipIds } = useData();
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ELIGIBLE' | 'POSSIBLE' | 'INELIGIBLE'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedAwardType, setSelectedAwardType] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMajor, setSelectedMajor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadline' | 'deadline_asc' | 'deadline_desc' | 'amount_desc'>('recommended');

  const [toastMessage, setToastMessage] = useState('');

  // Quick profile drawer toggle if student wants to edit profile live
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSelectedLevel('All');
    setSelectedAwardType('All');
    setSelectedState('All');
    setSelectedGender('All');
    setSelectedCategory('All');
    setSelectedMajor('All');
    setSortBy('recommended');
  };

  // Defer input recalculation so typing never freezes or lags the UI thread
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Pre-calculate rule evaluation exactly ONCE per scholarship when user profile or scholarship dataset changes
  const eligibilityMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof evaluateEligibility>>();
    for (let i = 0; i < scholarships.length; i++) {
      const sch = scholarships[i];
      map.set(sch.id, evaluateEligibility(user, sch));
    }
    return map;
  }, [scholarships, user]);

  // Real-time calculation against student profile with O(1) eligibility lookups
  const filteredScholarships = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    const list = scholarships.filter((sch) => {
      const evalRes = eligibilityMap.get(sch.id);
      const status = evalRes?.status ?? 'Possibly Eligible';

      // Status Filter
      if (statusFilter === 'ELIGIBLE' && status !== 'Eligible') return false;
      if (statusFilter === 'POSSIBLE' && status !== 'Possibly Eligible') return false;
      if (statusFilter === 'INELIGIBLE' && status !== 'Not Eligible') return false;

      // Keyword multi-token search
      if (tokens.length > 0) {
        const titleNorm = (sch.title || '').toLowerCase();
        const providerNorm = (sch.provider || '').toLowerCase();
        const descNorm = (sch.description || '').toLowerCase();
        const docsNorm = (sch.docsNeeded || []).join(' ').toLowerCase();
        const countryNorm = (sch.country || '').toLowerCase();
        const textBlob = `${titleNorm} ${providerNorm} ${descNorm} ${docsNorm} ${countryNorm}`;

        const matchesTokens = tokens.every((tok) => textBlob.includes(tok));
        if (!matchesTokens) return false;
      }

      // Academic Level filter
      if (selectedLevel !== 'All') {
        if (!sch.academicLevels || !sch.academicLevels.includes(selectedLevel as AcademicLevel)) {
          return false;
        }
      }

      // Award Type filter
      if (selectedAwardType !== 'All') {
        if (sch.awardType !== selectedAwardType) return false;
      }

      // Domicile State filter
      if (selectedState !== 'All') {
        const states = sch.eligibility?.states || ['All'];
        const match =
          states.some((s) => s.toLowerCase() === 'all') ||
          states.some((s) => s.toLowerCase() === selectedState.toLowerCase());
        if (!match) return false;
      }

      // Gender filter
      if (selectedGender !== 'All') {
        const genders = sch.eligibility?.genders || ['All'];
        if (genders && !genders.some((g) => g.toLowerCase() === 'all')) {
          const sgNorm = selectedGender.toLowerCase();
          const match = genders.some((g) => {
            const gNorm = g.toLowerCase();
            if (gNorm === sgNorm) return true;
            if (sgNorm.includes('female (in stem)') && gNorm.includes('female')) return true;
            if (sgNorm === 'female' && gNorm === 'female') return true;
            if (sgNorm.includes('trans') && gNorm.includes('trans')) return true;
            return false;
          });
          if (!match) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const cat = sch.category || 'Central';
        if (cat.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Field of Study / Major filter
      if (selectedMajor !== 'All') {
        const smLower = selectedMajor.toLowerCase().trim();
        const smGroup = FIELD_OF_STUDY_CATEGORIES.find((g) => g.category.toLowerCase() === smLower);
        const allowed = sch.eligibility?.majors || ['All'];
        const matchesMajor = allowed.some((m) => {
          const mLower = m.toLowerCase().trim();
          if (mLower === 'all') return true;
          if (mLower === smLower) return true;
          if (smGroup && smGroup.options.some((opt) => opt.toLowerCase() === mLower)) return true;
          if (mLower.includes(smLower) || smLower.includes(mLower)) return true;
          return false;
        });
        if (!matchesMajor) return false;
      }

      return true;
    });

    // High performance sorting
    list.sort((a, b) => {
      if (sortBy === 'deadline' || sortBy === 'deadline_asc') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (sortBy === 'deadline_desc') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (sortBy === 'amount_desc') {
        const parseAmount = (val: string | number) => {
          if (typeof val === 'number') return val;
          const match = String(val).replace(/,/g, '').match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return parseAmount(b.amount) - parseAmount(a.amount);
      }
      if (sortBy === 'recommended') {
        const resA = eligibilityMap.get(a.id)?.status || 'Not Eligible';
        const resB = eligibilityMap.get(b.id)?.status || 'Not Eligible';
        const rank = { Eligible: 3, 'Possibly Eligible': 2, 'Not Eligible': 1 };
        return rank[resB] - rank[resA];
      }
      return 0;
    });

    return list;
  }, [
    scholarships,
    eligibilityMap,
    statusFilter,
    deferredSearchQuery,
    selectedLevel,
    selectedAwardType,
    selectedState,
    selectedGender,
    selectedCategory,
    selectedMajor,
    sortBy,
  ]);

  // Fast statistics directly reading precomputed map
  const eligibleCount = useMemo(() => {
    let count = 0;
    for (const res of eligibilityMap.values()) {
      if (res.status === 'Eligible') count++;
    }
    return count;
  }, [eligibilityMap]);

  const closingSoonCount = useMemo(() => {
    let count = 0;
    for (const s of scholarships) {
      const days = getDaysLeft(s.deadline);
      if (days !== null && days >= 0 && days <= 15) count++;
    }
    return count;
  }, [scholarships]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#F5B731]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Card matching Reference Screenshot */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Floating Circular Badge on top right */}
        <div className="hidden md:flex absolute top-8 right-8 w-20 h-20 rounded-full bg-[#F5B731] text-stone-950 font-black text-[10px] flex-col items-center justify-center text-center p-2 leading-tight uppercase shadow-xs select-none">
          <span>100%</span>
          <span>VERIFIED</span>
          <span>RULES</span>
        </div>

        {/* Top Tag Pill */}
        <div className="inline-block">
          <span className="bg-[#FEF3D6] dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40 text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full uppercase">
            TRANSPARENT, RULE-BASED SCHOLARSHIP DISCOVERY & ATS
          </span>
        </div>

        {/* Big H1 Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 dark:text-white tracking-tight mt-3">
          Scholarship Directory & Matcher
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
          Deterministic rule matching against your profile details. Zero black-box scoring. Find verified grants, local quotas, and fellowship funding.
        </p>

        {/* 4 Stat Summary Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="bg-[#FEF4DA] dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 rounded-2xl p-4 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-amber-200">{scholarships.length}</div>
            <div className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mt-1">TOTAL SCHEMES</div>
          </div>

          <div className="bg-[#FAF9F5] dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 rounded-2xl p-4 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">{eligibleCount}</div>
            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">ELIGIBLE FOR YOU</div>
          </div>

          <div className="bg-[#FAF9F5] dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 rounded-2xl p-4 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">{savedScholarshipIds.length}</div>
            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">SAVED FOR LATER</div>
          </div>

          <div className="bg-[#F5B731] text-stone-950 rounded-2xl p-4 shadow-xs transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-stone-950">{closingSoonCount}</div>
            <div className="text-[10px] font-black text-stone-950 uppercase tracking-wider mt-1">CLOSING &lt; 15 DAYS</div>
          </div>
        </div>
      </section>

      {/* Search & Quick Toggles Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Rounded-full Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, provider, field, or keywords..."
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-full text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F5B731] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Only My Eligible Toggle Pill */}
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'ELIGIBLE' ? 'ALL' : 'ELIGIBLE')}
              className={clsx(
                'px-4 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 shadow-2xs cursor-pointer',
                statusFilter === 'ELIGIBLE'
                  ? 'bg-[#F5B731] text-stone-950 border-amber-400'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:bg-stone-50'
              )}
            >
              <span className={clsx('w-2 h-2 rounded-full', statusFilter === 'ELIGIBLE' ? 'bg-stone-950' : 'bg-[#F5B731]')} />
              <span>Only My Eligible</span>
            </button>

            {/* Sort Dropdown Pill */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-full text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs outline-none cursor-pointer"
              >
                <option value="recommended">Best Matched Rules</option>
                <option value="deadline_asc">Deadline: Soonest First</option>
                <option value="deadline_desc">Deadline: Latest First</option>
                <option value="amount_desc">Highest Funding Amount</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>

            {/* Quick Profile Recalibration Button */}
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(!isProfileDrawerOpen)}
              className={clsx(
                'px-3.5 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer',
                isProfileDrawerOpen
                  ? 'bg-stone-950 text-white border-stone-950'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:bg-stone-50'
              )}
              title="Edit Profile Attributes Live"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recalibrate</span>
            </button>
          </div>
        </div>

        {/* Row of 6 Filter Dropdowns matching Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* 1. Academic Level */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              ACADEMIC LEVEL
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Doctoral">Doctoral / PhD</option>
              <option value="School">School / Class 10-12</option>
              <option value="Diploma">Diploma / Polytechnic</option>
            </select>
          </div>

          {/* 2. Field of Study */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              FIELD OF STUDY
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All</option>
              {FIELD_OF_STUDY_CATEGORIES.map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 3. Domicile / State */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              DOMICILE / STATE
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Category / Quota */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              CATEGORY / QUOTA
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Central">Central Govt Schemes</option>
              <option value="State">State Govt Schemes</option>
              <option value="UGC">UGC Schemes</option>
              <option value="AICTE">AICTE Schemes</option>
              <option value="Private">Private / Trusts</option>
              <option value="Corporate">Corporate CSR</option>
              <option value="International">International</option>
            </select>
          </div>

          {/* 5. Gender */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              GENDER
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Female (in STEM)">Female (in STEM)</option>
              <option value="Transgender">Transgender</option>
            </select>
          </div>

          {/* 6. Award Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1 tracking-wider">
              AWARD TYPE
            </label>
            <select
              value={selectedAwardType}
              onChange={(e) => setSelectedAwardType(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 shadow-2xs outline-none"
            >
              <option value="All">All</option>
              <option value="Tuition Waiver">Tuition Waiver</option>
              <option value="Living Stipend">Living Stipend</option>
              <option value="One-Time Grant">One-Time Grant</option>
              <option value="Full-Ride">Full-Ride</option>
              <option value="Merit Award">Merit Award</option>
            </select>
          </div>
        </div>

        {/* Result status count line */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Showing <span className="font-bold text-[#D97706]">{filteredScholarships.length}</span> opportunities • Live verified database
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-[#D97706] hover:text-amber-700 tracking-wider uppercase cursor-pointer"
          >
            RESET FILTERS
          </button>
        </div>
      </section>

      {/* Recalibration Profile Drawer (Collapsible) */}
      {isProfileDrawerOpen && (
        <section className="bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5B731]" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Live Profile Recalibration Engine</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">GPA / Academic Score</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={user?.gpa ?? ''}
                onChange={(e) => updateProfile({ gpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                step="10000"
                min="0"
                value={user?.familyIncome ?? ''}
                onChange={(e) => updateProfile({ familyIncome: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">State Domicile</label>
              <select
                value={user?.state || 'Assam'}
                onChange={(e) => updateProfile({ state: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800"
              >
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Degree Stream / Major</label>
              <select
                value={user?.major || 'Computer Science'}
                onChange={(e) => updateProfile({ major: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800"
              >
                {FIELD_OF_STUDY_CATEGORIES.map((g) => (
                  <optgroup key={g.category} label={g.category}>
                    {g.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* 3-Column Responsive Scholarship Cards Grid matching Screenshot */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredScholarships.map((sch, idx) => (
          <ScholarshipCard
            key={sch.id}
            scholarship={sch}
            student={user}
            precomputedEligibility={eligibilityMap.get(sch.id)}
            index={idx}
          />
        ))}
      </section>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">No Schemes Match Current Criteria</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Try resetting your filters or clearing search terms to browse all 545+ available opportunities.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-[#F5B731] hover:bg-amber-500 text-stone-950 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
