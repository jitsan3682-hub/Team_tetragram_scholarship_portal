import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#141210] border-t border-stone-200 dark:border-stone-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-900 dark:text-stone-100">ScholarBridge India</span>
          <span>•</span>
          <span>TEZHACK 2026 (WEB02 + WEB-004(2))</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/resources" className="hover:text-[#F5B731] transition-colors">
            Resources & FAQ
          </Link>
          <Link to="/admin" className="hover:text-[#F5B731] transition-colors">
            Admin Console
          </Link>
          <span className="flex items-center gap-1 text-stone-400 dark:text-stone-500">
            Engineered with <Heart className="w-3 h-3 text-amber-500 fill-amber-500" /> for Indian Scholars
          </span>
        </div>
      </div>
    </footer>
  );
}
