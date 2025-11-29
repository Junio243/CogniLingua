'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-white shadow-glow hover:bg-primary-400 active:scale-[0.99] border border-primary-400/50',
        secondary:
          'bg-surface-muted text-slate-100 border border-white/5 hover:border-white/10 hover:bg-surface-muted/80',
        outline:
          'border border-white/10 bg-transparent text-slate-100 hover:bg-white/5 hover:border-primary-400/50',
        ghost: 'text-slate-200 hover:bg-white/5',
        destructive:
          'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 active:scale-[0.99] border border-red-400/60',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
