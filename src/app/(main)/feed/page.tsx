'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { Post } from '@/types';
import Link from 'next/link';
import FilterPills from '@/components/feed/FilterPills';
import PostComposer from '@/components/feed/PostComposer';
import FeedPost from '@/components/feed/FeedPost';

// Helper to normalize Firebase Storage URLs
function normalizeURL(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

// Helper to format relative time
function formatRelativeTime(date: Date | undefined): string {
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

export default function FeedPage() {
  const { user, userProfile } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const feedPosts = await socialService.fetchFeed(30);
      setPosts(feedPosts);
      console.log('Loaded', feedPosts.length, 'posts from Firestore');
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleLike = async (postId: string) => {
    if (!user || !userProfile) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likedBy?.includes(user.uid);

    try {
      if (isLiked) {
        await socialService.unlikePost(postId, user.uid);
      } else {
        await socialService.likePost(
          postId,
          user.uid,
          userProfile.name || 'Anonymous',
          userProfile.photoURL || undefined,
          post.userId
        );
      }

      // Optimistically update UI
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newLikedBy = isLiked
            ? (p.likedBy || []).filter(id => id !== user.uid)
            : [...(p.likedBy || []), user.uid];
          return {
            ...p,
            likedBy: newLikedBy,
            likeCount: (p.likeCount || 0) + (isLiked ? -1 : 1),
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Filter Pills */}
      <FilterPills onFilterChange={handleFilterChange} />

      {/* Post Composer */}
      <PostComposer />

      {/* Feed Posts */}
      <div className="px-4 space-y-4 pb-4">
        {posts.map((post: any) => (
          <FeedPost
            key={post.id}
            author={{
              id: post.userId,
              name: post.userName,
              avatar: normalizeURL(post.userPhotoURL) || null,
              university: post.mealType || '',
              major: post.calories ? `${post.calories} cal` : '',
            }}
            content={post.caption || post.title}
            images={post.thumbnailURL ? [normalizeURL(post.thumbnailURL) || ''] : []}
            timestamp={formatRelativeTime(post.timestamp as Date)}
            likes={post.likeCount || 0}
            comments={post.engagement?.comments || 0}
            isLiked={user ? post.likedBy?.includes(user.uid) : false}
            onLike={() => post.id && handleLike(post.id)}
            restaurantName={post.restaurantName || post.location}
            videoURL={normalizeURL(post.videoURL)}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-xl border border-border shadow-card">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div className="absolute inset-0 rounded-full border-2 border-accent-DEFAULT border-t-transparent animate-spin" />
              </div>
              <p className="mt-3 text-sm text-text-secondary font-medium">Loading posts...</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for no posts */}
      {!isLoading && posts.length === 0 && (
        <div className="mx-4 mb-4">
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-border shadow-card">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No posts yet</h3>
          <p className="text-text-secondary mb-6">Be the first to share something with the community</p>
          <Link
            href="/log-meal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-DEFAULT text-white rounded-lg font-semibold hover:bg-accent-hover shadow-soft hover:shadow-card transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Share your first meal
          </Link>
          </div>
        </div>
      )}
    </div>
  );
}
