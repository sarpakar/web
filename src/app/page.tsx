'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/feed');
      } else {
        router.replace('/landing');
      }
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white loading-container">
      <div className="animate-loading-fade-in">
        <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800" />
      </div>
    </main>
  );
}
