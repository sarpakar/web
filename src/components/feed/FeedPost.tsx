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
    <article className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
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
          <Link href={`/profile/${author.id}`} className="font-semibold text-text-primary hover:underline text-base">
            {author.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            {author.university && <span>{author.university}</span>}
            {author.university && author.major && <span className="text-border-strong">·</span>}
            {author.major && <span>{author.major}</span>}
          </div>
        </div>

        {/* Timestamp and more options */}
        <div className="flex items-center gap-2 text-text-tertiary">
          <span className="text-xs font-medium">{timestamp}</span>
          <button className="p-1.5 hover:bg-surface rounded-full transition-all duration-200">
            <MoreHorizontal size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Image */}
      {!videoURL && images.length > 0 && (
        <div className="relative mb-3 px-4">
          <div className="relative rounded-lg overflow-hidden bg-surface">
            {/* Shimmer while loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
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
        <p className="text-text-primary text-base leading-relaxed mb-3 px-4">
          {content}
          {restaurantName && (
            <span className="text-text-secondary"> · {restaurantName}</span>
          )}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4 pt-3 border-t border-border/30 mt-3">
        <div className="flex items-center gap-6">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 group transition-all duration-200 ${
              isLiked ? 'text-accent-DEFAULT' : 'text-text-tertiary hover:text-accent-DEFAULT'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${
              isLiked ? 'bg-accent-light' : 'group-hover:bg-accent-light'
            }`}>
              <Heart
                size={20}
                strokeWidth={1.75}
                fill={isLiked ? 'currentColor' : 'none'}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            {likes > 0 && <span className="text-sm font-semibold text-text-primary">{likes}</span>}
          </button>

          {/* Comment */}
          <button className="flex items-center gap-2 group text-text-tertiary hover:text-accent-blue transition-all duration-200">
            <div className="p-1.5 rounded-full group-hover:bg-accent-light transition-all duration-200">
              <MessageCircle
                size={20}
                strokeWidth={1.75}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            {comments > 0 && <span className="text-sm font-semibold text-text-primary">{comments}</span>}
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
            saved ? 'text-accent-blue bg-accent-light' : 'text-text-tertiary hover:text-accent-blue hover:bg-accent-light'
          }`}
        >
          <Bookmark size={20} strokeWidth={1.75} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}
