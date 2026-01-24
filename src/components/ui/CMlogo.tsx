'use client';

import Image from 'next/image';

interface CMlogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function CMlogo({ className = "", width = 40, height = 24 }: CMlogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="CampusMeals"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
