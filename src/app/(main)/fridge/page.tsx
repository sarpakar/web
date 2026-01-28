'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { fridgeService, Fridge, FridgeItem } from '@/services/fridgeService';
import { Share2, X, Check } from 'lucide-react';

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

type ShareMessageType = 'available' | 'expiring' | 'trade' | 'recipe_idea';

const shareMessageOptions: { type: ShareMessageType; label: string; emoji: string; description: string }[] = [
  { type: 'available', label: 'Available to share', emoji: '✓', description: 'Let friends know this item is up for grabs' },
  { type: 'expiring', label: 'Expiring soon', emoji: '⏰', description: 'Find someone who can use it before it expires' },
  { type: 'trade', label: 'Looking to trade', emoji: '↔️', description: 'Swap for something else' },
  { type: 'recipe_idea', label: 'Need recipe ideas', emoji: '💡', description: 'Ask the community for recipe suggestions' },
];

export default function FridgePage() {
  const { user, userProfile } = useAuthStore();
  const [fridge, setFridge] = useState<Fridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shareModalItem, setShareModalItem] = useState<FridgeItem | null>(null);
  const [shareMessage, setShareMessage] = useState<ShareMessageType>('available');
  const [shareCaption, setShareCaption] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

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

  const getExpiryDays = (expiryDate: any): number | undefined => {
    if (!expiryDate) return undefined;
    const expiry = new Date(expiryDate.seconds * 1000);
    const diffDays = Math.floor((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const handleShareItem = async () => {
    if (!shareModalItem || !user || !fridge) return;

    setIsSharing(true);
    try {
      // TODO: Create the post with fridge item embed via socialService
      console.log('Sharing fridge item:', {
        item: shareModalItem,
        message: shareMessage,
        caption: shareCaption,
        fridgeItemEmbed: {
          itemId: shareModalItem.id,
          fridgeId: fridge.id,
          name: shareModalItem.name,
          emoji: shareModalItem.emoji || '📦',
          category: shareModalItem.category,
          quantity: shareModalItem.quantity,
          imageUrl: shareModalItem.imageUrl,
          expiryDays: getExpiryDays(shareModalItem.expiryDate),
          message: shareMessage,
        }
      });

      setShareSuccess(true);
      setTimeout(() => {
        setShareModalItem(null);
        setShareCaption('');
        setShareMessage('available');
        setShareSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to share item:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const openShareModal = (item: FridgeItem) => {
    setShareModalItem(item);
    // Auto-select "expiring" if item expires soon
    const expiryDays = getExpiryDays(item.expiryDate);
    if (expiryDays !== undefined && expiryDays <= 3) {
      setShareMessage('expiring');
    } else {
      setShareMessage('available');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] flex items-center justify-center loading-container">
        <div className="text-center animate-loading-fade-in">
          <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm animate-content-fade-in">Loading your fridge...</p>
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
                className="backdrop-blur-lg bg-white/60 rounded-[20px] border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden group"
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

                  {/* Share Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openShareModal(item);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 backdrop-blur-lg bg-white/80 hover:bg-white rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title="Share to feed"
                  >
                    <Share2 size={14} className="text-gray-700" />
                  </button>

                  {/* Expiry Badge */}
                  {item.expiryDate && getExpiryDays(item.expiryDate) !== undefined && getExpiryDays(item.expiryDate)! <= 3 && (
                    <div className="absolute top-3 left-3 px-2 py-1 backdrop-blur-lg bg-amber-500/90 text-white text-xs font-semibold rounded-full">
                      {getExpiryDays(item.expiryDate) === 0 ? 'Today!' : `${getExpiryDays(item.expiryDate)}d left`}
                    </div>
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

      {/* Share Modal */}
      {shareModalItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-lg bg-white/95 rounded-[32px] border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-900">Share to Feed</h2>
              <button
                onClick={() => {
                  setShareModalItem(null);
                  setShareCaption('');
                  setShareSuccess(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {shareSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared!</h3>
                <p className="text-sm text-gray-600">Your fridge item has been posted to the feed.</p>
              </div>
            ) : (
              <>
                {/* Item Preview */}
                <div className="p-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl">
                    {shareModalItem.imageUrl ? (
                      <img
                        src={shareModalItem.imageUrl}
                        alt={shareModalItem.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-inner">
                        <span className="text-3xl">{shareModalItem.emoji || '📦'}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{shareModalItem.name}</h3>
                      <p className="text-sm text-gray-600">{shareModalItem.quantity}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(shareModalItem.category)}`}>
                        {shareModalItem.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caption Input */}
                <div className="px-4">
                  <textarea
                    value={shareCaption}
                    onChange={(e) => setShareCaption(e.target.value)}
                    placeholder="Add a caption... (e.g., 'Anyone want some fresh apples?')"
                    className="w-full h-20 p-3 bg-gray-50 rounded-xl border border-gray-200 resize-none text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                {/* Message Type Selection */}
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">What's the message?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shareMessageOptions.map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setShareMessage(option.type)}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                          shareMessage === option.type
                            ? 'border-gray-900 bg-gray-900/5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{option.emoji}</span>
                          <span className={`text-sm font-medium ${shareMessage === option.type ? 'text-gray-900' : 'text-gray-700'}`}>
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={handleShareItem}
                    disabled={isSharing}
                    className="w-full py-3 backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 disabled:bg-gray-400 text-white rounded-full font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSharing ? (
                      <>
                        <div className="w-4 h-4 border-[1.5px] border-white/30 border-t-white rounded-full animate-premium-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        Share to Feed
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
