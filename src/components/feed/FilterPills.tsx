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
    <div className="bg-surface border-b border-border">
      <div className="flex items-center gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-900 text-white shadow-soft'
                  : 'bg-surface text-text-secondary border border-border-strong hover:bg-surface-hover hover:border-primary-300 hover:text-text-primary'
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
