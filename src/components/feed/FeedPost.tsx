'use client';

import { useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';

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
}: FeedPostProps) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike();
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

      {/* Image */}
      {!videoURL && images.length > 0 && (
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
      {videoURL && (
        <div className="relative mb-3 px-4">
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              src={videoURL}
              className="w-full object-contain"
              style={{ maxHeight: '500px' }}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}

      {/* Content text (if no image or as caption) */}
      {content && (
        <p className="text-gray-900 text-base leading-relaxed mb-3 px-4">
          {content}
          {restaurantName && (
            <span className="text-gray-600"> · {restaurantName}</span>
          )}
        </p>
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
