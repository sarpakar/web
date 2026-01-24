'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import {
  Plus,
  Clock,
  ArrowUp,
  Utensils,
  Sparkles,
  MapPin,
  TrendingUp,
  Users,
  X,
  Heart,
  BarChart3,
  Flame,
} from 'lucide-react';

const quickActions = [
  { id: 'nearby', label: 'Nearby eats', icon: MapPin, color: 'text-blue-500' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-orange-500' },
  { id: 'healthy', label: 'Healthy options', icon: Sparkles, color: 'text-emerald-500' },
  { id: 'budget', label: 'Budget friendly', icon: Utensils, color: 'text-violet-500' },
  { id: 'social', label: 'Group dining', icon: Users, color: 'text-rose-500' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function SearchChat() {
  const { userProfile, user } = useAuthStore();
  const { closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = userProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';
  const greeting = getGreeting();

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search:', query);
    }
  };

  const handleQuickAction = (actionId: string) => {
    setQuery(quickActions.find(a => a.id === actionId)?.label || '');
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-[72px] z-40 bg-[#F5F5F7] transition-opacity duration-200 ease-out opacity-100"
      style={{ willChange: 'opacity' }}
    >
      {/* Close button */}
      <button
        onClick={closeSearch}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-full transition-colors duration-150"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Greeting */}
        <div className="mb-8 animate-fade-up text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight">
            {greeting}, {displayName}
          </h1>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 animate-fade-up animation-delay-50">
          <div
            className={`bg-white rounded-2xl transition-all duration-200 ${
              isFocused ? 'shadow-lg ring-1 ring-black/5' : 'shadow-md'
            }`}
          >
            <div className="p-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for meals, restaurants, nutrition..."
                className="w-full text-lg text-[#1D1D1F] placeholder-[#86868B] bg-transparent outline-none"
              />
            </div>

            {/* Input actions */}
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 rounded-lg transition-colors duration-150"
                >
                  <Plus size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="p-2 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 rounded-lg transition-colors duration-150"
                >
                  <Clock size={20} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!query.trim()}
                className={`p-2.5 rounded-full transition-all duration-150 ${
                  query.trim()
                    ? 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
                    : 'bg-[#E8E8ED] text-[#86868B]'
                }`}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </form>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-fade-up animation-delay-100">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-sm text-[#1D1D1F] font-medium hover:shadow-md hover:scale-105 transition-all duration-150 shadow-sm"
              >
                <Icon size={16} strokeWidth={1.5} className={action.color} />
                {action.label}
              </button>
            );
          })}
        </div>

        {/* Feature cards */}
        <div className="w-full max-w-3xl animate-fade-up animation-delay-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From friends - Rose */}
            <button className="flex flex-col items-start p-5 bg-white rounded-2xl text-left hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-rose-500 transition-colors duration-200">
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className="text-rose-500 group-hover:text-white transition-colors duration-200"
                />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">From friends</h3>
              <p className="text-sm text-[#86868B] leading-relaxed">See what your friends are eating</p>
            </button>

            {/* Track nutrition - Emerald */}
            <button className="flex flex-col items-start p-5 bg-white rounded-2xl text-left hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-200">
                <BarChart3
                  size={20}
                  strokeWidth={1.5}
                  className="text-emerald-500 group-hover:text-white transition-colors duration-200"
                />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Track your nutrition</h3>
              <p className="text-sm text-[#86868B] leading-relaxed">Monitor your daily intake and goals</p>
            </button>

            {/* Trending - Orange */}
            <button className="flex flex-col items-start p-5 bg-white rounded-2xl text-left hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors duration-200">
                <Flame
                  size={20}
                  strokeWidth={1.5}
                  className="text-orange-500 group-hover:text-white transition-colors duration-200"
                />
              </div>
              <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Trending</h3>
              <p className="text-sm text-[#86868B] leading-relaxed">Discover popular meals near you</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
