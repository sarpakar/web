'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
      <div
        className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}



