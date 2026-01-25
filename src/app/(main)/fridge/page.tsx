'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { fridgeService, Fridge, FridgeItem } from '@/services/fridgeService';

function formatExpiryDate(expiryDate: any): string {
  if (!expiryDate) return '';

  const expiry = new Date(expiryDate.seconds * 1000);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 3) return `${diffDays} days`;
  if (diffDays <= 7) return `${diffDays} days`;

  return expiry.toLocaleDateString();
}

function getExpiryColor(expiryDate: any): string {
  if (!expiryDate) return 'text-gray-500';

  const expiry = new Date(expiryDate.seconds * 1000);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-gray-900';
  if (diffDays <= 3) return 'text-gray-700';
  if (diffDays <= 7) return 'text-gray-600';

  return 'text-gray-500';
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    fruit: 'bg-pink-100 text-pink-700',
    vegetable: 'bg-green-100 text-green-700',
    dairy: 'bg-blue-100 text-blue-700',
    beverage: 'bg-purple-100 text-purple-700',
    meat: 'bg-red-100 text-red-700',
    other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.other;
}

export default function FridgePage() {
  const { user } = useAuthStore();
  const [fridge, setFridge] = useState<Fridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadFridge();
    }
  }, [user]);

  const loadFridge = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const fridges = await fridgeService.getUserFridges(user.uid);
      if (fridges.length > 0) {
        setFridge(fridges[0]);
      }
    } catch (error) {
      console.error('Failed to load fridge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = fridge?.items
    ? Array.from(new Set(fridge.items.map(item => item.category)))
    : [];

  const filteredItems = fridge?.items?.filter(item => {
    if (selectedCategory === 'all') return !item.isConsumed;
    return item.category === selectedCategory && !item.isConsumed;
  }) || [];

  const expiringSoon = fridge?.items?.filter(item => {
    if (!item.expiryDate) return false;
    const diffDays = Math.floor(
      (new Date(item.expiryDate.seconds * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays >= 0 && !item.isConsumed;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your fridge...</p>
        </div>
      </div>
    );
  }

  if (!fridge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No fridge found</p>
          <p className="text-sm text-gray-500 mt-2">Create a fridge to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC]">
      {/* Category Filters */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'backdrop-blur-2xl bg-gray-900/95 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                : 'backdrop-blur-lg bg-white/60 text-gray-600 border border-gray-200/30 hover:bg-white/80 hover:border-gray-300/50 hover:text-gray-900'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'backdrop-blur-2xl bg-gray-900/95 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                  : 'backdrop-blur-lg bg-white/60 text-gray-600 border border-gray-200/30 hover:bg-white/80 hover:border-gray-300/50 hover:text-gray-900'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-6 pb-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-lg bg-white/60 rounded-[20px] border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Item Image */}
                <div className="relative h-48 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50/50 to-gray-100/50">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const emoji = document.createElement('div');
                          emoji.className = 'text-7xl';
                          emoji.textContent = item.emoji || '📦';
                          parent.appendChild(emoji);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-7xl">{item.emoji || '📦'}</div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
