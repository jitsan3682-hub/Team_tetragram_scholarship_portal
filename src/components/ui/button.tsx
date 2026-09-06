import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B731] disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-[#F5B731] text-stone-950 hover:bg-amber-500 shadow-xs font-semibold',
      outline: 'border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200',
      ghost: 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300',
      secondary: 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700',
      accent: 'bg-amber-500 text-stone-950 hover:bg-amber-600 shadow-xs font-semibold',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs',
      sm: 'h-8 rounded-md px-3 text-[11px]',
      lg: 'h-11 rounded-xl px-8 text-sm',
      icon: 'h-9 w-9',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
