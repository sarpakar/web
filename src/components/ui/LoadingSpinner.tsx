'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
      <div className={`${sizeConfig[size]} animate-spin rounded-full border-2 border-gray-300 border-t-gray-900`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}



