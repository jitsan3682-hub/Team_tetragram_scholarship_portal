import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Bookmark,
  FileText,
  FolderLock,
  FileEdit,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  role: 'student' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const { t } = useLanguage();
  const { savedScholarshipIds } = useData();
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t.discoveryMatcher },
    {
      to: '/my-scholarships',
      icon: Bookmark,
      label: t.savedScholarships,
      badge: savedScholarshipIds.length > 0 ? savedScholarshipIds.length : undefined,
    },
    { to: '/applications', icon: FileText, label: t.applicationTracker },
    { to: '/document-locker', icon: FolderLock, label: t.documentLocker },
    { to: '/sop-lor', icon: FileEdit, label: t.sopLorManager },
    { to: '/resources', icon: BookOpen, label: t.resourceCenter },
    { to: '/profile', icon: User, label: t.myProfile },
  ];

  if (role === 'admin') {
    links.unshift({
      to: '/admin',
      icon: ShieldCheck,
      label: t.adminPortal,
      badge: undefined,
    });
  }

  return (
    <aside className="w-64 bg-[#F8F6F0] dark:bg-[#141210] border-r border-stone-200/80 dark:border-stone-800/80 hidden md:flex flex-col shrink-0 transition-colors justify-between">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
          <span>DIRECTORY TOOLS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B731]" />
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-[#FDEBB6] dark:bg-amber-950/60 text-stone-950 dark:text-amber-300 font-bold shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-900/60 hover:text-stone-900 dark:hover:text-stone-100'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#F5B731] text-stone-950">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Portal Bottom Widget from Screenshot */}
      <div className="p-4 border-t border-stone-200/60 dark:border-stone-800/60">
        <div className="p-3 bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3D6] dark:bg-amber-950/60 text-stone-900 dark:text-amber-300 flex items-center justify-center font-black text-xs shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
              {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
              Deterministic Matcher v2.4
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
