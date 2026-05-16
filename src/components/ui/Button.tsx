import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm shadow-emerald-700/20 hover:from-emerald-500 hover:to-emerald-600 focus-visible:ring-emerald-500 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-400 dark:hover:to-emerald-500',
        secondary:
          'bg-gray-900 text-white shadow-sm hover:bg-gray-800 focus-visible:ring-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 dark:focus-visible:ring-white',
        accent:
          'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-600/20 hover:from-amber-400 hover:to-amber-500 focus-visible:ring-amber-500',
        outline:
          'border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-400 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:border-gray-600 dark:focus-visible:ring-gray-600',
        ghost:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-gray-600',
        danger:
          'bg-red-600 text-white shadow-sm hover:bg-red-500 focus-visible:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
        'danger-outline':
          'border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-400 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/40',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-5 text-sm',
        xl: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = (props: ButtonProps) => {
  const { variant, size, className, ...rest } = props;
  return (
    <button
      {...rest}
      className={twMerge(buttonVariants({ variant, size }), className)}
    />
  );
};
