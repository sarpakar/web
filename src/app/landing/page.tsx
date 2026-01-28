'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import { Particles } from '@/components/ui/particles';
import { RainbowButton } from '@/components/ui/rainbow-button';
import dynamic from 'next/dynamic';

// Dynamic import for Globe to avoid SSR issues
const Globe = dynamic(() => import('@/components/ui/Globe'), { ssr: false });

import { Ripple } from '@/registry/magicui/ripple';


// CM Logo Component
const CMlogo = ({ className = "", size = 40, style = {} }: { className?: string; size?: number; style?: React.CSSProperties }) => (
  <img src="/logo.png" alt="CampusMeals" width={size} height={size * 0.6} className={className} style={style} />
);

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ref for the dark section scroll tracking
  const darkSectionRef = useRef<HTMLDivElement>(null);


  // Scroll-based background transition - Natural, organic feel
  const { scrollYProgress: rawProgress } = useScroll({
    target: darkSectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth the scroll progress with spring physics for natural, organic feel
  // This prevents the mechanical 1:1 mapping and adds physical inertia
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform smoothed progress: longer, smoother transition
  // Wider keyframes [0.12, 0.28] for buttery smooth color change
  const darkBgOpacity = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], [0, 0, 1, 1, 0, 0]);

  // Card and text color transitions - smooth gradual change with improved dark mode hierarchy
  const cardBgColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(250,250,250,0.8)', 'rgba(250,250,250,0.8)', 'rgba(18,18,18,0.95)', 'rgba(18,18,18,0.95)', 'rgba(250,250,250,0.8)', 'rgba(250,250,250,0.8)']);
  const cardBorderColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(229,229,229,0.6)', 'rgba(229,229,229,0.6)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.12)', 'rgba(229,229,229,0.6)', 'rgba(229,229,229,0.6)']);
  const headingColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['#000000', '#000000', '#f5f5f7', '#f5f5f7', '#000000', '#000000']);
  const paragraphColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(107,114,128)', 'rgb(107,114,128)', 'rgb(168,168,176)', 'rgb(168,168,176)', 'rgb(107,114,128)', 'rgb(107,114,128)']);

  // Navbar color transitions for dark mode
  const navBgColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)']);
  const navTextColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['#000000', '#000000', '#ffffff', '#ffffff', '#000000', '#000000']);
  const navBorderColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(243,244,246,1)', 'rgba(243,244,246,1)', 'rgba(55,65,81,1)', 'rgba(55,65,81,1)', 'rgba(243,244,246,1)', 'rgba(243,244,246,1)']);

  // iPhone shadow transitions - more visible on dark background
  const iphoneShadow1 = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], [
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)'
  ]);
  const iphoneShadow2 = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], [
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
    'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)'
  ]);

  // Section text color transitions for other sections visible during dark mode
  const sectionHeadingColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(17,24,39)', 'rgb(17,24,39)', 'rgb(255,255,255)', 'rgb(255,255,255)', 'rgb(17,24,39)', 'rgb(17,24,39)']);
  const sectionSubheadingColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(75,85,99)', 'rgb(75,85,99)', 'rgb(156,163,175)', 'rgb(156,163,175)', 'rgb(75,85,99)', 'rgb(75,85,99)']);
  const fadeFromColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(255,255,255)', 'rgb(255,255,255)', 'rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(255,255,255)', 'rgb(255,255,255)']);

  // Blur intensity - use smoothProgress with instant snap keyframes for perfect sync
  // Blur off exactly when colors start, back on exactly when colors finish
  const blurAmount = useTransform(
    smoothProgress,
    [0, 0.119, 0.12, 0.28, 0.281, 0.719, 0.72, 0.88, 0.881, 1],
    [24, 24, 0, 0, 24, 24, 0, 0, 24, 24]
  );
  const navBlurFilter = useMotionTemplate`blur(${blurAmount}px)`;
  const cardBlurAmount = useTransform(
    smoothProgress,
    [0, 0.119, 0.12, 0.28, 0.281, 0.719, 0.72, 0.88, 0.881, 1],
    [12, 12, 0, 0, 12, 12, 0, 0, 12, 12]
  );
  const cardBlurFilter = useMotionTemplate`blur(${cardBlurAmount}px)`;

  // Fade overlay opacity - use smoothProgress but with instant snap (no gray interpolation)
  // Hide exactly when colors start changing, show exactly when colors finish
  const fadeOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.119, 0.12, 0.28, 0.281, 0.719, 0.72, 0.88, 0.881, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
  );

  // Logo invert filter for dark mode - makes logo white
  const logoInvert = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], [0, 0, 1, 1, 0, 0]);
  const logoFilter = useMotionTemplate`invert(${logoInvert})`;

  // Parallax movement for floating iPhones - moves with scroll
  // iPhone 1 (front, closer) - larger parallax movement
  const iphone1Y = useTransform(smoothProgress, [0, 0.5, 1], [80, 0, -80]);
  // iPhone 2 (back, further) - different parallax speed for depth
  const iphone2Y = useTransform(smoothProgress, [0, 0.5, 1], [120, 0, -120]);


  // Static images array to prevent recreation on every render
  const images = ['/img/IMG_6866.PNG', '/img/IMG_6867.PNG', '/img/IMG_6868.PNG'];

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
      className="min-h-screen bg-white scroll-smooth relative overflow-x-hidden w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20"
      style={{ clipPath: 'inset(0)', maxWidth: '100%' }}
    >

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
      >
        {/* Nav blur with gradual fade - adapts to dark mode */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            backgroundColor: navBgColor,
            height: '120px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            backdropFilter: navBlurFilter,
            WebkitBackdropFilter: navBlurFilter,
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
                <motion.div style={{ filter: logoFilter, WebkitFilter: logoFilter }}>
                  <CMlogo size={48} className="w-12 h-12" />
                </motion.div>
              </button>

              {/* Center: Navigation - Absolute center */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                <motion.a href="#about" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  About
                </motion.a>
                <motion.a href="/landing/communities" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  Communities
                </motion.a>
                <motion.a href="/landing/pricing" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  Pricing
                </motion.a>
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
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center"
                style={{ color: navTextColor }}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Adapts to dark mode */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t px-6"
            style={{
              backgroundColor: navBgColor,
              borderColor: navBorderColor,
            }}
          >
            <div className="py-4 space-y-1">
              <motion.a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                About
              </motion.a>
              <motion.a
                href="/landing/communities"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                Communities
              </motion.a>
              <motion.a
                href="/landing/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                Pricing
              </motion.a>
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
          </motion.div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14" />

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
              paddingBottom: 'clamp(3rem, 5vh, 4rem)'
            }}
          >

            {/* Hero Content - Flighty-style centered layout */}
            <div className="flex flex-col items-center justify-center w-full max-w-[1000px] relative z-10">

              {/* Promo pill */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full mb-6 transition-colors"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                <span className="text-sm font-medium text-blue-600">Students get 6 months free</span>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Main headline - clean, bold, centered */}
              <motion.h1
                className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] mb-6 tracking-[-0.02em] font-bold text-center"
                style={{ color: navTextColor }}
              >
                Discover what to eat with{' '}
                <span className="relative inline-block isolate">
                  {/* Blue glow effect behind text */}
                  <span
                    className="absolute inset-0 -inset-x-4 -inset-y-2 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(96, 165, 250, 0.15) 40%, transparent 70%)',
                      filter: 'blur(20px)',
                      zIndex: -1,
                    }}
                  />
                  <span className="relative z-10">Campusmeals.</span>
                </span>
              </motion.h1>

              {/* Description - centered, gray */}
              <motion.p
                className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-2xl mb-8"
                style={{ color: paragraphColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                The app that shows you what your friends are eating nearby.
              </motion.p>

              {/* Social proof - Friend avatars centered with animation */}
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="flex -space-x-2">
                  <motion.div
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm overflow-hidden"
                    animate={{
                      scale: currentImageIndex === 0 ? 1.2 : 1,
                      y: currentImageIndex === 0 ? -8 : 0,
                      zIndex: currentImageIndex === 0 ? 10 : 1
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="User" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm overflow-hidden"
                    animate={{
                      scale: currentImageIndex === 1 ? 1.2 : 1,
                      y: currentImageIndex === 1 ? -8 : 0,
                      zIndex: currentImageIndex === 1 ? 10 : 1
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="User" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm overflow-hidden"
                    animate={{
                      scale: currentImageIndex === 2 ? 1.2 : 1,
                      y: currentImageIndex === 2 ? -8 : 0,
                      zIndex: currentImageIndex === 2 ? 10 : 1
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="User" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm overflow-hidden">
                    <img src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="text-sm text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  1,200+ students
                </p>
              </div>


              {/* iPhone - Centered below text like Flighty */}
              <div className="relative w-[260px] sm:w-[280px] md:w-[320px] lg:w-[340px] z-10">
                <img
                  src="/iPhone 17mockup.png"
                  alt="iPhone"
                  className="w-full h-auto relative z-20"
                  style={{
                    filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.15)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.1))'
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
                      <div className="w-5 h-5 border-[1.5px] border-gray-200 border-t-gray-600 rounded-full animate-premium-spin animate-loading-fade-in" />
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Indicators - Below iPhone */}
              <div className="flex gap-2 items-center justify-center mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-8 h-1.5 bg-gray-900'
                        : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Banner - Universities */}
      <section
        className="relative z-10 w-full py-4 sm:py-5 md:py-6 lg:py-8"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto relative">
          {/* Edge Fade Overlays - Adapt to dark mode, hidden during transition */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 lg:w-52 z-20 pointer-events-none"
            style={{ background: useMotionTemplate`linear-gradient(to right, ${fadeFromColor}, transparent)`, opacity: fadeOverlayOpacity }}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 lg:w-52 z-20 pointer-events-none"
            style={{ background: useMotionTemplate`linear-gradient(to left, ${fadeFromColor}, transparent)`, opacity: fadeOverlayOpacity }}
          />

          <div className="space-y-2 sm:space-y-3 md:space-y-4" style={{ overflow: 'clip' }}>
            {/* First Row - Scrolls Left */}
            <div className="relative" style={{ overflow: 'clip' }}>
              <div className="flex w-max animate-scroll">
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14">
                  {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest', 'Columbia', 'Penn', 'Brown', 'Cornell'].map((uni, idx) => (
                    <motion.span key={`row1-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap" style={{ color: navTextColor }}>
                      {uni}
                    </motion.span>
                  ))}
                </div>
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14" aria-hidden="true">
                  {['Northwestern', 'Rice', 'Stanford', 'Spelman', 'SMU', 'Emory', 'Notre Dame', 'Wake Forest', 'Columbia', 'Penn', 'Brown', 'Cornell'].map((uni, idx) => (
                    <motion.span key={`row1-dup-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap" style={{ color: navTextColor }}>
                      {uni}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Row - Scrolls Right */}
            <div className="relative" style={{ overflow: 'clip' }}>
              <div className="flex w-max animate-scroll-reverse">
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14">
                  {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                    <motion.span key={`row2-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap" style={{ color: navTextColor }}>
                      {uni}
                    </motion.span>
                  ))}
                </div>
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14" aria-hidden="true">
                  {['UC Berkeley', 'MIT', 'Princeton', 'Tulane', 'Georgetown', 'Duke', 'Yale', 'Howard', 'Dartmouth', 'Vanderbilt', 'USC', 'NYU'].map((uni, idx) => (
                    <motion.span key={`row2-dup-${idx}`} className="flex-shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap" style={{ color: navTextColor }}>
                      {uni}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating iPhones Section - Flighty Style with Full Page Black Background Transition */}
      <div ref={darkSectionRef} className="relative">
        {/* Full-width Black Background Overlay */}
        <motion.div
          className="fixed inset-0 bg-[#0a0a0a] pointer-events-none"
          style={{
            opacity: darkBgOpacity,
            zIndex: 0,
          }}
        />

        {/* Ambient glow effects for dark mode */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{
            opacity: darkBgOpacity,
            zIndex: 1,
            background: `
              radial-gradient(ellipse 100% 50% at 50% -20%, rgba(147, 197, 253, 0.08) 0%, transparent 50%)
            `,
          }}
        />

        <section
          className="relative z-10 w-full py-16 md:py-24 lg:py-32"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
          }}
        >
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            {/* Dedicated Container - Flighty Style Card */}
            <motion.div
              className="relative rounded-[40px] md:rounded-[56px] border overflow-hidden"
              style={{
                backgroundColor: cardBgColor,
                borderColor: cardBorderColor,
                backdropFilter: cardBlurFilter,
                WebkitBackdropFilter: cardBlurFilter,
                boxShadow: useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], [
                  '0 25px 100px -12px rgba(0, 0, 0, 0.25)',
                  '0 25px 100px -12px rgba(0, 0, 0, 0.25)',
                  '0 25px 100px -12px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(147, 197, 253, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                  '0 25px 100px -12px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(147, 197, 253, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                  '0 25px 100px -12px rgba(0, 0, 0, 0.25)',
                  '0 25px 100px -12px rgba(0, 0, 0, 0.25)'
                ]),
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                {/* Left Content */}
                <div className="flex flex-col justify-center p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20">
                  <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-bold leading-[1.08] tracking-tight mb-5"
                    style={{ color: headingColor }}
                  >
                    Never wonder, &ldquo;what should I eat?&rdquo; ever again.
                  </motion.h2>
                  <motion.p
                    className="text-lg sm:text-xl leading-relaxed max-w-md"
                    style={{ color: paragraphColor }}
                  >
                    Choose who you want to share your meals with. They can see what you&apos;re eating, where you&apos;re dining, get recommendations, and more.
                  </motion.p>
                </div>

              {/* Right - Floating iPhones Container - Exact Flighty Layout */}
              <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-visible">
                {/* iPhone 1 - Front/Bottom-Left - Main Focus with Parallax */}
                <motion.div
                  className="absolute left-[8%] sm:left-[12%] md:left-[15%] bottom-[8%] sm:bottom-[10%] z-20"
                  initial={{ opacity: 0, rotate: -8 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ y: iphone1Y }}
                >
                  <div
                    className="relative w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]"
                    style={{ transform: 'rotate(-6deg)' }}
                  >
                    <img
                      src="/iPhone 17mockup.png"
                      alt="iPhone"
                      className="w-full h-auto relative z-10 drop-shadow-2xl"
                    />
                    {/* Screen Content */}
                    <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[2.5rem] overflow-hidden z-0">
                      <img
                        src="/img/IMG_6866.PNG"
                        alt="App screen"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Soft Drop Shadow - Adapts to dark mode */}
                    <motion.div
                      className="absolute -bottom-8 left-1/2 w-[75%] h-[40px]"
                      style={{
                        transform: 'translateX(-50%)',
                        background: iphoneShadow1,
                        filter: 'blur(12px)',
                      }}
                    />
                  </div>
                </motion.div>

                {/* iPhone 2 - Back/Top-Right - Overlapping & Extending with Parallax */}
                <motion.div
                  className="absolute right-[-12%] sm:right-[-8%] md:right-[-5%] lg:right-[-10%] top-[5%] sm:top-[8%] z-10"
                  initial={{ opacity: 0, rotate: 12 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ y: iphone2Y }}
                >
                  <div
                    className="relative w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]"
                    style={{ transform: 'rotate(10deg)' }}
                  >
                    <img
                      src="/iPhone 17mockup.png"
                      alt="iPhone"
                      className="w-full h-auto relative z-10 drop-shadow-2xl"
                    />
                    {/* Screen Content */}
                    <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[2.5rem] overflow-hidden z-0">
                      <img
                        src="/img/IMG_6867.PNG"
                        alt="App screen"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Soft Drop Shadow - Adapts to dark mode */}
                    <motion.div
                      className="absolute -bottom-10 left-1/2 w-[70%] h-[35px]"
                      style={{
                        transform: 'translateX(-50%)',
                        background: iphoneShadow2,
                        filter: 'blur(14px)',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>

      {/* Pricing Bento Grid Section - 2026 Design */}
      <section
        id="features"
        className="relative z-10 w-full py-12 md:py-16 lg:py-24 overflow-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
              style={{ color: sectionHeadingColor }}
            >
              One Platform for All Your Campus Meals
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl max-w-3xl"
              style={{ color: sectionSubheadingColor }}
            >
              Share what you eat, discover trending spots, and connect with your campus community.
            </motion.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-[200px] sm:auto-rows-[220px] md:auto-rows-[240px] lg:auto-rows-[280px]">
            {/* Card 1 - Discover Friends' Meals (Tall) */}
            <div className="group lg:row-span-2 relative rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 p-6 md:p-8" style={{ backgroundColor: '#f3f5f7' }}>
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-[32px] leading-tight">
                    <span className="font-bold text-gray-900">See What Friends Eat.</span>
                    <span className="font-normal text-gray-400"> Discover meals from your campus community.</span>
                  </h3>
                </div>

                {/* Floating Cards Container */}
                <div className="flex-1 relative overflow-visible">
                  {/* Background Card - Friend's meal post */}
                  <div className="absolute right-[-10px] top-0 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 z-10" style={{ width: '200px' }}>
                    <img src="/bagel.jpg" alt="Meal" className="w-full h-32 rounded-2xl mb-3 object-cover" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Mia Chen</p>
                        <p className="text-gray-500 text-xs">Dining Hall • 2h ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Card - Meal Post */}
                  <div className="absolute left-[-10px] top-16 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 z-20" style={{ width: '260px' }}>
                    <img src="/burger.jpg" alt="Meal" className="w-full h-36 rounded-2xl mb-3 object-cover" />
                    {/* User info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-[15px]">Noah Rivera</p>
                        <p className="text-gray-500 text-xs">NYU • Just now</p>
                      </div>
                    </div>

                    {/* Bottom row - engagement */}
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1 relative">
                        {/* Exploding hearts */}
                        <div className="absolute -top-1 left-0">
                          <svg className="w-3 h-3 text-red-500 absolute animate-heart-burst-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <svg className="w-2 h-2 text-pink-500 absolute animate-heart-burst-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <svg className="w-2.5 h-2.5 text-red-400 absolute animate-heart-burst-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <svg className="w-2 h-2 text-rose-500 absolute animate-heart-burst-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <svg className="w-1.5 h-1.5 text-red-300 absolute animate-heart-burst-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <svg className="w-2 h-2 text-rose-400 absolute animate-heart-burst-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-xs font-medium">234</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-xs font-medium">18</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium">0.3 mi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Track Analytics with EKG Line Animation */}
            <div className="group lg:col-span-2 relative overflow-hidden rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 p-6 md:p-8" style={{ backgroundColor: '#f8fafc' }}>
              {/* Background Ripple */}
              <Ripple />

              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-2xl sm:text-3xl md:text-[32px] leading-tight mb-4">
                  <span className="font-bold text-gray-900">Track Performance.</span>
                  <span className="font-normal text-gray-400"> See your meal views and engagement in real time.</span>
                </h3>

                {/* Simple Sine Wave Line & Moving Dot */}
                <div className="flex-1 relative min-h-[160px] flex items-center">
                  {/* SVG with static sine wave and animated dot */}
                  <svg className="absolute w-full h-full z-10" viewBox="0 0 500 120" preserveAspectRatio="none">
                    {/* Static black smooth sine wave with one peak */}
                    <path
                      d="M0,90 C80,90 120,20 250,20 C380,20 420,90 500,90"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Moving dot - smaller */}
                    <circle r="5" fill="#1a1a1a">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path="M0,90 C80,90 120,20 250,20 C380,20 420,90 500,90"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                        keyTimes="0; 0.5; 1"
                      />
                    </circle>
                  </svg>

                  {/* Restaurant Images that reveal as dot passes */}
                  <div className="absolute left-[8%] top-[20%] w-14 h-14 rounded-2xl overflow-hidden shadow-xl border-2 border-white animate-reveal-1">
                    <img src="/img/IMG_6866.PNG" alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute left-[35%] bottom-[5%] w-12 h-12 rounded-2xl overflow-hidden shadow-xl border-2 border-white animate-reveal-2">
                    <img src="/img/IMG_6867.PNG" alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute right-[30%] top-[15%] w-11 h-11 rounded-2xl overflow-hidden shadow-xl border-2 border-white animate-reveal-3">
                    <img src="/img/IMG_6868.PNG" alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute right-[8%] top-[25%] rounded-2xl overflow-hidden shadow-xl border-2 border-white animate-reveal-4" style={{ width: '52px', height: '52px' }}>
                    <img src="/img/IMG_6866.PNG" alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">14.9M</div>
                    <div className="text-[10px] sm:text-xs text-green-500 font-medium">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">2.0M</div>
                    <div className="text-[10px] sm:text-xs text-orange-500 font-medium">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">0.8M</div>
                    <div className="text-[10px] sm:text-xs text-red-500 font-medium">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">433K</div>
                    <div className="text-[10px] sm:text-xs text-purple-500 font-medium">Comments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Community Tweet */}
            <div className="group relative overflow-hidden rounded-[24px] border border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300 bg-white p-5 md:p-6">
              <div className="relative z-10 h-full flex flex-col">
                {/* Tweet Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                      <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900 text-[15px]">Sarah</span>
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-sm">@sarahfoodie</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                {/* Tweet Content */}
                <p className="text-gray-900 text-[15px] leading-relaxed flex-1">
                  just discovered @campusmeals and it&apos;s literally changed how i find food on campus!! seeing what my friends are eating is so fun
                </p>
                {/* Tweet Footer */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">2:34 PM · Jan 15, 2026</span>
                </div>
              </div>
            </div>

            {/* Card 4 - Global Campus Network with Globe */}
            <div className="group relative overflow-hidden rounded-[24px] border border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all duration-300 p-5 md:p-6" style={{ backgroundColor: '#0a0a0a' }}>
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Connect Across Campuses.
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">
                  Students at 20+ universities sharing meals.
                </p>
                {/* Globe Container */}
                <div className="flex-1 relative flex items-center justify-center min-h-[120px]">
                  <Globe className="w-full max-w-[160px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 w-full py-10 sm:py-12 border-t"
        style={{ borderColor: navBorderColor }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <motion.div
              className="text-xs sm:text-sm tracking-wide"
              style={{ color: paragraphColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              © 2026 CampusMeals. All rights reserved.
            </motion.div>
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <motion.a href="#" className="text-xs sm:text-sm font-medium hover:opacity-70 transition-opacity duration-200" style={{ color: sectionSubheadingColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Privacy</motion.a>
              <motion.a href="#" className="text-xs sm:text-sm font-medium hover:opacity-70 transition-opacity duration-200" style={{ color: sectionSubheadingColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Terms</motion.a>
              <motion.a href="#" className="text-xs sm:text-sm font-medium hover:opacity-70 transition-opacity duration-200" style={{ color: sectionSubheadingColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Contact</motion.a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
