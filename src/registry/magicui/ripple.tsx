'use client';

import { cn } from '@/lib/utils';

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
}

export function Ripple({
  mainCircleSize = 60,
  mainCircleOpacity = 0.4,
  numCircles = 4,
  className,
}: RippleProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 80;
        // Stagger delays so ripples expand outward in sequence
        const animationDelay = `${i * 0.15}s`;

        return (
          <div
            key={i}
            className="absolute rounded-full border-2 border-gray-400/40 animate-ripple"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
}
