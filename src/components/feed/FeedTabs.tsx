'use client';

import Link from 'next/link';

interface FeedTabsProps {
  activeTab: 'for-you' | 'saved';
}

export default function FeedTabs({ activeTab }: FeedTabsProps) {
  return (
    <nav className="flex items-center gap-6 border-b border-gray-200 px-4">
      <Link
        href="/feed"
        className={`relative py-4 text-sm font-medium transition-colors ${
          activeTab === 'for-you'
            ? 'text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        For you
        {activeTab === 'for-you' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Link>
      <Link
        href="/feed/saved"
        className={`relative py-4 text-sm font-medium transition-colors ${
          activeTab === 'saved'
            ? 'text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Saved
        {activeTab === 'saved' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Link>
    </nav>
  );
}
