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
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
