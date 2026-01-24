'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';

// CM Logo Component
const CMlogo = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <Image
    src="/logo.png"
    alt="CampusMeals"
    width={size}
    height={size * 0.6}
    className={className}
    priority
  />
);

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const images = ['/img/IMG_6841.PNG', '/img/IMG_6842.PNG', '/img/IMG_6843.PNG'];
  const targetRef = useRef<HTMLDivElement>(null);

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
  }, [images]);

  // Track scroll progress within the target element
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress to image index with smoothing
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Add slight delay between transitions for smoother feel
      const progress = Math.max(0, Math.min(1, latest));
      const imageIndex = Math.min(
        Math.floor(progress * images.length),
        images.length - 1
      );

      setCurrentImageIndex(imageIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, images.length]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] w-full overflow-x-hidden">
      {/* Navigation - iOS 26 Liquid Glass Effect */}
      <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl px-4 md:px-0">
        <div className="relative flex flex-wrap gap-4 md:gap-8 items-center justify-between px-4 py-3 md:px-8 md:py-4 lg:px-10 lg:py-4 backdrop-blur-[24px] bg-white/40 rounded-[20px] md:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.1)_inset] before:content-[''] before:absolute before:inset-0 before:rounded-[20px] md:before:rounded-[28px] before:p-[1.5px] before:bg-gradient-to-b before:from-white/50 before:via-white/20 before:to-gray-300/30 before:-z-10 before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude]">
          <div className="flex gap-4 md:gap-10 items-center">
            {/* Left: Icon Logo */}
            <Link href="/" className="flex items-center transition-transform hover:scale-110">
              <CMlogo size={40} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden gap-6 md:gap-10 items-center lg:flex">
              <a href="#about" className="text-[15px] md:text-[17px] font-medium text-gray-900 hover:text-gray-600 transition-colors">
                About
              </a>
              <a href="#features" className="text-[15px] md:text-[17px] font-medium text-gray-900 hover:text-gray-600 transition-colors">
                Writing
              </a>
              <a href="#testimonials" className="text-[15px] md:text-[17px] font-medium text-gray-900 hover:text-gray-600 transition-colors">
                Careers
              </a>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Link
            href="/login"
            className="relative inline-flex items-center gap-2 md:gap-2.5 px-4 py-2.5 md:px-8 md:py-3.5 backdrop-blur-lg bg-[#3a3f47] text-white rounded-[18px] md:rounded-[22px] text-[14px] md:text-[17px] font-medium hover:bg-gray-800 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.15)_inset] before:content-[''] before:absolute before:inset-0 before:rounded-[18px] md:before:rounded-[22px] before:p-[1.5px] before:bg-gradient-to-b before:from-white/25 before:to-transparent before:-z-10 before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Get CampusMeals</span>
            <span className="sm:hidden">Sign In</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Scroll-Controlled iPhone Screens */}
      <div ref={targetRef} className="relative bg-gradient-to-br from-[#FAFAFA] via-[#F8F8F8] to-[#F5F5F5] w-full" style={{ height: '600vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 pt-24 md:pt-32 bg-gradient-to-br from-[#FAFAFA] via-[#F8F8F8] to-[#F5F5F5] w-full">
          {/* Subtle radial glow behind phone */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-gray-200/20 via-gray-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-8 md:gap-12 lg:gap-16 relative z-10">
            {/* Left Side - Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full max-w-xl text-center lg:text-left"
            >
              {/* Instagram-style Friend Avatars */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-5"
              >
                <div className="flex -space-x-2 md:-space-x-3">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-200">
                    <Image src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Friend" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-200">
                    <Image src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Friend" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-200">
                    <Image src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Friend" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-gray-200">
                    <Image src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="Friend" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <span className="text-white text-[10px] md:text-xs font-semibold" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>+12</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  12,847 meals shared today
                </p>
              </motion.div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-[1.08] tracking-[-0.02em] text-[#1a1a1a]" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: '900' }}>
                What to eat? Ask everyone.
              </h1>

              {/* Subheading */}
              <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Share what you're eating, discover where everyone's going, and never eat alone on campus again.
              </p>

              {/* CTA with enhanced glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col items-center lg:items-start gap-4 w-full"
              >
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center gap-2 md:gap-2.5 px-6 py-3 md:px-8 md:py-4 backdrop-blur-2xl bg-gray-900/95 text-white rounded-[18px] md:rounded-[20px] text-sm md:text-base font-semibold hover:bg-gray-900 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.15)_inset] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] before:content-[''] before:absolute before:inset-0 before:rounded-[18px] md:before:rounded-[20px] before:p-[1px] before:bg-gradient-to-b before:from-white/25 before:via-white/10 before:to-transparent before:-z-10 before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] w-full sm:w-auto"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    Join Free with .edu Email
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="#demo"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-4 text-gray-700 rounded-[18px] md:rounded-[20px] text-sm md:text-base font-semibold hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  >
                    Watch Demo
                  </Link>
                </div>
                <p className="text-xs md:text-sm text-gray-500 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-center lg:text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free forever • No credit card • Student email required
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side - iPhone with Pagination */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 md:gap-8 relative w-full lg:w-auto max-w-[320px] sm:max-w-[380px] md:max-w-[400px] mx-auto lg:mx-0"
            >
              {/* Soft glow around iPhone */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300/25 via-gray-200/20 to-transparent rounded-[3rem] blur-2xl" />

              <div className="relative w-full aspect-[9/19]">
                <Image
                  src="/iPhone 17.png"
                  alt="iPhone"
                  fill
                  className="object-contain relative z-20"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))' }}
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 768px) 380px, 400px"
                />
                {/* Screen Content with Animated Transitions */}
                <div className="absolute top-[2.5%] left-[5.5%] right-[5.5%] bottom-[2.5%] rounded-[2.4rem] md:rounded-[2.8rem] overflow-hidden z-10">
                  {imagesLoaded && images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0 w-full h-full"
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
                    >
                      <Image
                        src={image}
                        alt={`App screen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 360px"
                      />
                    </motion.div>
                  ))}
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Indicators - Right Side */}
              <div className="hidden lg:flex flex-col gap-2 items-center justify-center">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'h-10 bg-gray-900'
                        : 'h-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Banner - Universities */}
      <div className="w-full py-12 md:py-16 bg-[#FAF9F6] overflow-hidden space-y-4 md:space-y-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        {/* First Row - Scrolls Left */}
        <div className="relative flex">
          <div className="flex animate-scroll gap-8 md:gap-12">
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Northwestern</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Rice</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Stanford</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Spelman</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">SMU</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Emory</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Notre Dame</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Wake Forest</span>
          </div>
          <div className="flex animate-scroll gap-8 md:gap-12" aria-hidden="true">
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Northwestern</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Rice</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Stanford</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Spelman</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">SMU</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Emory</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Notre Dame</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Wake Forest</span>
          </div>
        </div>

        {/* Second Row - Scrolls Right */}
        <div className="relative flex">
          <div className="flex animate-scroll-reverse gap-8 md:gap-12">
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">UC Berkeley</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">MIT</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Princeton</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Tulane</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Georgetown</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Duke</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Yale</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Howard</span>
          </div>
          <div className="flex animate-scroll-reverse gap-8 md:gap-12" aria-hidden="true">
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">UC Berkeley</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">MIT</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Princeton</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Tulane</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Georgetown</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Duke</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Yale</span>
            <span className="text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">Howard</span>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-[#FAF9F6] overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900" style={{ fontWeight: '700' }}>
              How It Works
            </h2>
          </div>

          {/* Grid of 3 Large Video Containers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Container 1 - Share What You Eat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 h-[600px] flex items-start justify-start p-12"
            >
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
              <h3 className="relative z-10 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Share what you eat.
              </h3>
            </motion.div>

            {/* Container 2 - Ask for Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 h-[600px] flex items-start justify-start p-12"
            >
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
              <h3 className="relative z-10 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Ask for recommendations.
              </h3>
            </motion.div>

            {/* Container 3 - Track Your Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 h-[600px] flex items-start justify-start p-12"
            >
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
              <h3 className="relative z-10 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Track your goals.
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Auto-Scrolling Carousel */}
      <section className="w-full py-24 bg-gradient-to-b from-[#FAF9F6] to-white overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900" style={{ fontWeight: '700' }}>
              Students Love CampusMeals.
            </h2>
          </div>

          {/* Auto-Scrolling Testimonials Carousel */}
          <div className="relative mb-12">
            {/* Scrolling Container */}
            <div className="flex gap-6 animate-scroll-testimonials">
              {/* Duplicate testimonials for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6 flex-shrink-0">
                  {/* Testimonial 1 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg"
                        alt="Student"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "CampusMeals has completely changed how I discover food on campus. I never eat alone anymore!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Sarah Chen</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, Northwestern</p>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg"
                        alt="Student"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The AI recommendations are spot on. It's like having a personal food guide that knows exactly what I like."
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Marcus Johnson</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Sophomore, Stanford</p>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/569b3d16006db1361d8940a524993c52.jpg"
                        alt="Student"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Best way to find out where everyone's eating. I've discovered so many hidden gems around campus."
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Emily Rodriguez</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, MIT</p>
                    </div>
                  </div>

                  {/* Testimonial 4 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <img
                        src="/people/816230758da3649866b5f4f7c6110456.jpg"
                        alt="Student"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "Finally, a way to track my nutrition and connect with friends over food. It's brilliant!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Alex Kim</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Freshman, Duke</p>
                    </div>
                  </div>

                  {/* Testimonial 5 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                        J
                      </div>
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "The social features make campus dining so much more fun. Love seeing what my friends are eating!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Jessica Park</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Senior, Yale</p>
                    </div>
                  </div>

                  {/* Testimonial 6 */}
                  <div className="group relative backdrop-blur-xl bg-white/80 rounded-[28px] p-8 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        M
                      </div>
                    </div>
                    <p className="text-gray-700 text-base mb-8 leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      "As an international student, CampusMeals helped me discover authentic food from my culture. Game changer!"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Miguel Santos</p>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Junior, UC Berkeley</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/login"
              className="relative inline-flex items-center gap-2.5 px-10 py-4 backdrop-blur-2xl bg-gray-900/95 text-white rounded-full text-base font-semibold hover:bg-gray-900 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.15)_inset] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] before:content-[''] before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-b before:from-white/25 before:via-white/10 before:to-transparent before:-z-10 before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude]"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Join CampusMeals Today
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section - 2026 Design */}
      <section className="w-full py-24 bg-gradient-to-b from-white to-[#FAF9F6] overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontWeight: '700' }}>
              One Platform for All Your Campus Meals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share what you eat, discover trending spots, and connect with your campus community.
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Card 1 - Share Meals (Tall) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="group lg:row-span-2 relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 p-8"
            >
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Share Your Meals.
                </h3>
                <p className="text-gray-600 mb-6">
                  Post what you're eating and inspire thousands of students instantly.
                </p>
                <div className="mt-auto flex flex-col gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img src="/postsuplaod/8dab728b45f221926d98260bb8b7a3d4.jpg" alt="Meal" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img src="/postsuplaod/0ac697015792a7c06e949b31bbef9c41.jpg" alt="Meal" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Track Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group lg:col-span-2 relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 p-8"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Track Performance.
                </h3>
                <p className="text-gray-600 mb-4">
                  See your meal views, engagement, and connections in real time.
                </p>
                <div className="flex items-center gap-8 mt-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gray-900">14.9M</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gray-900">2.0M</div>
                    <div className="text-sm text-gray-500">Engagement</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gray-900">0.8M</div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gray-900">433K</div>
                    <div className="text-sm text-gray-500">Comments</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Find Friends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group lg:col-span-2 relative overflow-hidden backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 p-8"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Connect with Students.
                </h3>
                <p className="text-gray-600 mb-4">
                  Find students eating at the same spots and never eat alone.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  >
                    <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Student" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  >
                    <img src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="Student" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  >
                    <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Student" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  >
                    <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Student" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-lg bg-gray-900/90 text-white font-bold text-xl shadow-lg border border-gray-200/20">
                    +42
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-500 text-xs tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              © 2024 CampusMeals. All rights reserved.
            </div>
            <div className="flex items-center gap-8 text-gray-600">
              <a href="#" className="text-xs font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Privacy</a>
              <a href="#" className="text-xs font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Terms</a>
              <a href="#" className="text-xs font-medium hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
