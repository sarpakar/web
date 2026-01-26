'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import Lottie from 'lottie-react';
import paperAirplaneAnimation from '../../../public/Paper airplane.json';
import { Particles } from '@/components/ui/particles';

// CM Logo Component
const CMlogo = ({ className = "", size = 40, style = {} }: { className?: string; size?: number; style?: React.CSSProperties }) => (
  <img src="/logo.png" alt="CampusMeals" width={size} height={size * 0.6} className={className} style={style} />
);

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Static images array to prevent recreation on every render
  const images = ['/img/IMG_6841.PNG', '/img/IMG_6842.PNG', '/img/IMG_6843.PNG'];

  // Preload images for smooth transitions
  useEffect(() => {
    const imagePromises = images.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Auto-advance images every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="min-h-screen bg-white scroll-smooth relative overflow-x-hidden w-full"
      style={{ clipPath: 'inset(0)', maxWidth: '100%' }}
    >

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full"
        style={{
          fontFamily: '"Geist Sans", -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Nav blur with gradual fade */}
        <div
          className="absolute inset-x-0 top-0 backdrop-blur-2xl bg-white/60 pointer-events-none"
          style={{
            height: '160px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          }}
        />
        <div
          className="relative z-10 w-full"
          style={{
            paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
            paddingRight: 'clamp(1.5rem, 5vw, 4rem)'
          }}
        >
          <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-10">
              <button
                onClick={() => window.location.href = '/landing'}
                className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0 cursor-pointer"
              >
                <CMlogo size={64} className="w-14 h-14 sm:w-16 sm:h-16" />
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-3">
                <a
                  href="#about"
                  className="px-5 py-3 text-[19px] font-semibold leading-6 whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                  style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
                >
                  About
                </a>
                <a
                  href="#features"
                  className="px-5 py-3 text-[19px] font-semibold leading-6 whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                  style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="px-5 py-3 text-[19px] font-semibold leading-6 whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                  style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
                >
                  Community
                </a>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:inline-flex items-center px-8 py-3.5 backdrop-blur-xl bg-white/90 hover:bg-white rounded-full border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-200 text-[19px] font-semibold leading-6 whitespace-nowrap hover:scale-[1.02]"
                style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
              >
                Log in
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full text-[19px] font-semibold leading-6 shadow-[0_4px_16px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25),0_16px_48px_rgba(0,0,0,0.3)] transition-all duration-200 outline-none select-none hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                style={{ letterSpacing: '-0.4px' }}
              >
                Start Free Trial
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-12 h-12 backdrop-blur-xl bg-white/60 rounded-full border border-gray-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-200 flex items-center justify-center text-[#1D1D1F] flex-shrink-0"
                aria-label="Toggle menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/30 bg-white/70 backdrop-blur-xl" style={{ fontFamily: '"Geist Sans", -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <div className="max-w-[1400px] mx-auto py-4 space-y-1" style={{ paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingRight: 'clamp(1.5rem, 5vw, 4rem)' }}>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-[16px] font-medium leading-6 hover:opacity-70 rounded-lg transition-opacity duration-200"
                style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
              >
                About
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-[16px] font-medium leading-6 hover:opacity-70 rounded-lg transition-opacity duration-200"
                style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
              >
                Features
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-[16px] font-medium leading-6 hover:opacity-70 rounded-lg transition-opacity duration-200"
                style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
              >
                Community
              </a>
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="flex w-full items-center justify-center px-5 py-2.5 backdrop-blur-xl bg-white/60 hover:bg-white/80 rounded-full border border-gray-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 text-[16px] font-medium leading-6 hover:scale-[1.02]"
                  style={{ letterSpacing: '-0.4px', color: 'rgb(28, 29, 34)' }}
                  aria-label="Log in to CampusMeals"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 px-5 py-2.5 bg-[#2D2D2D] hover:bg-[#1f1f1f] text-white rounded-full text-[16px] font-medium leading-6 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] transition-all duration-200 outline-none select-none hover:scale-[1.02] active:scale-[0.98]"
                  style={{ letterSpacing: '-0.4px' }}
                  aria-label="Start free trial"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      {/* Hero Section - Auto-Cycling iPhone Screens */}
      <div className="relative z-10">
        <div
          className="w-full overflow-visible relative"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'fit-content'
          }}
        >

          {/* Street Walking Effect - Specific pattern (COMMENTED OUT) */}

          {/* First Scroll (0-0.25): 3 overlapping rectangles from left/right */}
          {/* <motion.div
            className="absolute left-0 top-[30%] z-[3] pointer-events-none"
            style={{ x: overlap1X, scale: overlap1Scale }}
          >
            <div className="w-52 sm:w-60 md:w-68 h-64 sm:h-72 md:h-80 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300/90 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div>

          <motion.div
            className="absolute right-0 top-[30%] z-[4] pointer-events-none"
            style={{ x: overlap2X, scale: overlap2Scale }}
          >
            <div className="w-56 sm:w-64 md:w-72 h-68 sm:h-76 md:h-84 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-400/95 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div>

          <motion.div
            className="absolute left-0 top-[32%] z-[5] pointer-events-none"
            style={{ x: overlap3X, scale: overlap3Scale }}
          >
            <div className="w-48 sm:w-56 md:w-64 h-60 sm:h-68 md:h-76 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300/90 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div> */}

          {/* Second Scroll Phase 1 (0.25-0.42): 1 rectangle from right */}
          {/* <motion.div
            className="absolute right-0 top-[20%] z-[3] pointer-events-none"
            style={{ x: rightSingle, scale: rightSingleScale }}
          >
            <div className="w-54 sm:w-62 md:w-70 h-66 sm:h-74 md:h-82 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-400/95 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div> */}

          {/* Second Scroll Phase 2 (0.42-0.66): 2 rectangles from top at different heights */}
          {/* <motion.div
            className="absolute left-[25%] top-0 z-[3] pointer-events-none"
            style={{ y: top1Y, scale: top1Scale }}
          >
            <div className="w-52 sm:w-60 md:w-68 h-72 sm:h-80 md:h-88 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300/90 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div>

          <motion.div
            className="absolute right-[25%] top-0 z-[3] pointer-events-none"
            style={{ y: top2Y, scale: top2Scale }}
          >
            <div className="w-46 sm:w-54 md:w-62 h-58 sm:h-66 md:h-74 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-400/95 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div> */}

          {/* Third Scroll (0.66-1): 2 rectangles from bottom at different heights */}
          {/* <motion.div
            className="absolute left-[30%] bottom-0 z-[3] pointer-events-none"
            style={{ y: bottom1Y, scale: bottom1Scale }}
          >
            <div className="w-56 sm:w-64 md:w-72 h-76 sm:h-84 md:h-92 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300/90 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div>

          <motion.div
            className="absolute right-[30%] bottom-0 z-[3] pointer-events-none"
            style={{ y: bottom2Y, scale: bottom2Scale }}
          >
            <div className="w-48 sm:w-56 md:w-64 h-60 sm:h-68 md:h-76 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-400/95 rounded-2xl backdrop-blur-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-15" />
          </motion.div> */}


          <div
            className="flex-1 flex items-center justify-center relative z-10"
            style={{
              paddingTop: 'clamp(1.5rem, 3vh, 2rem)',
              paddingBottom: 'clamp(3rem, 5vh, 4rem)',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)'
            }}
          >

            {/* Hero Content - Industry standard flexbox centering */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-[1400px] gap-6 md:gap-8 lg:gap-16 relative z-10">
            {/* Left Side - Hero Text */}
            <div className="flex-1 w-full text-center lg:text-left">
              {/* Instagram-style Friend Avatars */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-8">
                <div className="flex -space-x-3">
                  {/* Avatar 1 - Pops at image index 0 */}
                  <motion.div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ring-2 ring-gray-200"
                    animate={{
                      scale: currentImageIndex === 0 ? 1.2 : 1,
                      y: currentImageIndex === 0 ? -12 : 0,
                      zIndex: currentImageIndex === 0 ? 10 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Student sharing meal on CampusMeals" className="w-full h-full object-cover" />
                  </motion.div>

                  {/* Avatar 2 - Pops at image index 1 */}
                  <motion.div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ring-2 ring-gray-200"
                    animate={{
                      scale: currentImageIndex === 1 ? 1.2 : 1,
                      y: currentImageIndex === 1 ? -12 : 0,
                      zIndex: currentImageIndex === 1 ? 10 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Student sharing meal on CampusMeals" className="w-full h-full object-cover" />
                  </motion.div>

                  {/* Avatar 3 - Pops at image index 2 */}
                  <motion.div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ring-2 ring-gray-200"
                    animate={{
                      scale: currentImageIndex === 2 ? 1.2 : 1,
                      y: currentImageIndex === 2 ? -12 : 0,
                      zIndex: currentImageIndex === 2 ? 10 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Student sharing meal on CampusMeals" className="w-full h-full object-cover" />
                  </motion.div>

                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ring-2 ring-gray-200">
                    <img src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="Student sharing meal on CampusMeals" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>+12</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))' }}>
                  12,847 meals shared today
                </p>
              </div>

              {/* Main headline with gradient */}
              <h1
                className="text-[3rem] leading-[0.9] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] mb-6 sm:mb-8 tracking-[-0.04em] font-bold"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))'
                }}
              >
                What to eat? Ask Campusmeals
              </h1>

              {/* Subheading with gradient */}
              <div className="relative mb-8 sm:mb-10">
                {/* Bright Blue Gradient Blur Background */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.25) 0%, rgba(96, 165, 250, 0.15) 25%, rgba(147, 197, 253, 0.08) 50%, transparent 70%)',
                    filter: 'blur(40px)',
                    zIndex: -1
                  }}
                />
                <p
                  className="relative text-base sm:text-lg md:text-xl lg:text-2xl leading-tight max-w-2xl mx-auto lg:mx-0 font-semibold text-gray-600"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                >
                  Discover trending restaurants, share your meals, and connect with students nearby.
                </p>
              </div>

              {/* CTA with enhanced glassmorphism */}
              <div className="flex flex-col items-stretch sm:items-center lg:items-start gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#2D2D2D] hover:bg-[#1f1f1f] text-white rounded-full text-sm sm:text-base font-semibold shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.35),0_15px_30px_rgba(0,0,0,0.25)] transition-all duration-300 outline-none select-none hover:scale-[1.02] active:scale-[0.98] min-h-[44px] sm:min-h-[52px]"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    Join Free with .edu Email
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <Link
                    href="#demo"
                    className="inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-white hover:bg-gray-50 text-[#1c1d22] rounded-full text-sm sm:text-base font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.06)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[44px] sm:min-h-[56px]"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    Book a Demo
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-center lg:text-left">Free forever • No credit card required</span>
                </p>
              </div>
            </div>

            {/* Right Side - iPhone with Pagination */}
            <div className="flex items-center justify-center lg:justify-end gap-3 md:gap-6 lg:gap-8 relative">
              <div className="relative w-[220px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px] z-10">
                <img
                  src="/iPhone 17.png"
                  alt="iPhone"
                  className="w-full h-auto relative z-20"
                  style={{
                    filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.15)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.1)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08))'
                  }}
                />
                {/* Screen Content with Animated Transitions */}
                <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[2.8rem] overflow-hidden z-10">
                  {imagesLoaded && images.map((image, index) => (
                    <motion.img
                      key={index}
                      src={image}
                      alt="App screen"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        willChange: 'opacity',
                        zIndex: index === currentImageIndex ? 2 : 1
                      }}
                      initial={false}
                      animate={{
                        opacity: index === currentImageIndex ? 1 : 0
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    />
                  ))}
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Indicators - Right Side */}
              <div className="hidden sm:flex flex-col gap-2 items-center justify-center">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'h-8 sm:h-10 bg-gray-900'
                        : 'h-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Banner - Universities */}
      <section
        className="relative z-10 w-full py-4 sm:py-5 md:py-6 lg:py-8"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)'
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto relative">
          {/* Edge Fade Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 lg:w-52 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 lg:w-52 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          <div className="space-y-2 sm:space-y-3 md:space-y-4" style={{ overflow: 'clip' }}>
            {/* First Row - Scrolls Left */}
            <div className="relative" style={{ overflow: 'clip' }}>
              <div className="flex w-max animate-scroll">
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14">
                  {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest', 'Columbia', 'Penn', 'Brown', 'Cornell'].map((uni, idx) => (
                    <span key={`row1-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 whitespace-nowrap">
                      {uni}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14" aria-hidden="true">
                  {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest', 'Columbia', 'Penn', 'Brown', 'Cornell'].map((uni, idx) => (
                    <span key={`row1-dup-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 whitespace-nowrap">
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Row - Scrolls Right */}
            <div className="relative" style={{ overflow: 'clip' }}>
              <div className="flex w-max animate-scroll-reverse">
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14">
                  {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                    <span key={`row2-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 whitespace-nowrap">
                      {uni}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14" aria-hidden="true">
                  {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                    <span key={`row2-dup-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 whitespace-nowrap">
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="about"
        className="relative z-10 w-full py-12 md:py-16 lg:py-24 overflow-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          paddingLeft: 'clamp(1rem, 4vw, 3rem)',
          paddingRight: 'clamp(1rem, 4vw, 3rem)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))'
              }}
            >
              How It Works
            </h2>
          </div>

          {/* Grid of 3 Large Video Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Container 1 - Share What You Eat */}
            <div className="relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex flex-col items-start justify-start p-6 sm:p-8 md:p-10">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-[95%] object-contain z-0"
              >
                <source src="/test (online-video-cutter.com).mp4" type="video/mp4" />
              </video>

              {/* Text Overlay */}
              <h3 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-[280px] sm:max-w-none">
                Share what you eat.
              </h3>

              {/* Paper Airplane Animation */}
              <div className="relative z-10 mt-auto w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">
                <Lottie
                  animationData={paperAirplaneAnimation}
                  loop={true}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Container 2 - Ask for Recommendations */}
            <div className="relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex flex-col items-start justify-start p-6 sm:p-8 md:p-10">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                aria-label="Demo video showing AI recommendations feature"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-[95%] object-contain z-0"
              >
                <source src="/test (online-video-cutter.com).mp4" type="video/mp4" />
              </video>

              {/* Text Overlay */}
              <h3 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-[280px] sm:max-w-none">
                Ask for recommendations.
              </h3>

              {/* Paper Airplane Animation */}
              <div className="relative z-10 mt-auto w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">
                <Lottie
                  animationData={paperAirplaneAnimation}
                  loop={true}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Container 3 - Track Your Goals */}
            <div className="relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex flex-col items-start justify-start p-6 sm:p-8 md:p-10">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                aria-label="Demo video showing nutrition tracking feature"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-[95%] object-contain z-0"
              >
                <source src="/test (online-video-cutter.com).mp4" type="video/mp4" />
              </video>

              {/* Text Overlay */}
              <h3 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-[280px] sm:max-w-none">
                Track your goals.
              </h3>

              {/* Paper Airplane Animation */}
              <div className="relative z-10 mt-auto w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">
                <Lottie
                  animationData={paperAirplaneAnimation}
                  loop={true}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Auto-Scrolling Carousel */}
      <section
        id="testimonials"
        className="relative z-10 w-full py-12 md:py-16 lg:py-24"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          paddingLeft: 'clamp(1rem, 4vw, 3rem)',
          paddingRight: 'clamp(1rem, 4vw, 3rem)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-12 md:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Students Love CampusMeals.
            </h2>
          </div>

          {/* Auto-Scrolling Testimonials Carousel */}
          <div className="relative mb-8 sm:mb-10 md:mb-12 py-8 -my-8" style={{ overflowX: 'clip', overflowY: 'visible' }}>
            {/* Edge Fade Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

            {/* Scrolling Container */}
            <div className="flex gap-6 animate-scroll-testimonials">
              {/* Duplicate testimonials for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6 flex-shrink-0">
                  {/* Testimonial 1 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "CampusMeals has completely changed how I discover food on campus. I never eat alone anymore!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Sarah Chen</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, Northwestern</p>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The AI recommendations are spot on. It's like having a personal food guide that knows exactly what I like."
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Marcus Johnson</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Sophomore, Stanford</p>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/569b3d16006db1361d8940a524993c52.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Best way to find out where everyone's eating. I've discovered so many hidden gems around campus."
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Emily Rodriguez</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, MIT</p>
                    </div>
                  </div>

                  {/* Testimonial 4 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/816230758da3649866b5f4f7c6110456.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Finally, a way to track my nutrition and connect with friends over food. It's brilliant!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Alex Kim</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Freshman, Duke</p>
                    </div>
                  </div>

                  {/* Testimonial 5 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                        J
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The social features make campus dining so much more fun. Love seeing what my friends are eating!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Jessica Park</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, Yale</p>
                    </div>
                  </div>

                  {/* Testimonial 6 */}
                  <div className="group relative backdrop-blur-xl bg-white/90 rounded-[28px] p-6 md:p-8 border border-gray-200/20 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.12),0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white shadow-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                        M
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "As an international student, CampusMeals helped me discover authentic food from my culture. Game changer!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">Miguel Santos</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, UC Berkeley</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 bg-[#2D2D2D] hover:bg-[#1f1f1f] text-white rounded-full text-sm sm:text-base font-semibold shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.35),0_15px_30px_rgba(0,0,0,0.25)] transition-all duration-300 outline-none select-none hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Join CampusMeals Today
            </button>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section - 2026 Design */}
      <section
        id="features"
        className="relative z-10 w-full py-12 md:py-16 lg:py-24 overflow-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          paddingLeft: 'clamp(1rem, 4vw, 3rem)',
          paddingRight: 'clamp(1rem, 4vw, 3rem)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
              One Platform for All Your Campus Meals
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Share what you eat, discover trending spots, and connect with your campus community.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-[200px] sm:auto-rows-[220px] md:auto-rows-[240px] lg:auto-rows-[280px]">
            {/* Card 1 - Source Creators (Tall) */}
            <div className="group lg:row-span-2 relative rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 p-6 md:p-8" style={{ backgroundColor: '#f3f5f7' }}>
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-[32px] leading-tight">
                    <span className="font-bold text-gray-900">Source Creators.</span>
                    <span className="font-normal text-gray-400"> Reach thousands of creators instantly.</span>
                  </h3>
                </div>

                {/* Floating Cards Container */}
                <div className="flex-1 relative overflow-visible">
                  {/* Background Card - Lourdrick */}
                  <div className="absolute right-[-10px] top-0 bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 z-10" style={{ width: '220px' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Lourdrick" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-[15px]">Lourdrick Vasote</p>
                        <p className="text-gray-400 text-sm">Stanford University</p>
                      </div>
                    </div>
                  </div>

                  {/* Boston MA pill */}
                  <div className="absolute right-0 top-[100px] bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 py-2 flex items-center gap-2 z-10">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="10" r="3" strokeWidth={2}/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4-4-8-7.5-8-11a8 8 0 1116 0c0 3.5-4 7-8 11z" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">Boston, MA</span>
                  </div>

                  {/* Main Card - Danita */}
                  <div className="absolute left-[-10px] top-16 bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-5 z-20" style={{ width: '280px' }}>
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Danita" className="w-full h-full object-cover" />
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-gray-900 text-lg">Danita Nagara</p>
                        <p className="text-gray-400 text-[15px] leading-snug">San Diego State University</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2.5 mb-5">
                      <span className="px-4 py-1.5 rounded-full border-2 border-green-400 text-green-500 text-sm font-medium">Marketing</span>
                      <span className="px-4 py-1.5 rounded-full border-2 border-blue-400 text-blue-500 text-sm font-medium">Senior</span>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center gap-2">
                      {/* Social Icons */}
                      <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center">
                        <svg className="w-[18px] h-[18px] text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                        </svg>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center">
                        <svg className="w-[18px] h-[18px] text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center">
                        <svg className="w-[18px] h-[18px] text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-2 rounded-full ml-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="10" r="3" strokeWidth={2}/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4-4-8-7.5-8-11a8 8 0 1116 0c0 3.5-4 7-8 11z" />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">Peoria, AZ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Universities with Moving Pills (Wide & Tall) */}
            <div className="group lg:col-span-2 lg:row-span-2 relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 p-6 md:p-8">
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    5,000+ Students
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                    Actively eating
                  </p>
                </div>

                {/* Moving Pills Container - Fill entire space */}
                <div className="flex-1 flex flex-col justify-evenly overflow-hidden -mx-6 md:-mx-8">
                  {/* Row 1 - Scrolls Left */}
                  <div className="relative flex">
                    <div className="flex animate-scroll gap-2">
                      {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest'].map((uni, idx) => (
                        <div
                          key={`pill-row1-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll gap-2" aria-hidden="true">
                      {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest'].map((uni, idx) => (
                        <div
                          key={`pill-row1-dup-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2 - Scrolls Right */}
                  <div className="relative flex">
                    <div className="flex animate-scroll-reverse gap-2">
                      {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard'].map((uni, idx) => (
                        <div
                          key={`pill-row2-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll-reverse gap-2" aria-hidden="true">
                      {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard'].map((uni, idx) => (
                        <div
                          key={`pill-row2-dup-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 3 - Scrolls Left */}
                  <div className="relative flex">
                    <div className="flex animate-scroll gap-2">
                      {['Columbia', 'Penn', 'Brown', 'Cornell', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                        <div
                          key={`pill-row3-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll gap-2" aria-hidden="true">
                      {['Columbia', 'Penn', 'Brown', 'Cornell', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                        <div
                          key={`pill-row3-dup-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 4 - Scrolls Right */}
                  <div className="relative flex">
                    <div className="flex animate-scroll-reverse gap-2">
                      {['Boston U', 'Northeastern', 'Tufts', 'UCLA', 'Michigan', 'UVA', 'W&M', 'UChicago'].map((uni, idx) => (
                        <div
                          key={`pill-row4-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll-reverse gap-2" aria-hidden="true">
                      {['Boston U', 'Northeastern', 'Tufts', 'UCLA', 'Michigan', 'UVA', 'W&M', 'UChicago'].map((uni, idx) => (
                        <div
                          key={`pill-row4-dup-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 5 - Scrolls Left */}
                  <div className="relative flex">
                    <div className="flex animate-scroll gap-2">
                      {['Texas A&M', 'UNC', 'UGA', 'Florida', 'Alabama', 'LSU', 'Auburn', 'Tennessee'].map((uni, idx) => (
                        <div
                          key={`pill-row5-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll gap-2" aria-hidden="true">
                      {['Texas A&M', 'UNC', 'UGA', 'Florida', 'Alabama', 'LSU', 'Auburn', 'Tennessee'].map((uni, idx) => (
                        <div
                          key={`pill-row5-dup-${idx}`}
                          className="flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 backdrop-blur-md bg-white/30 rounded-full border border-gray-200/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-white/50 hover:border-gray-200/30 transition-all duration-300"
                        >
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap">
                            {uni}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Track Analytics */}
            <div className="group lg:col-span-2 relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 p-6 md:p-8">
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Track Performance.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  See your meal views, engagement, and connections in real time.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4 sm:gap-6 md:gap-8 mt-auto">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">14.9M</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">2.0M</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">0.8M</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">433K</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Comments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 - Connect with Students */}
            <div className="group lg:col-span-1 relative overflow-hidden backdrop-blur-xl bg-white/70 rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300 p-6 md:p-8">
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Connect with Students.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Find students eating at the same spots.
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                    <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                    <img src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                    <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full backdrop-blur-lg bg-gray-900/90 text-white font-bold text-sm sm:text-base md:text-lg shadow-lg border border-gray-200/20 flex-shrink-0">
                    +42
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 w-full py-10 sm:py-12 border-t border-gray-200/30"
        style={{
          paddingLeft: 'clamp(1rem, 4vw, 3rem)',
          paddingRight: 'clamp(1rem, 4vw, 3rem)'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-gray-500 text-xs sm:text-sm tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              © 2026 CampusMeals. All rights reserved.
            </div>
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-gray-600">
              <a href="#" className="text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Privacy</a>
              <a href="#" className="text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Terms</a>
              <a href="#" className="text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
