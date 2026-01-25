'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUIStore } from '@/stores/uiStore';
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

export default function Sidebar() {
  const pathname = usePathname();
  const { isSearchOpen, toggleSearch, closeSearch } = useUIStore();

  const isCollapsed = isSearchOpen;

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
      <nav className="flex-1 py-3 px-4">
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
          className="flex items-center justify-center gap-2 w-full p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50/50 rounded-lg text-sm font-medium transition-all duration-200 outline-none select-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <LogOut size={20} strokeWidth={1.75} className="flex-shrink-0" />
          <span
            className={`hidden xl:block whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'xl:opacity-0 xl:w-0 xl:overflow-hidden' : 'xl:opacity-100'
            }`}
          >
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
}
