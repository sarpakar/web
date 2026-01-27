'use client';

import { useEffect, useState } from 'react';

interface MacroData {
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fat: { current: number; goal: number };
  calories: { current: number; goal: number };
}

// Default data for demo
const DEFAULT_DATA: MacroData = {
  protein: { current: 85, goal: 120 },
  carbs: { current: 180, goal: 250 },
  fat: { current: 52, goal: 65 },
  calories: { current: 1650, goal: 2000 },
};

// Premium color palette
const COLORS = {
  calories: '#EF233C', // Strawberry Red
  protein: '#2B2D42',  // Space Indigo
  carbs: '#8D99AE',    // Lavender Grey
  fat: '#A8B5C4',      // Cool Silver
};

function StoryCircle({
  progress,
  color,
  size = 70,
  label,
  value,
  unit,
}: {
  progress: number;
  color: string;
  size?: number;
  label: string;
  value: number;
  unit: string;
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const clampedProgress = Math.min(progress, 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(clampedProgress);
    }, 50);
    return () => clearTimeout(timer);
  }, [clampedProgress]);

  const angle = animatedProgress * 360;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        style={{
          width: size,
          height: size,
          padding: '3px',
          background: `conic-gradient(from 180deg,
            ${color} 0deg,
            ${color} ${angle}deg,
            #e5e7eb ${angle}deg,
            #e5e7eb 360deg
          )`,
          transition: 'background 0.8s ease-out',
        }}
      >
        <div
          className="w-full h-full rounded-full backdrop-blur-sm bg-white/90 flex items-center justify-center"
          style={{ padding: '3px' }}
        >
          <div className="w-full h-full rounded-full backdrop-blur-lg bg-white/70 border border-white/50 flex flex-col items-center justify-center shadow-inner">
            <span className="text-[14px] font-bold text-gray-900 leading-none">{value}</span>
            <span className="text-[8px] text-gray-500 font-medium mt-0.5">{unit}</span>
          </div>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-gray-700">{label}</span>
    </div>
  );
}

export default function MacroCircles({ data = DEFAULT_DATA }: { data?: MacroData }) {
  return (
    <div className="px-6 pt-4 pb-2">
      <div className="flex items-center justify-center gap-5">
        <StoryCircle
          progress={data.calories.current / data.calories.goal}
          color={COLORS.calories}
          label="Calories"
          value={data.calories.current}
          unit="kcal"
        />
        <StoryCircle
          progress={data.protein.current / data.protein.goal}
          color={COLORS.protein}
          label="Protein"
          value={data.protein.current}
          unit="g"
        />
        <StoryCircle
          progress={data.carbs.current / data.carbs.goal}
          color={COLORS.carbs}
          label="Carbs"
          value={data.carbs.current}
          unit="g"
        />
        <StoryCircle
          progress={data.fat.current / data.fat.goal}
          color={COLORS.fat}
          label="Fat"
          value={data.fat.current}
          unit="g"
        />
      </div>
    </div>
  );
}
