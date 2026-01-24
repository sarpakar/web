# CampusMeals Web App

A Next.js web application for the CampusMeals platform, featuring AI-powered food search, interactive maps, and social features for campus dining.

## Features

### 🔍 AI Search
- Natural language food search powered by Gemini AI
- Quick suggestion chips for common searches
- Real-time search results with restaurant/dish cards
- Chat-style interface for conversational search

### 🗺️ Interactive Map
- Google Maps integration with vendor markers
- Category filtering (Restaurants, Cafés, Groceries, etc.)
- Vendor detail cards on marker click
- User location detection and centering
- Directions link to Google Maps

### 📱 Social Features
- **Feed**: View posts from the community
- **Communities**: Join food communities and diet groups
- **Challenges**: Participate in food challenges with XP rewards
- **Meetups**: Plan and RSVP to restaurant meetups

### 🍽️ Explore
- Browse all vendors with search and filtering
- Category-based filtering
- Featured/top-rated restaurants
- Detailed vendor cards with ratings, wait times, and dietary info

### 👤 Profile
- User profile with gamification stats
- XP, level, and badges display
- Friends list

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API
- **Maps**: Google Maps JavaScript API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Google Maps API key (optional, for maps)
- Gemini API key (optional, for AI search)

### Installation

1. Clone the repository and navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (main)/            # Authenticated routes
│   │   │   ├── feed/          # Social feed
│   │   │   ├── search/        # AI-powered search
│   │   │   ├── map/           # Interactive map
│   │   │   ├── explore/       # Browse vendors
│   │   │   ├── communities/   # Food communities
│   │   │   ├── challenges/    # Food challenges
│   │   │   ├── meetups/       # Restaurant meetups
│   │   │   ├── log-meal/      # Meal logging
│   │   │   └── profile/       # User profile
│   │   ├── login/             # Authentication
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── layout/            # Layout components (Sidebar)
│   │   ├── social/            # Social cards (Post, Community, etc.)
│   │   ├── vendors/           # Vendor components
│   │   └── ui/                # UI primitives (LoadingSpinner)
│   ├── lib/                   # Utilities
│   │   ├── firebase.ts        # Firebase initialization
│   │   └── utils.ts           # Helper functions
│   ├── services/              # API services
│   │   ├── mealLogService.ts  # Meal logging
│   │   ├── socialService.ts   # Social features
│   │   ├── searchService.ts   # AI search
│   │   └── vendorService.ts   # Vendor data
│   ├── stores/                # Zustand stores
│   │   └── authStore.ts       # Authentication state
│   └── types/                 # TypeScript types
│       └── index.ts           # All type definitions
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies
```

## Firebase Collections

The web app uses the same Firebase collections as the iOS app:

- `users` - User profiles and gamification data
- `mealLogs` - Individual meal logs with photos
- `posts` - Social posts with engagement
- `communities` - Food communities
- `challenges` - Food challenges
- `meetups` - Restaurant meetups
- `vendors` - Restaurant/venue data

## Design System

The web app follows a clean, white-themed design inspired by:
- Substack's typography and spacing
- X (Twitter)'s minimal aesthetic
- Instagram's card layouts

### Colors
- Primary: Blue (#3B82F6)
- Background: White/Gray-50
- Text: Gray-900 (headings), Gray-600 (body), Gray-400 (muted)

### Typography
- System font stack for performance
- Semibold for headings
- Regular for body text

## API Integration

### Gemini AI
Used for:
- Natural language search queries
- Food recommendations
- Image analysis (future)

### Google Maps
Used for:
- Interactive map display
- Vendor markers with clustering
- Directions and navigation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details.
