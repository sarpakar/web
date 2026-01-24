'use client';

import { useRef, useState } from 'react';
import { MealLog, MealLogTypeInfo } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface MyMealsCarouselProps {
  meals: MealLog[];
  isLoading?: boolean;
}

// Get best image URL from meal
function getBestImageURL(meal: MealLog): string | null {
  return meal.primaryFeedURL || meal.primaryImageURL || meal.primaryThumbnailURL || meal.thumbnailURL || meal.photoURL || null;
}

export default function MyMealsCarousel({ meals, isLoading }: MyMealsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const mealDate = new Date(date);
    const diff = now.getTime() - mealDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d`;
    return mealDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold tracking-tight">My Meals</h2>
        <div className="flex items-center gap-1">
          {meals.length > 3 && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-1.5 rounded-full transition-all ${
                  canScrollLeft 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-1.5 rounded-full transition-all ${
                  canScrollRight 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Add New Meal Card */}
          <Link href="/log-meal" className="flex-shrink-0 snap-start">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-28 h-36 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
                Add Meal
              </span>
            </motion.div>
          </Link>

          {/* Meal Cards */}
          {meals.slice(0, 10).map((meal, index) => {
            const imageUrl = getBestImageURL(meal);
            const info = MealLogTypeInfo[meal.mealType];
            
            return (
              <motion.div
                key={meal.id || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 w-28 h-36 rounded-2xl overflow-hidden relative snap-start cursor-pointer group"
              >
                {imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-3xl">{info?.emoji || '🍽️'}</span>
                  </div>
                )}
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow-md">
                    {meal.title || meal.mealType}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-white/80 text-[10px] drop-shadow-md">
                      {meal.date ? formatDate(meal.date as Date) : ''}
                    </span>
                    {meal.calories && (
                      <>
                        <span className="text-white/60 text-[10px]">·</span>
                        <span className="text-white/80 text-[10px] drop-shadow-md">
                          {meal.calories} cal
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating badge */}
                {meal.rating && meal.rating > 0 && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded-full">
                    <span className="text-white text-[10px] font-medium">
                      ⭐ {meal.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


