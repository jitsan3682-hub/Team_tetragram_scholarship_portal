import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InstructionsModal from '../components/InstructionsModal';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Database,
  CheckCircle2,
  FileCheck2,
  Lock,
  Globe2,
  BookOpen,
  Scale,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap,
  HardDrive,
  Users,
} from 'lucide-react';
import { FIELD_OF_STUDY_CATEGORIES } from '../types';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'as'>('en');

  // Interactive Live Rule Sandbox State on Landing Page
  const [demoGpa, setDemoGpa] = useState<number>(3.7);
  const [demoIncome, setDemoIncome] = useState<number>(280000);
  const [demoState, setDemoState] = useState<string>('Assam');
  const [demoCategory, setDemoCategory] = useState<string>('General');
  const [demoMajor, setDemoMajor] = useState<string>('Computer Science');

  // Interactive calculation for sandbox
  const demoIsEligiblePragati = demoGpa >= 3.0 && demoIncome <= 800000;
  const demoIsEligibleNEC =
    (demoState === 'Assam' || ['Sikkim', 'Meghalaya', 'Manipur', 'Nagaland', 'Mizoram', 'Tripura', 'Arunachal Pradesh'].includes(demoState)) &&
    demoIncome <= 800000;
  const demoIsEligibleTata = demoGpa >= 3.5;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-stone-900 selection:bg-amber-300/40 selection:text-stone-950 overflow-x-hidden transition-colors">
      {/* Top Navigation Bar matching Sample Picture (Removed: Deterministic Engine, Core Capabilities, Academic Clusters, Live Sandbox, Admin) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F8F6F0]/90 border-b border-stone-200/80 transition-all">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Directory Nav Pills */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#F5B731] flex items-center justify-center text-stone-950 shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-stone-900">Edu</span><span className="text-lg font-bold text-[#D97706]">Camino</span>
              </div>
            </Link>

            {/* Clean Pill Links matching Sample Picture */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded-full font-bold bg-[#FEF3D6] text-stone-900 transition-all shadow-2xs hover:bg-amber-200/70"
              >
                Directory
              </Link>
              <Link
                to="/my-scholarships"
                className="px-3.5 py-1.5 rounded-full font-medium text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 transition-all"
              >
                Fellowships
              </Link>
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded-full font-medium text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 transition-all"
              >
                Institutional Grants
              </Link>
            </div>
          </div>

          {/* Right Actions matching Sample Picture */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-stone-100/90 border border-stone-200/70 p-1 rounded-full text-xs font-semibold text-stone-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] ${
                  language === 'en' ? 'bg-white text-stone-950 font-bold shadow-2xs' : 'hover:text-stone-950'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                  language === 'hi' ? 'bg-white text-stone-950 font-bold shadow-2xs' : 'hover:text-stone-950'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('as')}
                className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                  language === 'as' ? 'bg-white text-stone-950 font-bold shadow-2xs' : 'hover:text-stone-950'
                }`}
              >
                অসমীয়া
              </button>
            </div>

            {/* Judge Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span>JUDGE GUIDE</span>
            </button>

            {/* Sign In Link */}
            <Link
              to="/login"
              className="text-xs font-bold text-stone-700 hover:text-stone-950 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>

            {/* Primary Action Button */}
            <Button
              onClick={() => navigate('/dashboard')}
              size="sm"
              className="bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-xs cursor-pointer border-none"
            >
              <span>Create Account</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section styled to match the Yellow Sample Picture */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10 text-center">
          {/* Main Hero Card Container */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden text-left">
            {/* Circular 100% VERIFIED RULES Badge from Sample Picture */}
            <div className="hidden md:flex absolute top-10 right-10 w-20 h-20 rounded-full bg-[#F5B731] text-stone-950 font-black text-[10px] flex-col items-center justify-center text-center p-2 leading-tight uppercase shadow-xs select-none">
              <span>100%</span>
              <span>VERIFIED</span>
              <span>RULES</span>
            </div>

            {/* Tag Pill */}
            <div className="inline-block">
              <span className="bg-[#FEF3D6] text-amber-900 border border-amber-300/50 text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full uppercase">
                TRANSPARENT, RULE-BASED SCHOLARSHIP DISCOVERY & ATS
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-stone-950 leading-[1.12] max-w-3xl mt-4">
              Clear, Fair{' '}
              <span className="text-[#D97706]">
                Scholarship Matching
              </span>{' '}
              for Every Indian Scholar.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-normal leading-relaxed mt-3">
              Deterministic rule matching against your profile details. Zero black-box scoring. Find verified grants, local quotas, and fellowship funding across all 36 Indian States &amp; UTs with real-time rule engine evaluation and DigiLocker verification.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs px-6 py-3 rounded-full shadow-xs transition-all hover:scale-105 border-none cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Explore 555+ Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                Open Discovery Matcher
              </button>
            </div>

            {/* 4 Stat Summary Cards matching the Sample Picture */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-stone-100">
              <div className="bg-[#FEF4DA] border border-amber-200/60 rounded-2xl p-4 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-stone-950">545</div>
                <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mt-1">TOTAL SCHEMES</div>
              </div>

              <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-4 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-stone-900">36/36</div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-1">INDIAN STATES & UTS</div>
              </div>

              <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-4 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-stone-900">100%</div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-1">DETERMINISTIC RULES</div>
              </div>

              <div className="bg-[#F5B731] text-stone-950 rounded-2xl p-4 shadow-xs transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-stone-950">₹140+ Cr</div>
                <div className="text-[10px] font-black text-stone-950 uppercase tracking-wider mt-1">TOTAL FUNDING POOL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Core Features Grid in Yellow/Cream Palette */}
      <section className="relative py-16 z-10 border-t border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#D97706] tracking-wider uppercase">
              TRANSPARENCY BY DESIGN
            </span>
            <h2 className="font-bold text-3xl sm:text-4xl text-stone-950 tracking-tight">
              Engineered for Fairness, Speed &amp; Integrity
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Every feature aligns strictly with TEZHACK 2026 requirements, removing ambiguity and paperwork friction.
            </p>
          </div>

          {/* 3-Column Staggered Grid with 3-tier colors from Sample Picture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Scale,
                badge: 'Zero Hidden Scoring',
                title: 'Deterministic Rule Engine',
                desc: '100% transparent algorithmic evaluation. Inspect exact rule conditions side-by-side: GPA thresholds, income caps, all 36 state domiciles, and reservation quotas.',
                highlight: 'Eliminates arbitrary rejections with clear near-miss explanations.',
                cardStyle: 'bg-[#F6BA33] text-stone-950 border border-amber-400/50',
                badgeStyle: 'bg-black/10 text-stone-950',
                buttonStyle: 'bg-stone-950 text-white',
              },
              {
                icon: HardDrive,
                badge: 'Govt & Cloud Vault',
                title: 'DigiLocker & Cloud Storage',
                desc: 'Seamless document infrastructure. Sync 10th, 12th, and UG academic records via DigiLocker, plus direct Google Drive cloud streaming for profile pictures and transcripts.',
                highlight: 'Instant jsPDF single & combined verified certificate export.',
                cardStyle: 'bg-[#FEF6DF] border border-amber-200/70 text-stone-900',
                badgeStyle: 'bg-amber-100 text-amber-900',
                buttonStyle: 'bg-stone-950 text-white',
              },
              {
                icon: Globe2,
                badge: 'National & Global',
                title: '555+ Comprehensive Schemes',
                desc: 'Full domestic coverage across Ministry of Social Justice, Tribal Affairs, AICTE, UGC, and Assam NEC, plus elite global awards (MEXT Japan, Rhodes, Gates Cambridge).',
                highlight: 'Categorized by 5 standardized academic clusters and inclusive gender quotas.',
                cardStyle: 'bg-white border border-stone-200/80 text-stone-900',
                badgeStyle: 'bg-stone-100 text-stone-700',
                buttonStyle: 'bg-[#F5B731] text-stone-950',
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`p-7 rounded-3xl shadow-xs transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${feature.cardStyle}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-black/5 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${feature.badgeStyle}`}>
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="text-xs leading-relaxed opacity-85 font-normal">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-black/10 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{feature.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standardized Academic Disciplines Section */}
      <section className="relative py-16 z-10 border-t border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#D97706] tracking-wider uppercase">
              STANDARDIZED DISCIPLINES
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl text-stone-950 tracking-tight">
              5 Core Fields of Study
            </h2>
            <p className="text-xs text-stone-600">
              Structured to align with national scholarship frameworks and international study-abroad taxonomies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {FIELD_OF_STUDY_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 shadow-2xs space-y-2.5 transition-all hover:border-amber-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F5B731]" />
                  <h4 className="font-bold text-sm text-stone-900 tracking-tight">{cat.category}</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.options.map((opt) => (
                    <span
                      key={opt}
                      className="text-[10px] font-medium bg-white text-stone-700 px-2 py-0.5 rounded-full border border-stone-200/60"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Live Sandbox Section in Warm Design */}
      <section id="sandbox" className="relative py-16 z-10 border-t border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#D97706] tracking-wider uppercase">
              EVALUATOR INTERACTIVE TESTBED
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl text-stone-950 tracking-tight">
              Test Deterministic Rule Evaluation Live
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Adjust parameters below to see how our matching engine evaluates scholarship criteria with zero lag and 100% mathematical certainty.
            </p>
          </div>

          {/* Sandbox Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Adjust Student Profile Inputs:
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-700 font-semibold">Cumulative GPA:</span>
                  <span className="font-bold text-[#D97706]">{demoGpa.toFixed(2)} / 4.0</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.0"
                  step="0.05"
                  value={demoGpa}
                  onChange={(e) => setDemoGpa(parseFloat(e.target.value))}
                  className="w-full accent-[#F5B731] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-700 font-semibold">Annual Family Income:</span>
                  <span className="font-bold text-[#D97706]">₹{demoIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="25000"
                  value={demoIncome}
                  onChange={(e) => setDemoIncome(parseInt(e.target.value, 10))}
                  className="w-full accent-[#F5B731] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-700 uppercase font-semibold mb-1">Domicile State</label>
                  <select
                    value={demoState}
                    onChange={(e) => setDemoState(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-amber-500"
                  >
                    <option value="Assam">Assam (NE Council)</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi (UT)</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-700 uppercase font-semibold mb-1">Category</label>
                  <select
                    value={demoCategory}
                    onChange={(e) => setDemoCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-amber-500"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Result Card Preview */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Live Match Output</span>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> 0ms Deterministic Pass
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="text-xs font-bold text-stone-900">AICTE Pragati Scheme</div>
                      <div className="text-[11px] text-stone-500">Req: GPA &ge; 3.0 &bull; Income &le; ₹8L</div>
                    </div>
                    <Badge className={demoIsEligiblePragati ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                      {demoIsEligiblePragati ? '🟢 Fully Eligible' : '🔴 Ineligible'}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="text-xs font-bold text-stone-900">NEC Special Merit Grant</div>
                      <div className="text-[11px] text-stone-500">Req: North East Domicile &bull; Income &le; ₹8L</div>
                    </div>
                    <Badge className={demoIsEligibleNEC ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                      {demoIsEligibleNEC ? '🟢 Fully Eligible' : '🔴 Ineligible'}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="text-xs font-bold text-stone-900">Tata Trust Excellence</div>
                      <div className="text-[11px] text-stone-500">Req: GPA &ge; 3.5 &bull; All States</div>
                    </div>
                    <Badge className={demoIsEligibleTata ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                      {demoIsEligibleTata ? '🟢 Fully Eligible' : '🔴 Ineligible'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-[#F5B731] hover:bg-amber-500 text-stone-950 font-bold text-xs py-2.5 rounded-full transition-all shadow-xs cursor-pointer border-none"
              >
                Run Against All 555+ Schemes in Portal &rarr;
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Scholarships Section */}
      <section className="relative py-14 z-10 border-t border-stone-200/80 bg-[#FEF6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="font-bold text-2xl sm:text-3xl text-stone-950 tracking-tight">
            View Saved Scholarships
          </h2>
          <div>
            <Link to="/my-scholarships">
              <Button size="sm" className="bg-stone-950 hover:bg-black text-white text-xs rounded-full px-6 py-2.5 font-bold shadow-xs cursor-pointer">
                Saved Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Warm Alabaster / Cream Footer */}
      <footer className="relative py-10 z-10 border-t border-stone-200/80 bg-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F5B731] flex items-center justify-center text-stone-950 font-bold">E</div>
            <span className="text-stone-900 font-bold tracking-tight">
              EduCamino &bull; TEZHACK 2026
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/dashboard" className="hover:text-amber-700 transition-colors">
              Student Dashboard
            </Link>
            <Link to="/my-scholarships" className="hover:text-amber-700 transition-colors">
              Saved Schemes
            </Link>
            <Link to="/profile" className="hover:text-amber-700 transition-colors">
              DigiLocker Profile
            </Link>
            <Link to="/admin-access" className="hover:text-amber-700 transition-colors">
              Admin Portal
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-stone-700 font-medium">Port 5000 API: Online</span>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <InstructionsModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
