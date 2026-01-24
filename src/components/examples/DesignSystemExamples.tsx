/**
 * Campus Meals Design System Examples
 *
 * This file contains ready-to-use component examples using the new design system.
 * Copy any component and customize as needed.
 */

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShoppingCart,
  Star,
  MoreHorizontal,
  Bell,
  Search,
  Home,
  Compass,
  ShoppingBag,
  Utensils,
  Clock,
  Flame,
  Zap,
} from 'lucide-react';

// ============================================================================
// MEAL CARDS
// ============================================================================

/**
 * Premium Meal Card - Food photography optimized with hover effects
 */
export function MealCard() {
  return (
    <div className="meal-card p-5 max-w-sm">
      {/* Image with hover zoom */}
      <div className="meal-card__image-container">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
          alt="Spicy Chicken Bowl"
          className="meal-card__image"
        />
        <div className="meal-card__image-overlay">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm font-medium">Available at Kimmel Dining</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="badge-popular">POPULAR</span>
        <span className="badge-spicy">SPICY</span>
        <span className="badge-healthy">PROTEIN+</span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-1">Spicy Chicken Bowl</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">
        Grilled chicken breast with sriracha mayo, brown rice, fresh veggies,
        and sesame seeds. High protein, under 500 calories.
      </p>

      {/* Nutrition */}
      <div className="flex items-center gap-4 mb-4 text-sm text-text-tertiary">
        <span className="flex items-center gap-1">
          <Flame size={14} />
          450 cal
        </span>
        <span className="flex items-center gap-1">
          <Zap size={14} />
          35g protein
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          15 min
        </span>
      </div>

      {/* Rating & Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-accent">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-semibold text-text-primary">4.8</span>
          </div>
          <span className="text-sm text-text-tertiary">(234)</span>
        </div>
        <span className="text-2xl font-bold text-primary">$12.99</span>
      </div>

      {/* CTA */}
      <button className="btn-primary w-full">
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  );
}

/**
 * Compact Meal Card - For lists and grids
 */
