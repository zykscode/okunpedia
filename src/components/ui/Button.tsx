import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md hover:opacity-95 dark:from-amber-600 dark:to-emerald-700',
        secondary:
          'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100',
        outline:
          'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:bg-gray-800/80',
        ghost:
          'text-gray-600 hover:bg-gray-100/80 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900/80 dark:hover:text-white',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-xs sm:text-sm',
        lg: 'px-6 py-3 text-sm sm:text-base',
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
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type || 'button'}
      className={twMerge(buttonVariants({ variant: props.variant, size: props.size }), props.className)}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props['aria-label']}
      title={props.title}
    >
      {props.children}
    </button>
  );
};
