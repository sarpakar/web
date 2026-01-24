/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Campus Meals Brand Colors - Food-focused & Premium
        primary: {
          DEFAULT: '#FF6B35', // Energetic orange (appetite stimulating)
          50: '#FFF4F0',
          100: '#FFE5DC',
          200: '#FFCCB9',
          300: '#FFB396',
          400: '#FF9A73',
          500: '#FF6B35', // Main brand
          600: '#E55A2B',
          700: '#CC4921',
          800: '#B23817',
          900: '#99270D',
          light: '#FFE5DC',
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#4ECDC4', // Fresh teal (health & freshness)
          50: '#F0FFFE',
          100: '#DBFDFB',
          200: '#B7FBF7',
          300: '#93F9F3',
          400: '#6FF7EF',
          500: '#4ECDC4',
          600: '#3DB5AD',
          700: '#2C9D96',
          800: '#1B857F',
          900: '#0A6D68',
          light: '#DBFDFB',
          dark: '#3DB5AD',
        },
        accent: {
          DEFAULT: '#FFD93D', // Vibrant yellow (deals, highlights)
          50: '#FFFEF5',
          100: '#FFFCE6',
          200: '#FFF9CC',
          300: '#FFF5B3',
          400: '#FFF199',
          500: '#FFD93D',
          600: '#E5C335',
          700: '#CCAD2D',
          800: '#B29725',
          900: '#99811D',
          light: '#FFFCE6',
          dark: '#E5C335',
        },
        // Neutrals - Warmer than LinkedIn's grays
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
        },
        // Text colors
        text: {
          primary: '#1A1A1A',
          secondary: '#666666',
          tertiary: '#999999',
          muted: '#B8B8B8',
        },
        // Backgrounds
        background: {
          DEFAULT: '#FAFAFA', // Slightly warmer than pure white
          card: '#FFFFFF',
          hover: '#F5F5F5',
          elevated: '#FFFFFF',
        },
        // Borders
        border: {
          DEFAULT: '#E5E5E5',
          light: '#F0F0F0',
          strong: '#D4D4D4',
        },
        // Semantic colors for food categories
        badge: {
          vegan: { bg: '#E8F5E9', text: '#2E7D32' },
          vegetarian: { bg: '#F1F8E9', text: '#558B2F' },
          spicy: { bg: '#FFEBEE', text: '#C62828' },
          popular: { bg: '#FFE5DC', text: '#E55A2B' },
          new: { bg: '#FFFCE6', text: '#B29725' },
          healthy: { bg: '#DBFDFB', text: '#2C9D96' },
        },
        // Status colors
        success: {
          DEFAULT: '#46D160',
          light: '#E8F5E9',
          dark: '#2E7D32',
        },
        warning: {
          DEFAULT: '#FFB000',
          light: '#FFF4E6',
          dark: '#CC8D00',
        },
        error: {
          DEFAULT: '#FF4458',
          light: '#FFEBEE',
          dark: '#CC3646',
        },
        info: {
          DEFAULT: '#4ECDC4',
          light: '#DBFDFB',
          dark: '#3DB5AD',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '-0.01em' }],
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }], // 16px - larger than LinkedIn
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '3rem', letterSpacing: '-0.04em' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.04em',
      },
      boxShadow: {
        // Softer, more elevated than LinkedIn
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 4px 16px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 16px 0 rgba(0, 0, 0, 0.08), 0 12px 32px 0 rgba(0, 0, 0, 0.12)',
        'premium': '0 12px 24px 0 rgba(255, 107, 53, 0.15), 0 16px 48px 0 rgba(255, 107, 53, 0.1)',
        'glow-primary': '0 0 0 4px rgba(255, 107, 53, 0.1)',
        'glow-secondary': '0 0 0 4px rgba(78, 205, 196, 0.1)',
        'glow-accent': '0 0 0 4px rgba(255, 217, 61, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'sm': '0.375rem',   // 6px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.625rem',    // 10px
        'lg': '0.75rem',     // 12px - Campus Meals standard
        'xl': '1rem',        // 16px
        '2xl': '1.25rem',    // 20px
        '3xl': '1.5rem',     // 24px - for cards
        '4xl': '2rem',       // 32px
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        // LinkedIn-inspired subtle animations
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '0': '0ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
