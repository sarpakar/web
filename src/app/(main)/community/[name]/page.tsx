'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { Post } from '@/types';
import FeedPost from '@/components/feed/FeedPost';
import { ChevronDown } from 'lucide-react';

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

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const communityName = decodeURIComponent(params.name as string);

  const [posts, setPosts] = useState<Post[]>([]);
  const [communityImage, setCommunityImage] = useState<string>('/logo.png');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [sortBy, setSortBy] = useState('Best');

  useEffect(() => {
    loadCommunityPosts();
  }, [communityName]);

  const loadCommunityPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await socialService.fetchFeed(50);
      const filtered = allPosts.filter(
        post => post.restaurantName?.toLowerCase() === communityName.toLowerCase()
      );
      setPosts(filtered);

      // Set community image from first post
      if (filtered.length > 0 && filtered[0].thumbnailURL) {
        setCommunityImage(normalizeURL(filtered[0].thumbnailURL) || '/logo.png');
      }
    } catch (error) {
      console.error('Failed to load community posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
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
          user.displayName || 'Anonymous',
          user.photoURL || undefined,
          post.userId
        );
      }

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
    <div className="min-h-screen bg-white">
      {/* Community Header */}
      <div className="border-b border-gray-200">
        {/* Top Section with Icon and Name */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Community Icon */}
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={communityImage}
                  alt={communityName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Community Name */}
              <div>
                <h1 className="text-2xl font-bold text-black">{communityName}</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/log-meal')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-black hover:bg-gray-50 transition-colors outline-none select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Post
              </button>
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors outline-none select-none ${
                  isJoined
                    ? 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors outline-none select-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="text-sm font-semibold text-black">{sortBy}</span>
            <ChevronDown size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div>
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
        <div className="flex justify-center py-8">
          <div className="animate-loading-fade-in">
            <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800" />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share something in this community</p>
          <button
            onClick={() => router.push('/log-meal')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Post
          </button>
        </div>
      )}
    </div>
  );
}
