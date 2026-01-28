'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import { RainbowButton } from '@/components/ui/rainbow-button';

// CM Logo Component
const CMlogo = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <img src="/logo.png" alt="CampusMeals" width={size} height={size * 0.6} className={className} style={{ filter: 'invert(1)' }} />
);

// Background text grid data
const backgroundText = [
  ['NYU', '14:00', 'STANFORD', '16:55', 'MIT', 'BOSTON', '13:55', 'UCLA'],
  ['DUKE', 'AA8951', 'COLUMBIA', '16:00', 'CORNELL', '0B120:0'],
  ['14:05', 'YALE', '0B182', 'PRINCETON', 'HARVARD', 'KAAMSTERD'],
  ['12:40', 'BROWN', 'PENN', 'DARTMOUTH', '00', 'RICE', 'RIX'],
  ['JL6845', 'NORTHWESTERN', 'USC', 'EMORY', '17:30', 'TULANE'],
  ['GEORGETOWN', 'VANDERBILT', 'SPELMAN', 'HOWARD', '13:5'],
  ['OCKHOLM', '2', 'WAKE FOREST', 'SMU', 'NOTRE DAME', 'DUB'],
  ['SAW', 'BERKELEY', '1', 'CHICAGO', 'MIAMI', 'KA'],
  [':30', 'AUSTIN', 'SEATTLE', 'ATLANTA', ':00', 'RI'],
  ['FURT', 'BCNJL', 'BOSTON', 'PHILLY', 'YORK', '17'],
  ['H2461', 'SAN', 'F', 'DENVER', 'LHI', 'ZUR'],
  ['IRVN', 'STOCK', 'FLIG', '86', 'BLIN', 'I'],
];

// Sample communities for the feature cards
const featureCards = [
  {
    title: 'Your Food Map',
    description: 'See everywhere you\'ve eaten on campus',
    stat: '47',
    statLabel: 'Places visited',
    bgColor: 'from-violet-600 to-purple-700',
  },
  {
    title: '2024 Meal Stats',
    description: 'Your dining hall visits and favorites',
    stat: '234',
    statLabel: 'Meals logged',
    bgColor: 'from-orange-500 to-red-600',
  },
  {
    title: 'Community Trends',
    description: 'What\'s popular at your campus right now',
    stat: '12K',
    statLabel: 'Active foodies',
    bgColor: 'from-blue-500 to-cyan-500',
  },
];

export default function CommunitiesLandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use scrollY directly for smoother parallax
  const { scrollY } = useScroll();

  // Add spring physics for buttery smooth parallax
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Parallax transforms - side phones move faster for depth effect
  const leftPhoneY = useTransform(smoothScrollY, [0, 600], [0, 80]);
  const centerPhoneY = useTransform(smoothScrollY, [0, 600], [0, 50]);
  const rightPhoneY = useTransform(smoothScrollY, [0, 600], [0, 80]);

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

      {/* Hero Section with 3 iPhones */}
      <section className="relative pt-8 pb-8 overflow-hidden min-h-[100vh]">
        {/* Background Text Grid */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.12] select-none pointer-events-none">
          <div className="absolute inset-0 flex flex-col justify-center gap-3 text-[14px] sm:text-[16px] md:text-[18px] font-mono tracking-[0.2em] text-purple-200">
            {backgroundText.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-6 sm:gap-8 md:gap-12 whitespace-nowrap">
                {row.map((text, colIndex) => (
                  <span key={colIndex}>{text}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Purple gradient glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-purple-600/15 rounded-full blur-[180px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          {/* Title - Better hierarchy */}
          <motion.div
            className="text-center pt-8 sm:pt-10 md:pt-12 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-bold tracking-[-0.02em] mb-4 sm:mb-5 text-white leading-[1.1]">
              Campus Communities
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed">
              See your total mileage, explore where you went, and compare stats with friends.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-black rounded-full font-semibold text-[15px] hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
              </svg>
              Get your Campus Passport
            </button>
          </motion.div>

          {/* 3 iPhones Layout with Parallax */}
          <div className="relative flex items-end justify-center h-[420px] sm:h-[500px] md:h-[600px] lg:h-[680px]">
            {/* Left iPhone - CSS animation for entrance, motion for parallax */}
            <motion.div
              className="absolute left-[3%] sm:left-[10%] md:left-[15%] lg:left-[20%] bottom-0 w-[130px] sm:w-[180px] md:w-[230px] lg:w-[270px] z-10 animate-[slideInLeft_1s_0.3s_cubic-bezier(0.16,1,0.3,1)_both]"
              style={{ y: leftPhoneY }}
            >
              <div className="rotate-[-8deg] translate-x-[20%]">
                <img
                  src="/iPhone 17mockup.png"
                  alt="iPhone"
                  className="w-full h-auto relative z-10"
                  style={{ filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6))' }}
                />
                <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden z-0">
                  <img src="/img/IMG_6866.PNG" alt="App screen" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            {/* Center iPhone - CSS animation for entrance, motion for parallax */}
            <motion.div
              className="relative z-20 w-[170px] sm:w-[240px] md:w-[300px] lg:w-[340px] animate-[slideInUp_1s_0.1s_cubic-bezier(0.16,1,0.3,1)_both]"
              style={{ y: centerPhoneY }}
            >
              <img
                src="/iPhone 17mockup.png"
                alt="iPhone"
                className="w-full h-auto relative z-10"
                style={{ filter: 'drop-shadow(0 50px 100px rgba(139, 92, 246, 0.3))' }}
              />
              <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[2.8rem] overflow-hidden z-0">
                <img src="/img/IMG_6867.PNG" alt="App screen" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Right iPhone - CSS animation for entrance, motion for parallax */}
            <motion.div
              className="absolute right-[3%] sm:right-[10%] md:right-[15%] lg:right-[20%] bottom-0 w-[130px] sm:w-[180px] md:w-[230px] lg:w-[270px] z-10 animate-[slideInRight_1s_0.3s_cubic-bezier(0.16,1,0.3,1)_both]"
              style={{ y: rightPhoneY }}
            >
              <div className="rotate-[8deg] translate-x-[-20%]">
                <img
                  src="/iPhone 17mockup.png"
                  alt="iPhone"
                  className="w-full h-auto relative z-10"
                  style={{ filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6))' }}
                />
                <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden z-0">
                  <img src="/img/IMG_6868.PNG" alt="App screen" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The story your dining card doesn&apos;t tell
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Track your campus food journey with detailed insights and stats
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgColor} p-6 sm:p-8`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{card.title}</h3>
                  <p className="text-white/70 text-sm mb-6">{card.description}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white">{card.stat}</span>
                    <span className="text-white/60 text-sm pb-2">{card.statLabel}</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to join your campus community?
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Connect with fellow foodies and discover the best eats on campus.
          </motion.p>
          <RainbowButton
            onClick={() => setIsLoginModalOpen(true)}
            className="rounded-full px-8 py-4 text-base"
          >
            Get Started Free
          </RainbowButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-10 sm:py-12 border-t border-white/10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-xs sm:text-sm text-gray-500 tracking-wide">
              © 2026 CampusMeals. All rights reserved.
            </div>
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <a href="#" className="text-xs sm:text-sm font-medium text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-xs sm:text-sm font-medium text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-xs sm:text-sm font-medium text-gray-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
