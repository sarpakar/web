'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import Header from '@/components/layout/Header';
import SearchChat from '@/components/search/SearchChat';
import MobileNav from '@/components/layout/MobileNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();
  const { isSearchOpen } = useUIStore();

  const isFridgePage = pathname === '/fridge';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/landing');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Search/Chat Interface */}
      {isSearchOpen && <SearchChat />}

      {/* Top Header - Responsive margins */}
      <div
        className={`transition-[margin] duration-200 ease-out ${
          isSearchOpen
            ? 'ml-0 sm:ml-[72px]'
            : 'ml-0 sm:ml-[72px] xl:ml-[220px]'
        }`}
      >
        <Header />
      </div>

      {/* Main Content Area - Mobile first approach */}
      <div
        className={`transition-[margin,opacity] duration-200 ease-out ${
          isSearchOpen
            ? 'ml-0 sm:ml-[72px] opacity-0 pointer-events-none'
            : 'ml-0 sm:ml-[72px] xl:ml-[220px] lg:mr-0 xl:mr-[320px] opacity-100'
        }`}
      >
        {/* Page Content */}
        <main className="min-h-[calc(100vh-56px)] px-2 sm:px-4 md:px-6">
          <div className={isFridgePage ? 'w-full' : 'max-w-[600px] mx-auto w-full'}>
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar - Hidden on mobile/tablet, show on xl */}
      <div
        className={`transition-opacity duration-200 ease-out ${
          isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <RightSidebar />
      </div>

      {/* Mobile Bottom Navigation - Only on mobile */}
      <MobileNav />
    </div>
  );
}
