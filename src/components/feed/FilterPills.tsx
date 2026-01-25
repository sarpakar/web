'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'your-school', label: 'Your school' },
  { id: 'following', label: 'Following' },
  { id: 'nearby', label: 'Nearby' },
];

interface FilterPillsProps {
  onFilterChange?: (filterId: string) => void;
}

export default function FilterPills({ onFilterChange }: FilterPillsProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="bg-gradient-to-b from-[#FDFCFB] to-[#FCFBFF] border-b border-gray-200/30">
      <div className="flex items-center gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all duration-300 ${
                isActive
                  ? 'backdrop-blur-2xl bg-gray-900/95 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                  : 'backdrop-blur-lg bg-white/60 text-gray-600 border border-gray-200/30 hover:bg-white/80 hover:border-gray-300/50 hover:text-gray-900'
              }`}
            >
              {isActive && <Check size={14} strokeWidth={2.5} />}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
