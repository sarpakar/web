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
  const { user, loading, isLoggingOut } = useAuthStore();
  const { isSearchOpen } = useUIStore();

  const isFridgePage = pathname === '/fridge';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/landing');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] loading-container">
        <div className="animate-loading-fade-in">
          <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#FDFCFB] via-[#FCFBFF] to-[#F9FAFC] ${isLoggingOut ? 'animate-logout-fade-out' : ''}`}>
      {/* Logout overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center logout-overlay bg-white/60">
          <div className="flex flex-col items-center gap-3 animate-loading-fade-in">
            <div className="h-5 w-5 animate-premium-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-800" />
            <p className="text-sm text-gray-500 animate-content-fade-in">Signing out...</p>
          </div>
        </div>
      )}

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
