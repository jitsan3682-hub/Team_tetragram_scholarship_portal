import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import InstructionsModal from './InstructionsModal';
import {
  GraduationCap,
  Bookmark,
  LogOut,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, activeRole, setRole } = useAuth();
  const { savedScholarshipIds } = useData();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white dark:bg-[#1A1815] border-b border-stone-200/80 dark:border-stone-800/80 sticky top-0 z-40 transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Navigation Pills */}
            <div className="flex items-center gap-4 lg:gap-8">
              <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-[#F5B731] flex items-center justify-center text-stone-950 shadow-xs">
                  <GraduationCap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-stone-900 dark:text-white">Scholar</span>
                  <span className="text-lg font-bold text-[#D97706]">Bridge</span>
                </div>
              </Link>

              {/* Navigation Pill Bar matching Reference Screenshot */}
              <div className="hidden md:flex items-center gap-1.5 text-xs">
                <Link
                  to="/dashboard"
                  className="px-3.5 py-1.5 rounded-full font-bold bg-[#FEF3D6] dark:bg-amber-950/50 text-stone-900 dark:text-amber-300 transition-all shadow-2xs"
                >
                  Directory
                </Link>
                <Link
                  to="/profile"
                  className="px-3.5 py-1.5 rounded-full font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                >
                  Rule Engine
                </Link>
                <Link
                  to="/my-scholarships"
                  className="px-3.5 py-1.5 rounded-full font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                >
                  Fellowships
                </Link>
                <Link
                  to="/resources"
                  className="px-3.5 py-1.5 rounded-full font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                >
                  Institutional Grants
                </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Instant Role Switcher */}
              <div className="hidden xl:flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-full text-xs font-semibold">
                <button
                  onClick={() => {
                    setRole('student');
                    navigate('/dashboard');
                  }}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] font-bold ${
                    (user?.role !== 'admin' && activeRole !== 'admin')
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Student View
                </button>
                <button
                  onClick={() => {
                    setRole('admin');
                    navigate('/admin');
                  }}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] font-bold ${
                    (user?.role === 'admin' || activeRole === 'admin')
                      ? 'bg-[#F5B731] text-stone-950 shadow-2xs'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Admin View
                </button>
              </div>

              {/* Language Switcher Pill */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 p-1 rounded-full text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] ${
                      language === 'en' ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-bold shadow-2xs' : 'hover:text-stone-950 dark:hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                      language === 'hi' ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-bold shadow-2xs' : 'hover:text-stone-950 dark:hover:text-white'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => setLanguage('as')}
                    className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                      language === 'as' ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-bold shadow-2xs' : 'hover:text-stone-950 dark:hover:text-white'
                    }`}
                  >
                    অসমীয়া
                  </button>
                </div>
              </div>

              {/* Hackathon Judge Guide Outline Pill Button */}
              <button
                onClick={() => setIsGuideOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Open judging checklist and system manual"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>JUDGE GUIDE</span>
              </button>

              {/* Bookmark Pill Button */}
              <Link
                to="/my-scholarships"
                className="relative p-2 rounded-full text-stone-600 dark:text-stone-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border border-stone-200 dark:border-stone-700"
                title="View Saved Scholarships"
              >
                <Bookmark className="w-4 h-4" />
                {savedScholarshipIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F5B731] text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {savedScholarshipIds.length}
                  </span>
                )}
              </Link>

              {/* Dark / Light Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle Dark and Light Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 fill-amber-300/40" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700 fill-stone-700/20" />
                )}
              </button>

              {/* User Sign In / Profile Action */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F5B731] text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left text-xs pr-1">
                      <div className="font-bold text-stone-900 dark:text-white truncate max-w-[110px]">{user.name}</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 capitalize">{user.role}</div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
                    title={t.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white px-3 py-1.5"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold bg-[#F5B731] hover:bg-amber-500 text-stone-950 px-4 py-1.5 rounded-full shadow-xs transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Guide Modal */}
      <InstructionsModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}
