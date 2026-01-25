'use client';

import { useState } from 'react';

// Helper to normalize Firebase Storage URLs (remove :443 port if present)
function normalizeURL(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

// Generate consistent color based on name
const getColorFromName = (name: string): string => {
  const colors = [
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-slate-500',
    'bg-slate-600',
    'bg-slate-700',
    'bg-zinc-500',
    'bg-zinc-600',
    'bg-neutral-500',
    'bg-neutral-600',
    'bg-stone-600',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sizeClass = sizeClasses[size];
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  const bgColor = getColorFromName(name || 'User');

  // Normalize the URL to fix Firebase Storage issues
  const normalizedSrc = normalizeURL(src);

  // Check if we have a valid image URL and no error
  const hasValidImage = normalizedSrc && !imageError && (
    normalizedSrc.startsWith('http') ||
    normalizedSrc.startsWith('/') ||
    normalizedSrc.startsWith('data:')
  );

  // Fallback to initials with colored background
  const FallbackAvatar = () => (
    <div
      className={`${sizeClass} rounded-full ${bgColor} flex items-center justify-center text-white font-medium flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );

  if (!hasValidImage) {
    return <FallbackAvatar />;
  }

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative ${className}`}>
      {/* Show shimmer while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={normalizedSrc || ''}
        alt={name || 'User'}
        className={`w-full h-full object-cover transition-opacity duration-150 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => {
          console.log('Avatar image failed to load:', normalizedSrc);
          setImageError(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
