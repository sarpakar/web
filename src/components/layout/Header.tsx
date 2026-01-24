'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar';
import { Bell } from 'lucide-react';

interface HeaderProps {
  activeTab?: 'for-you' | 'saved';
  notificationCount?: number;
}

export default function Header({ activeTab = 'for-you', notificationCount = 3 }: HeaderProps) {
  const { user, userProfile } = useAuthStore();

  const photoURL = userProfile?.photoURL || user?.photoURL || null;
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left: Tabs */}
        <div className="flex items-center">
          <nav className="flex items-center gap-1">
            <Link
              href="/feed"
              className={`relative px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                activeTab === 'for-you'
                  ? 'text-black bg-surface'
                  : 'text-text-secondary hover:text-black hover:bg-surface'
              }`}
            >
              For you
            </Link>
            <Link
              href="/feed/saved"
              className={`relative px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                activeTab === 'saved'
                  ? 'text-black bg-surface'
                  : 'text-text-secondary hover:text-black hover:bg-surface'
              }`}
            >
              Saved
            </Link>
          </nav>
        </div>

        {/* Right: Notification and Avatar */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-2.5 text-text-primary hover:bg-surface rounded-full transition-all duration-200">
            <Bell size={20} strokeWidth={1.75} />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-accent-DEFAULT rounded-full border-2 border-white shadow-sm">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <Link href="/profile" className="hover:opacity-80 transition-opacity ml-1">
            <Avatar src={photoURL} name={displayName} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
