'use client';

import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { RainbowButton } from '@/components/ui/rainbow-button';

// CM Logo Component
const CMlogo = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <img src="/logo.png" alt="CampusMeals" width={size} height={size * 0.6} className={className} style={{ filter: 'invert(1)' }} />
);

export default function PricingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
      >
        {/* Nav blur with gradual fade */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            height: '120px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between h-14 relative">
              {/* Left: Logo */}
              <button
                onClick={() => window.location.href = '/landing'}
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer z-10"
              >
                <CMlogo size={48} className="w-12 h-12" />
              </button>

              {/* Center: Navigation - Absolute center */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                <a href="/landing#about" className="text-[15px] font-medium text-white hover:opacity-60 transition-opacity">
                  About
                </a>
                <a href="/landing/communities" className="text-[15px] font-medium text-white hover:opacity-60 transition-opacity">
                  Communities
                </a>
                <a href="/landing/pricing" className="text-[15px] font-medium text-white hover:opacity-60 transition-opacity">
                  Pricing
                </a>
              </div>

              {/* Right: Get the app */}
              <RainbowButton
                onClick={() => setIsLoginModalOpen(true)}
                variant="outline"
                className="hidden sm:flex z-10 rounded-full"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Get the app
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </RainbowButton>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center text-white"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-6"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderColor: 'rgba(55,65,81,1)',
            }}
          >
            <div className="py-4 space-y-1">
              <a
                href="/landing#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-white hover:opacity-60 transition-opacity"
              >
                About
              </a>
              <a
                href="/landing/communities"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-white hover:opacity-60 transition-opacity"
              >
                Communities
              </a>
              <a
                href="/landing/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium text-white hover:opacity-60 transition-opacity"
              >
                Pricing
              </a>
              <RainbowButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                variant="outline"
                className="w-full justify-start rounded-full"
              >
                Get the app
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </RainbowButton>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14" />

      {/* Pricing Section - Flighty Inspired */}
      <section
        className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-4">
              <span className="text-white">Level up with </span>
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">CampusMeals Pro</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-8">
              The ultimate campus food discovery experience.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold text-base transition-all duration-200 shadow-[0_4px_14px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.5)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              Get CampusMeals Pro
            </button>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-10 md:mb-14">
            <div className="inline-flex bg-gray-800 rounded-full p-1">
              <button className="px-6 py-2 rounded-full bg-gray-700 text-white font-semibold text-sm shadow-sm transition-all">
                Student
              </button>
              <button className="px-6 py-2 rounded-full text-gray-400 font-medium text-sm hover:text-gray-300 transition-all">
                Campus
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-16 md:mb-20">
            {/* Free Card */}
            <div className="relative bg-gray-900 rounded-[20px] p-6 text-white overflow-hidden border border-gray-800">
              {/* Ticker */}
              <div className="absolute top-0 left-0 right-0 overflow-hidden h-6 bg-gray-800">
                <div className="flex items-center gap-4 animate-scroll-horizontal whitespace-nowrap text-xs text-gray-400 py-1.5">
                  <span className="flex items-center gap-1"><span className="text-purple-400">✦</span> FREE <span className="text-purple-400">✦</span></span>
                  <span className="flex items-center gap-1"><span className="text-purple-400">✦</span> FREE <span className="text-purple-400">✦</span></span>
                  <span className="flex items-center gap-1"><span className="text-purple-400">✦</span> FREE <span className="text-purple-400">✦</span></span>
                  <span className="flex items-center gap-1"><span className="text-purple-400">✦</span> FREE <span className="text-purple-400">✦</span></span>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-400 text-sm mb-1">Free</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">Forever</p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Basic feed access</p>
                </div>
              </div>
            </div>

            {/* Weekly Card */}
            <div className="relative bg-gray-900 rounded-[20px] p-6 text-white overflow-hidden border border-gray-800">
              {/* Ticker */}
              <div className="absolute top-0 left-0 right-0 overflow-hidden h-6 bg-gray-800">
                <div className="flex items-center gap-4 animate-scroll-horizontal whitespace-nowrap text-xs text-purple-400 py-1.5">
                  <span className="flex items-center gap-1">✦ MOST FLEXIBLE ✦</span>
                  <span className="flex items-center gap-1">✦ MOST FLEXIBLE ✦</span>
                  <span className="flex items-center gap-1">✦ MOST FLEXIBLE ✦</span>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-400 text-sm mb-1">Pay-As-You-Go</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$1.99</span>
                  <span className="text-gray-400 text-sm">/week</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">Billed weekly</p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Full access, cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Annual Card - Best Value */}
            <div className="relative bg-gray-900 rounded-[20px] p-6 text-white overflow-hidden ring-2 ring-purple-500">
              {/* Ticker */}
              <div className="absolute top-0 left-0 right-0 overflow-hidden h-6 bg-purple-600">
                <div className="flex items-center gap-4 animate-scroll-horizontal whitespace-nowrap text-xs text-white py-1.5">
                  <span className="flex items-center gap-1">✦ BEST VALUE ✦</span>
                  <span className="flex items-center gap-1">✦ BEST VALUE ✦</span>
                  <span className="flex items-center gap-1">✦ BEST VALUE ✦</span>
                  <span className="flex items-center gap-1">✦ BEST VALUE ✦</span>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-400 text-sm mb-1">Unlimited Annual</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$2.99</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">$35.99 billed annually</p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Our most popular plan</p>
                  <p className="text-white text-sm mt-1">Unlimited features</p>
                </div>
              </div>
            </div>

            {/* Lifetime Card */}
            <div className="relative bg-gray-900 rounded-[20px] p-6 text-white overflow-hidden border border-gray-800">
              {/* Ticker */}
              <div className="absolute top-0 left-0 right-0 overflow-hidden h-6 bg-gray-800">
                <div className="flex items-center gap-4 animate-scroll-horizontal whitespace-nowrap text-xs text-gray-400 py-1.5">
                  <span className="flex items-center gap-1">✦ PAY ONCE ✦</span>
                  <span className="flex items-center gap-1">✦ PAY ONCE ✦</span>
                  <span className="flex items-center gap-1">✦ PAY ONCE ✦</span>
                  <span className="flex items-center gap-1">✦ PAY ONCE ✦</span>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-400 text-sm mb-1">Lifetime</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$99</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">One-Time Purchase</p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">No subscription</p>
                  <p className="text-white text-sm mt-1">Unlimited forever</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">Compare plans</h3>
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div></div>
              <div className="text-center font-semibold text-gray-300">Free</div>
              <div className="text-center font-semibold text-purple-400">Pro</div>
            </div>

            {/* Feature Rows */}
            <div className="space-y-0">
              {[
                { feature: 'Browse Campus Feed', free: true, pro: true },
                { feature: 'Post Meals', free: true, pro: true },
                { feature: 'Unlimited Collections', free: false, pro: true },
                { feature: 'Priority Discovery', free: false, pro: true },
                { feature: 'Exclusive Deals', free: false, pro: true },
                { feature: 'Ad-Free Experience', free: false, pro: true },
                { feature: 'Early Access Features', free: false, pro: true },
                { feature: 'Premium Support', free: false, pro: true },
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-800 text-sm">
                  <div className="text-gray-300">{item.feature}</div>
                  <div className="text-center">
                    {item.free ? (
                      <svg className="w-5 h-5 text-purple-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-center">
                    <svg className="w-5 h-5 text-purple-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-10 sm:py-12 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2 opacity-60">
              <CMlogo size={32} className="w-8 h-8" />
              <span className="text-sm text-gray-400">CampusMeals</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              © 2026 CampusMeals. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
