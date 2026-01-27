'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import { Particles } from '@/components/ui/particles';
import { RainbowButton } from '@/components/ui/rainbow-button';

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

  // Card and text color transitions - smooth gradual change
  const cardBgColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(250,250,250,0.8)', 'rgba(250,250,250,0.8)', 'rgba(30,30,30,0.9)', 'rgba(30,30,30,0.9)', 'rgba(250,250,250,0.8)', 'rgba(250,250,250,0.8)']);
  const cardBorderColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(229,229,229,0.6)', 'rgba(229,229,229,0.6)', 'rgba(60,60,60,0.6)', 'rgba(60,60,60,0.6)', 'rgba(229,229,229,0.6)', 'rgba(229,229,229,0.6)']);
  const headingColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['#000000', '#000000', '#ffffff', '#ffffff', '#000000', '#000000']);
  const paragraphColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(107,114,128)', 'rgb(107,114,128)', 'rgb(156,163,175)', 'rgb(156,163,175)', 'rgb(107,114,128)', 'rgb(107,114,128)']);

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

  // Testimonial card color transitions
  const testimonialCardBg = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.9)', 'rgba(38,38,38,0.9)', 'rgba(38,38,38,0.9)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.9)']);
  const testimonialBorderColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgba(229,231,235,0.2)', 'rgba(229,231,235,0.2)', 'rgba(75,85,99,0.3)', 'rgba(75,85,99,0.3)', 'rgba(229,231,235,0.2)', 'rgba(229,231,235,0.2)']);
  const testimonialTextColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(55,65,81)', 'rgb(55,65,81)', 'rgb(209,213,219)', 'rgb(209,213,219)', 'rgb(55,65,81)', 'rgb(55,65,81)']);
  const testimonialNameColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(17,24,39)', 'rgb(17,24,39)', 'rgb(255,255,255)', 'rgb(255,255,255)', 'rgb(17,24,39)', 'rgb(17,24,39)']);
  const testimonialRoleColor = useTransform(smoothProgress, [0, 0.12, 0.28, 0.72, 0.88, 1], ['rgb(107,114,128)', 'rgb(107,114,128)', 'rgb(156,163,175)', 'rgb(156,163,175)', 'rgb(107,114,128)', 'rgb(107,114,128)']);

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

  // Nav blur overlay opacity - hide completely during transitions to avoid artifacts
  const navBlurOpacity = useTransform(
    smoothProgress,
    [0, 0.119, 0.12, 0.28, 0.281, 0.719, 0.72, 0.88, 0.881, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
  );

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
        {/* Nav blur with gradual fade - adapts to dark mode - blur disabled during transitions */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            backgroundColor: navBgColor,
            height: '120px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            backdropFilter: navBlurFilter,
            WebkitBackdropFilter: navBlurFilter,
            opacity: navBlurOpacity,
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
                <motion.a href="#features" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  Features
                </motion.a>
                <motion.a href="#about" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  About
                </motion.a>
                <motion.a href="#testimonials" className="text-[15px] font-medium hover:opacity-60 transition-opacity" style={{ color: navTextColor }}>
                  Community
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
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                Features
              </motion.a>
              <motion.a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                About
              </motion.a>
              <motion.a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[15px] font-medium hover:opacity-60 transition-opacity"
                style={{ color: navTextColor }}
              >
                Community
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
                  src="/iPhone 17.png"
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
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
          className="fixed inset-0 bg-black pointer-events-none"
          style={{
            opacity: darkBgOpacity,
            zIndex: 0,
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
              className="relative rounded-[40px] md:rounded-[56px] border shadow-[0_20px_80px_rgba(255,255,255,0.06),0_8px_32px_rgba(255,255,255,0.04)] overflow-hidden"
              style={{
                backgroundColor: cardBgColor,
                borderColor: cardBorderColor,
                backdropFilter: cardBlurFilter,
                WebkitBackdropFilter: cardBlurFilter,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                {/* Left Content */}
                <div className="flex flex-col justify-center p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20">
                  <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-bold leading-[1.08] tracking-tight mb-5"
                    style={{ color: headingColor }}
                  >
                    Never wonder, "what should I eat?" ever again.
                  </motion.h2>
                  <motion.p
                    className="text-lg sm:text-xl leading-relaxed max-w-md"
                    style={{ color: paragraphColor }}
                  >
                    Choose who you want to share your meals with. They can see what you're eating, where you're dining, get recommendations, and more.
                  </motion.p>
                </div>

              {/* Right - Floating iPhones Container - Exact Flighty Layout */}
              <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-visible">
                {/* iPhone 1 - Front/Bottom-Left - Main Focus */}
                <motion.div
                  className="absolute left-[8%] sm:left-[12%] md:left-[15%] bottom-[8%] sm:bottom-[10%] z-20"
                  initial={{ opacity: 0, y: 80, rotate: -8 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="relative w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]"
                    style={{ transform: 'rotate(-6deg)' }}
                  >
                    <img
                      src="/iPhone 17.png"
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

                {/* iPhone 2 - Back/Top-Right - Overlapping & Extending */}
                <motion.div
                  className="absolute right-[-12%] sm:right-[-8%] md:right-[-5%] lg:right-[-10%] top-[5%] sm:top-[8%] z-10"
                  initial={{ opacity: 0, y: 80, rotate: 12 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="relative w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]"
                    style={{ transform: 'rotate(10deg)' }}
                  >
                    <img
                      src="/iPhone 17.png"
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

      {/* Testimonials Section - Auto-Scrolling Carousel */}
      <section
        id="testimonials"
        className="relative z-10 w-full py-12 md:py-16 lg:py-24"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ color: sectionHeadingColor }}
            >
              Students Love CampusMeals.
            </motion.h2>
          </div>

          {/* Auto-Scrolling Testimonials Carousel */}
          <div className="relative mb-8 sm:mb-10 md:mb-12 py-8 -my-8" style={{ overflowX: 'clip', overflowY: 'visible' }}>
            {/* Edge Fade Overlays - Adapt to dark mode, hidden during transition */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 z-20 pointer-events-none"
              style={{
                background: useMotionTemplate`linear-gradient(to right, ${fadeFromColor}, transparent)`,
                opacity: fadeOverlayOpacity
              }}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 z-20 pointer-events-none"
              style={{
                background: useMotionTemplate`linear-gradient(to left, ${fadeFromColor}, transparent)`,
                opacity: fadeOverlayOpacity
              }}
            />

            {/* Scrolling Container */}
            <div className="flex gap-6 animate-scroll-testimonials">
              {/* Duplicate testimonials for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6 flex-shrink-0">
                  {/* Testimonial 1 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
                      />
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "CampusMeals has completely changed how I discover food on campus. I never eat alone anymore!"
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Sarah Chen</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, Northwestern</motion.p>
                    </div>
                  </motion.div>

                  {/* Testimonial 2 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
                      />
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The AI recommendations are spot on. It's like having a personal food guide that knows exactly what I like."
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Marcus Johnson</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Sophomore, Stanford</motion.p>
                    </div>
                  </motion.div>

                  {/* Testimonial 3 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/569b3d16006db1361d8940a524993c52.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
                      />
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Best way to find out where everyone's eating. I've discovered so many hidden gems around campus."
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Emily Rodriguez</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, MIT</motion.p>
                    </div>
                  </motion.div>

                  {/* Testimonial 4 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/816230758da3649866b5f4f7c6110456.jpg"
                        alt="Student"
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
                      />
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Finally, a way to track my nutrition and connect with friends over food. It's brilliant!"
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Alex Kim</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Freshman, Duke</motion.p>
                    </div>
                  </motion.div>

                  {/* Testimonial 5 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                        J
                      </div>
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The social features make campus dining so much more fun. Love seeing what my friends are eating!"
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Jessica Park</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, Yale</motion.p>
                    </div>
                  </motion.div>

                  {/* Testimonial 6 */}
                  <motion.div className="group relative rounded-[28px] p-6 md:p-8 border shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_25px_rgba(0,0,0,0.05),0_5px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 w-[280px] sm:w-[340px] md:w-[400px] flex-shrink-0" style={{ backgroundColor: testimonialCardBg, borderColor: testimonialBorderColor, backdropFilter: cardBlurFilter, WebkitBackdropFilter: cardBlurFilter }}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/50 shadow-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                        M
                      </div>
                    </div>
                    <motion.p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: testimonialTextColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "As an international student, CampusMeals helped me discover authentic food from my culture. Game changer!"
                    </motion.p>
                    <div>
                      <motion.p className="font-semibold text-base sm:text-lg" style={{ color: testimonialNameColor }}>Miguel Santos</motion.p>
                      <motion.p className="text-sm" style={{ color: testimonialRoleColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, UC Berkeley</motion.p>
                    </div>
                  </motion.div>
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

            {/* Card 2 - Track Analytics */}
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
