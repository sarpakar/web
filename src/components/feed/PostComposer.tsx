'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar';

export default function PostComposer() {
  const { user, userProfile } = useAuthStore();

  const photoURL = userProfile?.photoURL || user?.photoURL || null;
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="bg-white rounded-xl border border-border shadow-card p-4">
        <Link href="/log-meal" className="flex items-center gap-3">
          <Avatar src={photoURL} name={displayName} size="md" />
          <div className="flex-1 px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-strong rounded-full text-text-tertiary text-base font-normal transition-all duration-200 cursor-pointer">
            Share something with the community...
          </div>
        </Link>
      </div>
    </div>
  );
}
