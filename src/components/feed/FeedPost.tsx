'use client';

import { useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, ExternalLink } from 'lucide-react';

interface LinkEmbed {
  url: string;
  title: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  favicon?: string;
  type?: 'article' | 'video' | 'recipe' | 'restaurant' | 'other';
}

interface FridgeItemEmbed {
  itemId: string;
  fridgeId: string;
  name: string;
  emoji: string;
  category: string;
  quantity: string;
  imageUrl?: string;
  expiryDays?: number;
  message?: 'available' | 'expiring' | 'trade' | 'recipe_idea';
}

interface FeedPostProps {
  author: {
    id: string;
    name: string;
    avatar?: string | null;
    university?: string;
    major?: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  onLike?: () => void;
  restaurantName?: string;
  videoURL?: string;
  linkEmbed?: LinkEmbed;
  fridgeItemEmbed?: FridgeItemEmbed;
  fridgeItemsGrid?: FridgeItemEmbed[]; // Multiple items in a grid
}

// Extract domain from URL
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Get message label for fridge item
function getFridgeMessageLabel(message?: string): { text: string; color: string } {
  switch (message) {
    case 'available':
      return { text: 'Available to share', color: 'bg-green-100 text-green-700' };
    case 'expiring':
      return { text: 'Expiring soon!', color: 'bg-amber-100 text-amber-700' };
    case 'trade':
      return { text: 'Looking to trade', color: 'bg-blue-100 text-blue-700' };
    case 'recipe_idea':
      return { text: 'Recipe idea needed', color: 'bg-purple-100 text-purple-700' };
    default:
      return { text: 'From my fridge', color: 'bg-gray-100 text-gray-700' };
  }
}

// Get category color
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

export default function FeedPost({
  author,
  content,
  images = [],
  timestamp,
  likes = 0,
  comments = 0,
  isLiked = false,
  onLike,
  restaurantName,
  videoURL,
  linkEmbed,
  fridgeItemEmbed,
  fridgeItemsGrid,
}: FeedPostProps) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [embedImageLoaded, setEmbedImageLoaded] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkEmbed?.url) {
      window.open(linkEmbed.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3 px-4 pt-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Link href={`/profile/${author.id}`}>
            <Avatar src={author.avatar} name={author.name} size="md" />
          </Link>
        </div>

        {/* Author info */}
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${author.id}`} className="font-semibold text-gray-900 hover:underline text-base">
            {author.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {author.university && <span>{author.university}</span>}
            {author.university && author.major && <span className="text-gray-400">·</span>}
            {author.major && <span>{author.major}</span>}
          </div>
        </div>

        {/* Timestamp and more options */}
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xs font-medium">{timestamp}</span>
          <button className="p-1.5 hover:bg-gray-900/5 rounded-full transition-all duration-200">
            <MoreHorizontal size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Content text */}
      {content && !linkEmbed && !fridgeItemEmbed && !fridgeItemsGrid && (
        <p className="text-gray-900 text-base leading-relaxed mb-3 px-4">
          {content}
          {restaurantName && (
            <span className="text-gray-600"> · {restaurantName}</span>
          )}
        </p>
      )}

      {/* Link Embed Card */}
      {linkEmbed && (
        <div className="px-4 mb-3">
          {/* Caption above embed if exists */}
          {content && (
            <p className="text-gray-900 text-base leading-relaxed mb-3">
              {content}
            </p>
          )}

          {/* Embed Card */}
          <div
            onClick={handleLinkClick}
            className="group cursor-pointer rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white/80"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Text Content */}
              <div className="flex-1 p-4 min-w-0">
                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-700 transition-colors">
                  {linkEmbed.title}
                </h3>

                {/* Description */}
                {linkEmbed.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {linkEmbed.description}
                  </p>
                )}

                {/* Source */}
                <div className="flex items-center gap-2">
                  {linkEmbed.favicon && (
                    <img
                      src={linkEmbed.favicon}
                      alt=""
                      className="w-4 h-4 rounded"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                  <span className="text-xs font-medium text-gray-500">
                    {linkEmbed.siteName || getDomain(linkEmbed.url)}
                  </span>
                  <ExternalLink size={12} className="text-gray-400" />
                </div>
              </div>

              {/* Thumbnail */}
              {linkEmbed.imageURL && (
                <div className="relative sm:w-[140px] h-[100px] sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
                  {!embedImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
                  )}
                  <img
                    src={linkEmbed.imageURL}
                    alt={linkEmbed.title}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${embedImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setEmbedImageLoaded(true)}
                    onError={() => setEmbedImageLoaded(true)}
                  />
                  {/* Domain badge on image */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 backdrop-blur-md bg-black/60 rounded text-xs font-medium text-white">
                    {getDomain(linkEmbed.url)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fridge Item Embed Card */}
      {fridgeItemEmbed && (
        <div className="px-4 mb-3">
          {/* Caption above embed if exists */}
          {content && (
            <p className="text-gray-900 text-base leading-relaxed mb-3">
              {content}
            </p>
          )}

          {/* Fridge Item Card - Minimal style like link embeds */}
          <div className="group rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white/80">
            <div className="flex flex-col sm:flex-row">
              {/* Text Content */}
              <div className="flex-1 p-4 min-w-0">
                {/* Title with emoji */}
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-gray-700 transition-colors">
                  {fridgeItemEmbed.emoji} {fridgeItemEmbed.name}
                </h3>

                {/* Quantity */}
                <p className="text-sm text-gray-600 mb-3">
                  {fridgeItemEmbed.quantity}
                </p>

                {/* Source line with message */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFridgeMessageLabel(fridgeItemEmbed.message).color}`}>
                    {getFridgeMessageLabel(fridgeItemEmbed.message).text}
                  </span>
                  {fridgeItemEmbed.expiryDays !== undefined && fridgeItemEmbed.expiryDays <= 3 && (
                    <span className="text-xs text-amber-600 font-medium">
                      · {fridgeItemEmbed.expiryDays === 0 ? 'Expires today' : `${fridgeItemEmbed.expiryDays}d left`}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              {fridgeItemEmbed.imageUrl ? (
                <div className="sm:w-[140px] h-[100px] sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={fridgeItemEmbed.imageUrl}
                    alt={fridgeItemEmbed.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="sm:w-[140px] h-[100px] sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-5xl">{fridgeItemEmbed.emoji}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fridge Items Grid - "What can I cook with this?" */}
      {fridgeItemsGrid && fridgeItemsGrid.length > 0 && (
        <div className="px-4 mb-3">
          {/* Caption */}
          {content && (
            <p className="text-gray-900 text-base leading-relaxed mb-3">
              {content}
            </p>
          )}

          {/* Grid of items */}
          <div className="grid grid-cols-3 gap-2">
            {fridgeItemsGrid.slice(0, 3).map((item, index) => (
              <div
                key={item.itemId || index}
                className="aspect-square rounded-2xl border border-gray-200 overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 group cursor-pointer relative"
              >
                {/* Image or Emoji */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                      {item.emoji}
                    </span>
                  </div>
                )}
                {/* Overlay with name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-6">
                  <p className="text-sm font-medium text-white text-center line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-white/80 text-center">
                    {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe ideas badge */}
          <div className="flex items-center justify-center mt-3">
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
              💡 Looking for recipe ideas
            </span>
          </div>
        </div>
      )}

      {/* Image */}
      {!videoURL && !linkEmbed && !fridgeItemEmbed && !fridgeItemsGrid && images.length > 0 && (
        <div className="relative mb-3 px-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            {/* Shimmer while loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={content || 'Post image'}
              className={`w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ maxHeight: '500px' }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
        </div>
      )}

      {/* Video */}
      {videoURL && !linkEmbed && !fridgeItemEmbed && !fridgeItemsGrid && (
        <div className="relative mb-3 px-4">
          <div className="rounded-2xl overflow-hidden bg-black aspect-[4/5]">
            <video
              src={videoURL}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4 pt-3 border-t border-gray-200/30 mt-3">
        <div className="flex items-center gap-6">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 group transition-all duration-200 ${
              isLiked ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${
              isLiked ? 'bg-gray-900/10' : 'group-hover:bg-gray-900/10'
            }`}>
              <Heart
                size={20}
                strokeWidth={1.75}
                fill={isLiked ? 'currentColor' : 'none'}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            {likes > 0 && <span className="text-sm font-semibold text-gray-900">{likes}</span>}
          </button>

          {/* Comment */}
          <button className="flex items-center gap-2 group text-gray-500 hover:text-gray-900 transition-all duration-200">
            <div className="p-1.5 rounded-full group-hover:bg-gray-900/10 transition-all duration-200">
              <MessageCircle
                size={20}
                strokeWidth={1.75}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            {comments > 0 && <span className="text-sm font-semibold text-gray-900">{comments}</span>}
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
            saved ? 'text-gray-900 bg-gray-900/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-900/10'
          }`}
        >
          <Bookmark size={20} strokeWidth={1.75} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}
