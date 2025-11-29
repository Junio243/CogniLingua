'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number }>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative h-3 w-full overflow-hidden rounded-full bg-white/5', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      {...props}
    >
      <div
        className="h-full w-full flex-1 rounded-full bg-gradient-to-r from-primary-400 to-emerald-400 transition-all duration-300"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </div>
  ),
);
Progress.displayName = 'Progress';

export { Progress };
