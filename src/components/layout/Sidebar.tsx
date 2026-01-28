'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useEffect, useState } from 'react';
import { socialService } from '@/services/socialService';
import {
  Home,
  Search,
  Earth,
  Bell,
  User,
  Plus,
  QrCode,
  LogOut,
  Refrigerator,
} from 'lucide-react';

// Navigation items
const primaryNavItems = [
  { name: 'Home', href: '/feed', icon: Home },
  { name: 'Map', href: '/map', icon: Earth },
];

const secondaryNavItems = [
  { name: 'Activity', href: '/challenges', icon: Bell },
  { name: 'Fridge', href: '/fridge', icon: Refrigerator },
  { name: 'Profile', href: '/profile', icon: User },
];

interface SavedCommunity {
  id: string;
  name: string;
  logo: string;
}

// Helper to normalize Firebase Storage URLs
function normalizeURL(url: string | undefined | null): string {
  if (!url) return '/logo.png';
  return url.replace('firebasestorage.googleapis.com:443', 'firebasestorage.googleapis.com');
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoggingOut } = useAuthStore();
  const { isSearchOpen, toggleSearch, closeSearch } = useUIStore();
  const [savedCommunities, setSavedCommunities] = useState<SavedCommunity[]>([]);

  const isCollapsed = isSearchOpen;

  useEffect(() => {
    fetchSavedCommunities();
  }, []);

  const fetchSavedCommunities = async () => {
    try {
      const posts = await socialService.fetchFeed(4);
      const communities: SavedCommunity[] = posts.map((post) => ({
        id: post.id || '',
        name: post.restaurantName || 'Community',
        logo: normalizeURL(post.thumbnailURL),
      }));
      setSavedCommunities(communities);
    } catch (error) {
      console.error('Error fetching saved communities:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = () => {
    if (isSearchOpen) {
      closeSearch();
    }
  };

  const renderNavItem = (item: typeof primaryNavItems[0]) => {
    const isActive = pathname === item.href || (item.href === '/feed' && pathname === '/');
    const Icon = item.icon;

    return (
      <li key={item.name}>
        <Link
          href={item.href}
          onClick={handleNavClick}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 outline-none select-none ${
            isActive
              ? 'bg-gray-900/10 text-gray-900 font-semibold'
              : 'text-gray-700 hover:text-gray-900 hover:font-semibold'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Icon
            size={24}
            strokeWidth={1.75}
            className="flex-shrink-0"
          />
          <span
            className={`hidden xl:block text-[16px] font-semibold whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
            }`}
          >
            {item.name}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={`hidden sm:fixed left-0 top-0 h-screen sm:flex flex-col backdrop-blur-lg bg-white/60 border-r border-gray-200/30 z-50 transition-[width] duration-200 ease-out ${
        isCollapsed ? 'w-[72px]' : 'w-[72px] xl:w-[220px]'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-start px-4 py-4">
        <Link href="/feed" onClick={handleNavClick} className="outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
          <div className="w-12 h-12 flex items-center justify-center select-none">
            <img
              src="/logo.png"
              alt="Campusmeals"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {renderNavItem(primaryNavItems[0])}

          {/* Search - Special button */}
          <li>
            <button
              onClick={toggleSearch}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 outline-none select-none ${
                isSearchOpen
                  ? 'bg-gray-900/10 text-gray-900 font-semibold'
                  : 'text-gray-700 hover:text-gray-900 hover:font-semibold'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Search
                size={24}
                strokeWidth={1.75}
                className="flex-shrink-0"
              />
              <span
                className={`hidden xl:block text-[16px] font-semibold whitespace-nowrap transition-opacity duration-200 ${
                  isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
                }`}
              >
                Search
              </span>
            </button>
          </li>

          {renderNavItem(primaryNavItems[1])}
        </ul>

        {/* Divider */}
        <div className="my-2 border-t border-gray-200/30" />

        {/* Secondary Navigation */}
        <ul className="space-y-1.5">
          {secondaryNavItems.map(renderNavItem)}
        </ul>

        {/* Saved Communities */}
        {savedCommunities.length > 0 && (
          <>
            {/* Divider */}
            <div className="my-3 border-t border-gray-200/30" />

            {/* Section Label */}
            <p
              className={`text-xs font-medium text-gray-500 mb-2 px-3 transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0 hidden' : 'hidden xl:block'
              }`}
            >
              Saved
            </p>

            {/* Community Circles - Show only first 3 */}
            <div className={`flex flex-col items-center gap-1 ${isCollapsed ? '' : 'xl:items-start'}`}>
              {savedCommunities.slice(0, 3).map((community) => (
                <Link
                  key={community.id}
                  href={`/community/${encodeURIComponent(community.name)}`}
                  onClick={handleNavClick}
                  className="group flex items-center gap-3 w-full px-3 py-1.5 rounded-lg hover:bg-gray-900/5 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  title={community.name}
                >
                  {/* Circle Avatar with White Glow */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,1),0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
                    <img
                      src={community.logo}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Name (hidden when collapsed) */}
                  <span
                    className={`hidden xl:block text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate transition-all duration-200 ${
                      isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
                    }`}
                  >
                    {community.name}
                  </span>
                </Link>
              ))}

              {/* See More Button */}
              {savedCommunities.length > 3 && (
                <Link
                  href="/communities"
                  onClick={handleNavClick}
                  className="group flex items-center gap-3 w-full px-3 py-1.5 rounded-lg hover:bg-gray-900/5 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Circle with count */}
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 group-hover:bg-gray-200 transition-all duration-200">
                    +{savedCommunities.length - 3}
                  </div>

                  {/* See more text (hidden when collapsed) */}
                  <span
                    className={`hidden xl:block text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-all duration-200 ${
                      isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
                    }`}
                  >
                    See more
                  </span>
                </Link>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Log Meal Button */}
      <div className="pb-2 px-4">
        <Link
          href="/log-meal"
          onClick={handleNavClick}
          className="flex items-center justify-center gap-2 w-full p-2.5 backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 text-white rounded-lg font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 outline-none select-none hover:scale-[1.02] active:scale-[0.98]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Plus size={20} strokeWidth={2.5} className="flex-shrink-0" />
          <span
            className={`hidden xl:block whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
            }`}
          >
            Log Meal
          </span>
        </Link>
      </div>

      {/* Get the App */}
      <div className="pb-2 px-4">
        <button
          className="flex items-center justify-center gap-2 w-full p-2.5 hover:bg-gray-900/5 border border-gray-200/40 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 outline-none select-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <QrCode size={20} strokeWidth={1.75} className="flex-shrink-0" />
          <span
            className={`hidden xl:block whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
            }`}
          >
            Get the app
          </span>
        </button>
      </div>

      {/* Log Out */}
      <div className="pb-4 px-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center justify-center gap-2 w-full p-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none select-none ${
            isLoggingOut
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50/50'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isLoggingOut ? (
            <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-500 animate-loading-fade-in" />
          ) : (
            <LogOut size={20} strokeWidth={1.75} className="flex-shrink-0" />
          )}
          <span
            className={`hidden xl:block whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
            }`}
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </span>
        </button>
      </div>
    </aside>
  );
}
