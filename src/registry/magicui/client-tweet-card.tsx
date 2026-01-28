'use client';

import { useState, useEffect } from 'react';
import { Tweet } from 'react-tweet';

interface ClientTweetCardProps {
  id: string;
  className?: string;
}

export function ClientTweetCard({ id, className }: ClientTweetCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className={className}>
        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
          <div className="w-5 h-5 border-[1.5px] border-gray-200 border-t-gray-600 rounded-full animate-premium-spin animate-loading-fade-in" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tweet id={id} />
    </div>
  );
}
