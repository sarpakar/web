'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: 'h-4 w-4 border-[1.5px]',
    md: 'h-5 w-5 border-[1.5px]',
    lg: 'h-6 w-6 border-2',
  };

  return (
    <div className={`flex min-h-[200px] flex-col items-center justify-center gap-4 loading-container ${className}`}>
      <div className="animate-loading-fade-in">
        <div className={`${sizeConfig[size]} animate-premium-spin rounded-full border-gray-200 border-t-gray-800`} />
      </div>
      {text && <p className="text-sm text-gray-500 animate-content-fade-in">{text}</p>}
    </div>
  );
}



