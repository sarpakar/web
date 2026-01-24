'use client';

import { Post } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  currentUserId?: string;
}

export default function PostCard({ post, onLike, currentUserId }: PostCardProps) {
  const isLiked = currentUserId && post.likedBy?.includes(currentUserId);
  const timestamp = post.timestamp instanceof Date 
    ? post.timestamp 
    : post.timestamp?.toDate?.() || new Date();

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          {post.userPhotoURL ? (
            <img
              src={post.userPhotoURL}
              alt={post.userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
              {post.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{post.userName}</p>
          <p className="text-xs text-gray-500">
            {post.location && <span>{post.location} • </span>}
            {formatDistanceToNow(timestamp)}
          </p>
        </div>
      </div>

      {/* Media */}
      {post.thumbnailURL && (
        <div className="aspect-video w-full bg-gray-100">
          <img
            src={post.thumbnailURL}
            alt={post.caption}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-900">{post.caption}</p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Restaurant Info */}
        {post.restaurantName && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-sm font-medium text-gray-900">📍 {post.restaurantName}</p>
            {post.cuisineType && (
              <p className="text-xs text-gray-500">{post.cuisineType}</p>
            )}
          </div>
        )}

        {/* Engagement */}
        <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-3">
          <button
            onClick={() => post.id && onLike?.(post.id)}
            className={`flex items-center gap-1.5 text-sm transition ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{post.likeCount || post.engagement?.likes || 0}</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{post.engagement?.comments || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{post.engagement?.views || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}



