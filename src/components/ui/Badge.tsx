import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        amber:
          'bg-amber-50 text-amber-800 ring-amber-600/10 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/20',
        emerald:
          'bg-emerald-50 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/20',
        blue:
          'bg-blue-50 text-blue-800 ring-blue-600/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20',
        purple:
          'bg-purple-50 text-purple-800 ring-purple-600/10 dark:bg-purple-950/40 dark:text-purple-400 dark:ring-purple-500/20',
        neutral:
          'bg-gray-50 text-gray-800 ring-gray-600/10 dark:bg-gray-900/60 dark:text-gray-300 dark:ring-gray-800',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge = (props: BadgeProps) => {
  return (
    <span className={twMerge(badgeVariants({ variant: props.variant }), props.className)}>
      {props.children}
    </span>
  );
};
