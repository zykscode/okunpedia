import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        amber:
          'bg-amber-50 text-amber-800 ring-amber-600/15 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/25',
        emerald:
          'bg-emerald-50 text-emerald-800 ring-emerald-600/15 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/25',
        blue:
          'bg-blue-50 text-blue-800 ring-blue-600/15 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/25',
        purple:
          'bg-purple-50 text-purple-800 ring-purple-600/15 dark:bg-purple-950/40 dark:text-purple-400 dark:ring-purple-500/25',
        success:
          'bg-green-50 text-green-800 ring-green-600/15 dark:bg-green-950/40 dark:text-green-400 dark:ring-green-500/25',
        danger:
          'bg-red-50 text-red-800 ring-red-600/15 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-500/25',
        neutral:
          'bg-gray-50 text-gray-700 ring-gray-500/15 dark:bg-gray-800/60 dark:text-gray-300 dark:ring-gray-700/50',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge = (props: BadgeProps) => {
  const { variant, className, children, ...rest } = props;
  return (
    <span {...rest} className={twMerge(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
};
