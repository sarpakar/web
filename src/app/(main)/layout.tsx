'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import Header from '@/components/layout/Header';
import SearchChat from '@/components/search/SearchChat';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { isSearchOpen } = useUIStore();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Search/Chat Interface */}
      {isSearchOpen && <SearchChat />}

      {/* Main Content Area */}
      <div
        className={`transition-[margin,opacity] duration-200 ease-out ${
          isSearchOpen
            ? 'ml-[72px] opacity-0 pointer-events-none'
            : 'ml-[72px] xl:ml-[220px] lg:mr-[320px] opacity-100'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-56px)]">
          <div className="max-w-[600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <div
        className={`transition-opacity duration-200 ease-out ${
          isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <RightSidebar />
      </div>
    </div>
  );
}
