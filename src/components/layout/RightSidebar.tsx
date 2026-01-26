'use client';

import Link from 'next/link';
import { ChevronRight, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socialService } from '@/services/socialService';

interface Community {
  id: string;
  name: string;
  logo: string;
  title: string;
  members: string;
  category: string;
}

interface FeaturedCommunity {
  id: string;
  name: string;
  handle: string;
  logo: string;
  banner: string;
  members: string;
  posts: string;
  description: string;
}

// Helper to normalize Firebase Storage URLs
function normalizeURL(url: string | undefined | null): string {
  if (!url) return '/logo.png';
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

function FeaturedCommunityCard({ community }: { community: FeaturedCommunity }) {
  const handleClick = () => {
    window.location.href = `/community/${encodeURIComponent(community.handle)}`;
  };

  return (
    <div
      onClick={handleClick}
      className="backdrop-blur-lg bg-white/80 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-200/60 overflow-hidden cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-300"
    >
      {/* Hero Banner - Compact */}
      <div className="relative h-[120px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={community.banner}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Community Name & Handle */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2
            className="text-lg font-bold text-white mb-0.5"
            style={{ WebkitTextFillColor: 'white', background: 'none' }}
          >
            {community.name}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/90 font-medium">
              /{community.handle}
            </span>
            <button
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1 backdrop-blur-md bg-white/90 hover:bg-white text-gray-900 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-3 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0 -mt-6 relative z-10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={community.logo}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="font-bold text-gray-900">{community.members}</span>
            <span className="text-gray-500 ml-1">members</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">{community.posts}</span>
            <span className="text-gray-500 ml-1">posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const handleClick = () => {
    window.location.href = `/community/${encodeURIComponent(community.name)}`;
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center gap-2.5 py-2.5 hover:bg-gray-900/5 rounded-lg transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex-shrink-0 overflow-hidden ring-1 ring-gray-200/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={community.logo}
          alt={community.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {community.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">{community.members}</p>
      </div>

      {/* Bookmark */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
      >
        <Bookmark size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default function RightSidebar() {
  const [featuredCommunity, setFeaturedCommunity] = useState<FeaturedCommunity | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    fetchPostsForSidebar();
  }, []);

  const fetchPostsForSidebar = async () => {
    try {
      const posts = await socialService.fetchFeed(5);

      // Featured community from first post
      if (posts.length > 0) {
        const post = posts[0];
        setFeaturedCommunity({
          id: post.id || '',
          name: post.restaurantName || 'Campus Eats',
          handle: post.restaurantName?.toLowerCase().replace(/\s+/g, '') || 'campuseats',
          logo: normalizeURL(post.thumbnailURL),
          banner: normalizeURL(post.thumbnailURL),
          members: `${(Math.floor(Math.random() * 50) + 10).toFixed(1)}K`,
          posts: `${Math.floor(Math.random() * 500) + 100}`,
          description: post.caption || 'A community for food lovers to share their favorite campus meals and discover new spots.',
        });
      }

      // Communities from posts 1-4
      const communityData: Community[] = posts.slice(1, 5).map((post) => ({
        id: post.id || '',
        name: post.restaurantName || post.location || 'Food Spot',
        logo: normalizeURL(post.thumbnailURL),
        title: post.caption || 'Delicious meal',
        members: `${Math.floor(Math.random() * 20) + 5}k members`,
        category: (post as any).mealType || 'Food & Dining',
      }));

      setCommunities(communityData);
    } catch (error) {
      console.error('Error fetching posts for sidebar:', error);
      // Set fallback featured community
      setFeaturedCommunity({
        id: 'default',
        name: 'Campus Foodies',
        handle: 'campusfoodies',
        logo: '/logo.png',
        banner: '/logo.png',
        members: '12.5K',
        posts: '365',
        description: 'A community for food lovers to share their favorite campus meals and discover new spots.',
      });
    }
  };

  return (
    <aside className="hidden lg:block fixed right-0 top-0 h-screen w-[320px] backdrop-blur-lg bg-white/40 border-l border-gray-200/30 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="p-3 space-y-3 pb-6">
        {/* Featured Community Card */}
        {featuredCommunity && (
          <FeaturedCommunityCard community={featuredCommunity} />
        )}

        {/* Popular Communities */}
        <div className="backdrop-blur-lg bg-white/60 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200/30">
            <Link
              href="/communities"
              className="flex items-center justify-between group"
            >
              <h2 className="text-sm font-semibold text-gray-900">Popular communities</h2>
              <ChevronRight
                size={16}
                strokeWidth={2}
                className="text-gray-500 group-hover:text-gray-900 transition-colors"
              />
            </Link>
          </div>
          <div className="px-4 py-1 divide-y divide-gray-200/30">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-[10px] text-gray-400 space-x-1 px-2">
          <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <span>·</span>
          <span>© 2024 Campusmeals</span>
        </div>
      </div>
    </aside>
  );
}
