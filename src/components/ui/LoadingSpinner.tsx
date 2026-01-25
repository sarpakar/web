'use client';

import CMlogo from './CMlogo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: { width: 48, height: 29 },
    md: { width: 80, height: 48 },
    lg: { width: 120, height: 72 },
  };

  const logoSize = sizeConfig[size];

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
      <div className="animate-logo-float">
        <CMlogo
          width={logoSize.width}
          height={logoSize.height}
          className="animate-logo-pulse"
        />
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}