export function CompactMealCard() {
  return (
    <div className="card-elevated p-4 flex gap-4 hover-lift cursor-pointer">
      {/* Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"
          alt="Pizza"
          className="w-full h-full object-cover hover-scale"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold line-clamp-1">Margherita Pizza</h4>
          <button className="btn-icon w-8 h-8">
            <Heart size={16} />
          </button>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2 mb-2">
          Fresh mozzarella, tomato sauce, basil
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-accent">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-semibold">4.5</span>
          </div>
          <span className="text-lg font-bold text-primary">$9.99</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEED POST CARD
// ============================================================================

/**
 * Social Feed Post - LinkedIn-inspired
 */
export function FeedPost() {
  return (
    <article className="card-elevated p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="avatar-md">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="John Doe"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">John Doe</h4>
          <p className="text-sm text-text-secondary">NYU Stern • 2h ago</p>
        </div>
        <button className="btn-icon">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-base mb-4">
        Just tried the new Spicy Chicken Bowl at Kimmel! 🔥
        Absolutely delicious and perfect for post-workout fuel.
        #CampusMeals #NYUFood
      </p>

      {/* Image */}
      <div className="relative rounded-xl overflow-hidden mb-4">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
          alt="Meal"
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 mb-3 text-sm text-text-secondary">
        <span>124 likes</span>
        <span>18 comments</span>
        <span>5 shares</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
          <Heart size={20} />
          <span className="text-sm font-medium">Like</span>
        </button>
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
          <MessageCircle size={20} />
          <span className="text-sm font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
          <Share2 size={20} />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
          <Bookmark size={20} />
        </button>
      </div>
    </article>
  );
}

// ============================================================================
// RESTAURANT CARD
// ============================================================================

/**
 * Restaurant/Vendor Card
 */
export function RestaurantCard() {
  return (
    <div className="card-elevated p-5 hover-lift cursor-pointer">
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden mb-4 h-48">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
          alt="Kimmel Dining"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="badge-new">NEW</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Kimmel Dining Hall</h3>
          <p className="text-sm text-text-secondary">American • Healthy • Quick</p>
        </div>
        <button className="btn-icon">
          <Heart size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <Star size={14} fill="#FFD93D" stroke="#FFD93D" />
          <span className="font-semibold">4.6</span>
          <span className="text-text-tertiary">(2.1k)</span>
        </div>
        <span className="text-text-tertiary">15-25 min</span>
        <span className="text-text-tertiary">$2.99 delivery</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="badge-healthy">Healthy Options</span>
        <span className="badge-vegan">Vegan</span>
      </div>
    </div>
  );
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

/**
 * Top Navigation Bar - LinkedIn-style
 */
export function TopNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Utensils size={24} />
          <span>Campus Meals</span>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
              size={18}
            />
            <input
              type="search"
              placeholder="Search meals, restaurants..."
              className="search-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="btn-icon relative">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button className="btn-icon">
            <ShoppingCart size={20} />
          </button>
          <div className="avatar-md">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Tab Navigation - For You / Saved style
 */
export function TabNavigation() {
  return (
    <div className="tab-nav">
      <button className="tab-item-active">For You</button>
      <button className="tab-item-inactive">Saved</button>
      <button className="tab-item-inactive">Orders</button>
    </div>
  );
}

/**
 * Sidebar Navigation - LinkedIn-style tight spacing
 */
export function SidebarNav() {
  return (
    <nav className="space-y-0.5">
      <a href="/feed" className="nav-item-active">
        <Home size={24} strokeWidth={1.75} />
        <span className="text-[16px] font-semibold">Home</span>
      </a>
      <a href="/explore" className="nav-item-inactive">
        <Compass size={24} strokeWidth={1.75} />
        <span className="text-[16px] font-semibold">Explore</span>
      </a>
      <a href="/orders" className="nav-item-inactive">
        <ShoppingBag size={24} strokeWidth={1.75} />
        <span className="text-[16px] font-semibold">My Orders</span>
      </a>
    </nav>
  );
}

// ============================================================================
// SIDEBAR WIDGETS
// ============================================================================

/**
 * User Profile Widget - Left Sidebar
 */
export function UserProfileWidget() {
  return (
    <div className="sidebar-card">
      <div className="flex flex-col items-center text-center">
        <div className="avatar-xl mb-3">
          <img
            src="https://i.pravatar.cc/150?img=8"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-lg mb-1">Sarah Johnson</h3>
        <p className="text-sm text-text-secondary mb-3">NYU Stern '25</p>

        {/* Stats */}
        <div className="flex items-center gap-6 w-full py-3 border-t border-border">
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-primary">42</div>
            <div className="text-xs text-text-tertiary">Orders</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-secondary">156</div>
            <div className="text-xs text-text-tertiary">Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Widget - Right Sidebar
 */
export function CartWidget() {
  return (
    <div className="sidebar-card sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Your Cart</h3>
        <span className="badge-popular">3 items</span>
      </div>

      {/* Cart items */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
              alt="Bowl"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">Spicy Chicken Bowl</p>
            <p className="text-xs text-text-tertiary">x1</p>
          </div>
          <p className="text-sm font-semibold">$12.99</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100"
              alt="Pizza"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">Margherita Pizza</p>
            <p className="text-xs text-text-tertiary">x2</p>
          </div>
          <p className="text-sm font-semibold">$19.98</p>
        </div>
      </div>

      {/* Totals */}
      <div className="pt-4 border-t border-border space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-medium">$32.97</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Delivery</span>
          <span className="font-medium">$2.99</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">$35.96</span>
        </div>
      </div>

      {/* CTA */}
      <button className="btn-primary w-full">Checkout</button>
    </div>
  );
}

/**
 * Trending Widget - Right Sidebar
 */
export function TrendingWidget() {
  return (
    <div className="sidebar-card">
      <h3 className="font-semibold mb-4">Trending Meals 🔥</h3>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-background-hover -mx-2 px-2 py-2 rounded-lg transition-colors">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${1546069901 + i}-ba9599a7e63c?w=100`}
                alt={`Trending ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">Trending Meal #{i}</p>
              <div className="flex items-center gap-1 text-accent">
                <Star size={12} fill="currentColor" />
                <span className="text-xs">4.{9 - i}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">$1{2 + i}.99</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

/**
 * Search Bar Component
 */
export function SearchBar() {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
        size={20}
      />
      <input
        type="search"
        placeholder="Search meals, restaurants, categories..."
        className="search-input"
      />
    </div>
  );
}

/**
 * Filter Dropdown
 */
export function FilterDropdown() {
  return (
    <select className="select">
      <option>All Categories</option>
      <option>Breakfast</option>
      <option>Lunch</option>
      <option>Dinner</option>
      <option>Snacks</option>
      <option>Drinks</option>
    </select>
  );
}

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Meal Card Skeleton
 */
export function MealCardSkeleton() {
  return (
    <div className="card-elevated p-5">
      <div className="skeleton-image mb-4"></div>
      <div className="skeleton-title mb-2"></div>
      <div className="skeleton-text mb-2"></div>
      <div className="skeleton-text w-2/3 mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="skeleton-text w-20"></div>
        <div className="skeleton-text w-16"></div>
      </div>
    </div>
  );
}

/**
 * Feed Post Skeleton
 */
export function FeedPostSkeleton() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton-avatar w-10 h-10"></div>
        <div className="flex-1">
          <div className="skeleton-text w-32 mb-2"></div>
          <div className="skeleton-text w-24"></div>
        </div>
      </div>
      <div className="skeleton-text mb-2"></div>
      <div className="skeleton-text w-3/4 mb-4"></div>
      <div className="skeleton-image h-64 mb-4"></div>
      <div className="flex gap-4">
        <div className="skeleton-text w-20"></div>
        <div className="skeleton-text w-20"></div>
        <div className="skeleton-text w-20"></div>
      </div>
    </div>
  );
}

/**
 * Loading Spinner
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div className={size === 'sm' ? 'spinner-sm' : 'spinner'}></div>
  );
}

// ============================================================================
// BUTTON EXAMPLES
// ============================================================================

/**
 * Button Showcase
 */
export function ButtonShowcase() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold mb-4">Button Variants</h3>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-outline">Outline Button</button>
        <button className="btn-ghost">Ghost Button</button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button className="btn-primary btn-loading">Loading...</button>
        <button className="btn-icon">
          <Heart size={20} />
        </button>
        <button className="btn-icon">
          <ShoppingCart size={20} />
        </button>
        <button className="btn-icon">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge-vegan">Vegan</span>
        <span className="badge-vegetarian">Vegetarian</span>
        <span className="badge-spicy">Spicy</span>
        <span className="badge-popular">Popular</span>
        <span className="badge-new">NEW</span>
        <span className="badge-healthy">Healthy</span>
        <span className="badge-premium">PREMIUM</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLETE PAGE LAYOUT EXAMPLE
// ============================================================================

/**
 * Complete Page Layout - LinkedIn-style 3-column
 */
export function CompletePageLayout() {
  return (
    <>
      {/* Navbar */}
      <TopNavbar />

      {/* Main Layout */}
      <div className="layout-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <UserProfileWidget />
          <div className="sidebar-card">
            <SidebarNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-4">
          <TabNavigation />
          <SearchBar />

          {/* Feed */}
          <div className="space-y-4">
            <FeedPost />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MealCard />
              <MealCard />
            </div>
            <FeedPost />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar">
          <CartWidget />
          <TrendingWidget />
        </aside>
      </div>
    </>
  );
}

export default CompletePageLayout;
