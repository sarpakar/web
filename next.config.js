/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Firebase App Hosting handles Next.js natively, no standalone needed

  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Enable React strict mode for better development
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Image configuration
  images: {
    remotePatterns: [
      // Firebase Storage
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      // Firebase Storage (new domain)
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        pathname: '/**',
      },
      // Google user profile photos
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      // Google Cloud Storage
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      // Unsplash (for placeholder images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Enable image optimization in production
    unoptimized: process.env.NODE_ENV !== 'production',
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
    // Supported formats
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com https://cdn.jsdelivr.net data:",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseapp.com wss://*.firebaseio.com https://firebasestorage.googleapis.com https://*.firebasestorage.app https://generativelanguage.googleapis.com",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Redirects for SEO and UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/feed',
        permanent: true,
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
  },
};

module.exports = nextConfig;
