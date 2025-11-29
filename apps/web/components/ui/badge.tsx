'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'bg-primary-500/15 text-primary-200 border border-primary-400/30',
  outline: 'border border-white/10 text-slate-100',
  neutral: 'bg-white/5 border border-white/5 text-slate-200',
};

type BadgeVariant = keyof typeof badgeVariants;

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase', badgeVariants[variant], className)}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';

export { Badge };
