import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'eligible' | 'possible' | 'ineligible' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    eligible: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    possible: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
    ineligible: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
    outline: 'border border-slate-300 text-slate-700',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
