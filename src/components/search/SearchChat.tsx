'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { vectorSearchService } from '@/services/vectorSearchService';
import { Post } from '@/types';
import {
  Plus,
  Clock,
  ArrowUp,
  X,
  Loader2,
} from 'lucide-react';

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [aiSummary, setAiSummary] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    try {
      setIsSearching(true);
      console.log('🔍 Searching for:', query);

      // Perform vector search
      const { summary, posts } = await vectorSearchService.getRecommendations(query);

      setSearchResults(posts);
      setAiSummary(summary);

      console.log('✅ Found', posts.length, 'results');
    } catch (error) {
      console.error('❌ Search error:', error);
      setAiSummary('Sorry, there was an error with your search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setAiSummary('');
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-[72px] z-40 bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] transition-opacity duration-200 ease-out opacity-100"
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
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight"
            style={{ fontFamily: '-apple-system, SF Pro Display, SF Pro Text, system-ui, sans-serif' }}
          >
            {greeting}, {displayName}
          </h1>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 animate-fade-up animation-delay-50">
          <div
            className={`backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 transition-all duration-200 ${
              isFocused ? 'shadow-[0_20px_60px_rgba(0,0,0,0.08)]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
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
                disabled={!query.trim() || isSearching}
                className={`p-2.5 rounded-full transition-all duration-150 ${
                  query.trim() && !isSearching
                    ? 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
                    : 'bg-[#E8E8ED] text-[#86868B]'
                }`}
              >
                {isSearching ? (
                  <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                ) : (
                  <ArrowUp size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div className="w-full max-w-3xl animate-fade-up animation-delay-150">
            {/* AI Summary */}
            {aiSummary && (
              <div className="mb-6 p-6 backdrop-blur-lg bg-white/60 rounded-[24px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <p className="text-base text-[#1D1D1F] leading-relaxed">{aiSummary}</p>
              </div>
            )}

            {/* Results Grid */}
            <div className="space-y-4">
              {searchResults.map((post) => (
                <div
                  key={post.id}
                  className="p-5 backdrop-blur-lg bg-white/60 rounded-[24px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {post.thumbnailURL && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={post.thumbnailURL}
                          alt={post.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[#1D1D1F] line-clamp-1">
                          {post.caption}
                        </h3>
                        <span className="text-sm text-[#86868B] flex-shrink-0">
                          {post.engagement.likes} likes
                        </span>
                      </div>

                      {post.restaurantName && (
                        <p className="text-sm text-[#86868B] mb-1">
                          📍 {post.restaurantName}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          {post.userPhotoURL && (
                            <img
                              src={post.userPhotoURL}
                              alt={post.userName}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-[#86868B]">{post.userName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear search button */}
            <button
              onClick={handleClearSearch}
              className="mt-6 mx-auto px-6 py-3 text-sm font-medium text-[#0071E3] hover:bg-[#0071E3]/5 rounded-full transition-colors duration-150"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Feature cards - shown when no search results */
          <div className="w-full max-w-3xl animate-fade-up animation-delay-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* From friends - With friend avatars */}
              <button className="flex flex-col items-start p-5 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-left hover:scale-[1.02] transition-all duration-200 group">
                <div className="flex -space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all duration-200">
                    <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Friend" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all duration-200">
                    <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Friend" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all duration-200">
                    <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Friend" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">From friends</h3>
                <p className="text-sm text-[#86868B] leading-relaxed">See what your friends are eating</p>
              </button>

              {/* Track nutrition - With food images */}
              <button className="flex flex-col items-start p-5 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-left hover:scale-[1.02] transition-all duration-200 group">
                <div className="flex -space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-200">
                    <img src="/img/apollo bagel.jpg" alt="Food" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-200">
                    <img src="/img/Lindustrie Pizza.jpg" alt="Food" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-200">
                    <img src="/img/Red Hook Tavern.jpg.webp" alt="Food" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Track your nutrition</h3>
                <p className="text-sm text-[#86868B] leading-relaxed">Monitor your daily intake and goals</p>
              </button>

              {/* Trending - With food images */}
              <button className="flex flex-col items-start p-5 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-left hover:scale-[1.02] transition-all duration-200 group">
                <div className="flex -space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-300 transition-all duration-200">
                    <img src="/img/Lindustrie Pizza.jpg" alt="Food" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-300 transition-all duration-200">
                    <img src="/img/apollo bagel.jpg" alt="Food" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-300 transition-all duration-200">
                    <img src="/img/Red Hook Tavern.jpg.webp" alt="Food" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Trending</h3>
                <p className="text-sm text-[#86868B] leading-relaxed">Discover popular meals near you</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
