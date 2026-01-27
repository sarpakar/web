'use client';

import { useEffect, useRef, useCallback } from 'react';
import createGlobe, { COBEOptions } from 'cobe';

interface GlobeProps {
  className?: string;
}

// University locations with coordinates - major US universities
const UNIVERSITY_MARKERS: { location: [number, number]; size: number }[] = [
  { location: [42.3601, -71.0589], size: 0.08 }, // Boston (MIT, Harvard)
  { location: [37.4275, -122.1697], size: 0.1 }, // Stanford
  { location: [40.8075, -73.9626], size: 0.08 }, // Columbia
  { location: [40.3573, -74.6672], size: 0.07 }, // Princeton
  { location: [38.0336, -78.5080], size: 0.06 }, // UVA
  { location: [35.9049, -79.0469], size: 0.08 }, // Duke/UNC
  { location: [41.3163, -72.9223], size: 0.07 }, // Yale
  { location: [42.4534, -76.4735], size: 0.06 }, // Cornell
  { location: [39.9522, -75.1932], size: 0.08 }, // Penn
  { location: [42.0565, -87.6753], size: 0.08 }, // Northwestern
  { location: [34.0689, -118.4452], size: 0.08 }, // UCLA
  { location: [37.8719, -122.2585], size: 0.08 }, // UC Berkeley
  { location: [29.7174, -95.4018], size: 0.06 }, // Rice
  { location: [33.7756, -84.3963], size: 0.07 }, // Emory/Georgia Tech
  { location: [41.7886, -87.5987], size: 0.06 }, // UChicago
  { location: [40.7128, -74.0060], size: 0.1 }, // NYU
  { location: [38.9072, -77.0369], size: 0.08 }, // Georgetown
  { location: [36.0014, -78.9382], size: 0.07 }, // Duke
  { location: [34.0224, -118.2851], size: 0.07 }, // USC
  { location: [36.1447, -86.8027], size: 0.06 }, // Vanderbilt
];

export default function Globe({ className = '' }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      const width = canvasRef.current.offsetWidth;
      canvasRef.current.width = width * 2;
      canvasRef.current.height = width * 2;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();

    let width = 0;
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 6,
      baseColor: [0.15, 0.15, 0.2],
      markerColor: [0.4, 0.6, 1],
      glowColor: [0.2, 0.3, 0.6],
      markers: UNIVERSITY_MARKERS,
      onRender: (state: Record<string, unknown>) => {
        // Auto-rotate when not interacting
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {/* Glow effect behind globe */}
      <div
        className="absolute inset-[-20%] -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 60%)',
          filter: 'blur(30px)',
        }}
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-1000 cursor-grab active:cursor-grabbing"
        style={{
          contain: 'layout paint size',
        }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
      />

      {/* Floating profile images around globe */}
      <div className="absolute top-[5%] left-[10%] w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 animate-pulse">
        <img src="/people/10116edf1a14e1fac1d250f09c3f901d.jpg" alt="Student" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-[15%] right-[5%] w-7 h-7 rounded-full overflow-hidden border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <img src="/people/269ea14ae1b312e9d73cc8a1acb868aa.jpg" alt="Student" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-[20%] left-[5%] w-6 h-6 rounded-full overflow-hidden border-2 border-pink-400/50 shadow-lg shadow-pink-500/20 animate-pulse" style={{ animationDelay: '1s' }}>
        <img src="/people/569b3d16006db1361d8940a524993c52.jpg" alt="Student" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-[10%] right-[15%] w-7 h-7 rounded-full overflow-hidden border-2 border-orange-400/50 shadow-lg shadow-orange-500/20 animate-pulse" style={{ animationDelay: '1.5s' }}>
        <img src="/people/816230758da3649866b5f4f7c6110456.jpg" alt="Student" className="w-full h-full object-cover" />
      </div>

      {/* Connection lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100">
        <line x1="15" y1="10" x2="50" y2="50" stroke="url(#blueGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="90" y1="20" x2="50" y2="50" stroke="url(#purpleGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="10" y1="75" x2="50" y2="50" stroke="url(#pinkGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="85" y1="85" x2="50" y2="50" stroke="url(#orangeGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pinkGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
