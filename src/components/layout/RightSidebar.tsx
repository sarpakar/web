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

interface FoodGroup {
  id: string;
  name: string;
  logo: string;
  title: string;
  posts: string;
  details: string;
}

// Helper to normalize Firebase Storage URLs
function normalizeURL(url: string | undefined | null): string {
  if (!url) return '/logo.png';
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

function CommunityCard({ community }: { community: Community }) {
  const handleClick = () => {
    window.location.href = `/community/${encodeURIComponent(community.name)}`;
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-start gap-3 px-3 py-3 -mx-3 hover:bg-surface rounded-lg transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-11 h-11 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex-shrink-0 overflow-hidden ring-1 ring-black/[0.04] shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={community.logo}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-secondary mb-0.5 truncate">{community.name}</p>
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight group-hover:text-accent-blue transition-colors">
          {community.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary mt-1 font-normal">
          <span className="font-medium">{community.members}</span>
          <span className="text-border-strong">·</span>
          <span>{community.category}</span>
        </div>
      </div>

      {/* Bookmark */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 text-text-tertiary hover:text-accent-blue hover:bg-accent-light rounded-md transition-all duration-200 flex-shrink-0"
      >
        <Bookmark size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function FoodGroupCard({ group }: { group: FoodGroup }) {
  const handleClick = () => {
    window.location.href = `/community/${encodeURIComponent(group.name)}`;
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-start gap-3 px-3 py-3 -mx-3 hover:bg-surface rounded-lg transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-11 h-11 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex-shrink-0 overflow-hidden ring-1 ring-black/[0.04] shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={group.logo}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-secondary mb-0.5 truncate">{group.name}</p>
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight group-hover:text-accent-blue transition-colors">
          {group.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary mt-1 font-normal">
          <span className="font-medium">{group.posts}</span>
          <span className="text-border-strong">·</span>
          <span>{group.details}</span>
        </div>
      </div>

      {/* Bookmark */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 text-text-tertiary hover:text-accent-blue hover:bg-accent-light rounded-md transition-all duration-200 flex-shrink-0"
      >
        <Bookmark size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default function RightSidebar() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [foodGroups, setFoodGroups] = useState<FoodGroup[]>([]);

  useEffect(() => {
    fetchPostsForSidebar();
  }, []);

  const fetchPostsForSidebar = async () => {
    try {
      // Fetch posts using the same method as feed page
      const posts = await socialService.fetchFeed(6);

      // Create communities from first 3 posts
      const communityData: Community[] = posts.slice(0, 3).map((post) => ({
        id: post.id || '',
        name: post.restaurantName || post.location || 'Food Spot',
        logo: normalizeURL(post.thumbnailURL),
        title: post.caption || 'Delicious meal',
        members: `${Math.floor(Math.random() * 20) + 5}k members`,
        category: (post as any).mealType || 'Food & Dining',
      }));

      // Create food groups from next 3 posts
      const foodGroupData: FoodGroup[] = posts.slice(3, 6).map((post) => ({
        id: post.id || '',
        name: post.restaurantName || post.location || 'Food Category',
        logo: normalizeURL(post.thumbnailURL),
        title: post.caption || 'Explore this cuisine',
        posts: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}k posts`,
        details: (post as any).mealType || 'Popular group',
      }));

      setCommunities(communityData);
      setFoodGroups(foodGroupData);
    } catch (error) {
      console.error('Error fetching posts for sidebar:', error);
    }
  };

  return (
    <aside className="hidden lg:block fixed right-0 top-0 h-screen w-[320px] bg-white border-l border-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Popular Communities */}
        <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <Link
              href="/communities"
              className="flex items-center justify-between group"
            >
              <h2 className="text-base font-semibold text-text-primary">Popular communities</h2>
              <ChevronRight
                size={18}
                strokeWidth={2}
                className="text-text-tertiary group-hover:text-text-secondary transition-colors"
              />
            </Link>
          </div>
          <div className="px-4 py-2 divide-y divide-border/50">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>

        {/* Food Groups */}
        <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <Link
              href="/explore"
              className="flex items-center justify-between group"
            >
              <h2 className="text-base font-semibold text-text-primary">Food groups</h2>
              <ChevronRight
                size={18}
                strokeWidth={2}
                className="text-text-tertiary group-hover:text-text-secondary transition-colors"
              />
            </Link>
          </div>
          <div className="px-4 py-2 divide-y divide-border/50">
            {foodGroups.map((group) => (
              <FoodGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-xs text-text-tertiary space-x-1.5 px-3 font-normal">
          <a href="#" className="hover:text-text-secondary hover:underline transition-colors">Terms</a>
          <span className="text-border-strong">·</span>
          <a href="#" className="hover:text-text-secondary hover:underline transition-colors">Privacy</a>
          <span className="text-border-strong">·</span>
          <a href="#" className="hover:text-text-secondary hover:underline transition-colors">Help</a>
          <span className="text-border-strong">·</span>
          <span>© 2024 Campusmeals</span>
        </div>
      </div>
    </aside>
  );
}
