'use client';

import { Vendor } from '@/types';

interface VendorCardProps {
  vendor: Vendor;
  onClick?: (vendor: Vendor) => void;
}

export default function VendorCard({ vendor, onClick }: VendorCardProps) {
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      'Restaurants': '🍽️',
      'Cafés': '☕',
      'Groceries': '🛒',
      'Desserts': '🍰',
      'Convenience': '🏪',
      'Alcohol': '🍷',
      'All': '📍'
    };
    return emojiMap[category] || '📍';
  };

  const getWaitStatusColor = (status?: string): string => {
    switch (status) {
      case 'Confident (No wait)': return 'text-green-600 bg-green-50';
      case 'Short wait (5-10 min)': return 'text-yellow-600 bg-yellow-50';
      case 'Medium wait (15-20 min)': return 'text-orange-600 bg-orange-50';
      case 'Long wait (30+ min)': return 'text-red-600 bg-red-50';
      default: return '';
    }
  };

  return (
    <div 
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
      onClick={() => onClick?.(vendor)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {vendor.imageURL ? (
          <img
            src={vendor.imageURL}
            alt={vendor.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            {getCategoryEmoji(vendor.category)}
          </div>
        )}
        
        {/* Open/Closed Badge */}
        {vendor.isOpen !== undefined && (
          <div className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            vendor.isOpen 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {vendor.isOpen ? 'Open' : 'Closed'}
          </div>
        )}

        {/* Price Range */}
        <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-green-700 backdrop-blur-sm">
          {vendor.priceRange}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Category */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{vendor.name}</h3>
            <p className="text-sm text-gray-500">
              {vendor.cuisine || vendor.category}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium text-gray-900">{vendor.rating.toFixed(1)}</span>
          </div>
          {vendor.reviewCount > 0 && (
            <span className="text-sm text-gray-400">({vendor.reviewCount} reviews)</span>
          )}
        </div>

        {/* Wait Status */}
        {vendor.waitStatus && (
          <div className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getWaitStatusColor(vendor.waitStatus)}`}>
            {vendor.waitStatus}
          </div>
        )}

        {/* Dietary Highlights */}
        {vendor.dietaryHighlights && vendor.dietaryHighlights.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {vendor.dietaryHighlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {vendor.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Address */}
        {vendor.address && (
          <p className="mt-2 text-xs text-gray-400 line-clamp-1">
            📍 {vendor.address}
          </p>
        )}

        {/* Delivery Info */}
        {vendor.deliveryTime && (
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>🚴 {vendor.deliveryTime}</span>
            {vendor.deliveryFee !== undefined && (
              <span>
                {vendor.deliveryFee === 0 ? '✅ Free delivery' : `$${vendor.deliveryFee.toFixed(2)} delivery`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



