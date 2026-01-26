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
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-3 sm:px-6 h-16 sm:h-18">
        {/* Left: Tabs - Responsive */}
        <div className="flex items-center">
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/feed"
              className={`relative px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 rounded-xl backdrop-blur-md border ${
                activeTab === 'for-you'
                  ? 'text-gray-900 bg-white/60 border-gray-200/50 shadow-sm'
                  : 'text-gray-600 bg-white/30 border-gray-200/30 hover:text-gray-900 hover:bg-white/50 hover:border-gray-200/40'
              }`}
            >
              For you
            </Link>
            <Link
              href="/feed/saved"
              className={`relative px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 rounded-xl backdrop-blur-md border ${
                activeTab === 'saved'
                  ? 'text-gray-900 bg-white/60 border-gray-200/50 shadow-sm'
                  : 'text-gray-600 bg-white/30 border-gray-200/30 hover:text-gray-900 hover:bg-white/50 hover:border-gray-200/40'
              }`}
            >
              Saved
            </Link>
          </nav>
        </div>

        {/* Right: Notification and Avatar - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button className="relative p-2.5 sm:p-3 text-gray-700 bg-white/30 backdrop-blur-md border border-gray-200/30 hover:bg-white/50 hover:border-gray-200/40 rounded-xl transition-all duration-200">
            <Bell size={20} strokeWidth={1.75} className="sm:w-6 sm:h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-1 text-[10px] sm:text-xs font-bold text-white bg-gray-900 rounded-full border-2 border-white shadow-sm">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <Link href="/profile" className="hover:opacity-80 transition-opacity ml-0.5 sm:ml-1">
            <Avatar src={photoURL} name={displayName} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
