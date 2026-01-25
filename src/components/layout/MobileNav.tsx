'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, User, Plus } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export default function MobileNav() {
  const pathname = usePathname();
  const { isSearchOpen, toggleSearch } = useUIStore();

  const navItems = [
    { name: 'Home', href: '/feed', icon: Home },
    { name: 'Search', icon: Search, onClick: () => toggleSearch() },
    { name: 'Log', href: '/log-meal', icon: Plus, isPrimary: true },
    { name: 'Activity', href: '/challenges', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (href === '/feed' && pathname === '/');
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/95 border-t border-gray-200/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center min-w-[60px] py-1.5 px-2 rounded-lg transition-colors ${
                  isSearchOpen
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon size={22} strokeWidth={1.75} />
                <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
              </button>
            );
          }

          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                href={item.href!}
                className="flex flex-col items-center justify-center min-w-[60px] -mt-4"
              >
                <div className="p-3 bg-gray-900 text-white rounded-full shadow-lg">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-medium text-gray-700 mt-1">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1.5 px-2 rounded-lg transition-colors ${
                active
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2 : 1.75} />
              <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
