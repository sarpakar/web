# Campus Meals Design System

> A premium, food-focused design system inspired by LinkedIn's structure with warm, appetizing colors and elevated interactions.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Components](#components)
4. [Layout System](#layout-system)
5. [Usage Examples](#usage-examples)

---

## Color Palette

### Primary Colors (Orange - Appetite Stimulating)
- **Primary**: `#FF6B35` - Main brand color for CTAs, highlights
- **Primary Light**: `#FFE5DC` - Backgrounds, subtle highlights
- **Primary Dark**: `#E55A2B` - Hover states, darker accents

```jsx
// Tailwind classes
<button className="bg-primary hover:bg-primary-dark text-white">Order Now</button>
<div className="bg-primary-light text-primary">Featured</div>
```

### Secondary Colors (Teal - Health & Freshness)
- **Secondary**: `#4ECDC4` - Healthy options, fresh content
- **Secondary Light**: `#DBFDFB` - Backgrounds for health badges
- **Secondary Dark**: `#3DB5AD` - Hover states

```jsx
<span className="badge-healthy">Healthy</span>
<button className="btn-secondary">Healthy Options</button>
```

### Accent Colors (Yellow - Deals & Highlights)
- **Accent**: `#FFD93D` - Deals, promotions, new items
- **Accent Light**: `#FFFCE6` - Subtle backgrounds
- **Accent Dark**: `#E5C335` - Text on light backgrounds

```jsx
<span className="badge-new">NEW</span>
<div className="bg-accent-light border-2 border-accent">50% OFF!</div>
```

### Neutrals
- **Text Primary**: `#1A1A1A`
- **Text Secondary**: `#666666`
- **Text Tertiary**: `#999999`
- **Text Muted**: `#B8B8B8`

---

## Typography

### Font Families
- **Display/Headings**: Geist Sans, Poppins (personality)
- **Body**: Geist Sans, Inter (clean readability)

### Font Sizes (Larger than LinkedIn)
```css
text-xs:   12px
text-sm:   14px
text-base: 16px (body text - larger than LinkedIn's 14px)
text-lg:   18px
text-xl:   20px
text-2xl:  24px
text-3xl:  30px
text-4xl:  36px
```

### Usage
```jsx
<h1 className="text-4xl font-bold">Campus Meals</h1>
<h2 className="text-2xl font-semibold">Featured Today</h2>
<p className="text-base text-text-secondary">Delicious meals delivered...</p>
```

---

## Components

### 1. Cards

#### Basic Card
```jsx
<div className="card p-5">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-text-secondary">Card content...</p>
</div>
```

#### Elevated Card (Recommended for most use cases)
```jsx
<div className="card-elevated p-6">
  <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
  <p className="text-sm text-text-secondary">Hovers with lift effect</p>
</div>
```

#### Premium Card (For special features)
```jsx
<div className="card-premium p-6">
  <span className="badge-premium">PREMIUM</span>
  <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
  <p className="text-sm text-text-secondary">Exclusive content</p>
</div>
```

#### Meal Card (Food photography optimized)
```jsx
<div className="meal-card p-5">
  <div className="meal-card__image-container">
    <img
      src="/meal.jpg"
      alt="Meal"
      className="meal-card__image"
    />
    <div className="meal-card__image-overlay" />
  </div>
  <div className="flex items-center gap-2 mb-2">
    <span className="badge-popular">POPULAR</span>
    <span className="badge-spicy">SPICY</span>
  </div>
  <h3 className="text-lg font-semibold mb-1">Spicy Chicken Bowl</h3>
  <p className="text-sm text-text-secondary mb-3">
    Grilled chicken with sriracha mayo...
  </p>
  <div className="flex items-center justify-between">
    <span className="text-xl font-bold text-primary">$12.99</span>
    <button className="btn-primary px-4 py-2 text-sm">Add to Cart</button>
  </div>
</div>
```

### 2. Buttons

#### Button Variants
```jsx
// Primary (Main CTAs)
<button className="btn-primary">Order Now</button>

// Secondary (Alternative actions)
<button className="btn-secondary">View Menu</button>

// Outline (Secondary CTAs)
<button className="btn-outline">Learn More</button>

// Ghost (Tertiary actions)
<button className="btn-ghost">Cancel</button>

// Icon Button
<button className="btn-icon">
  <Heart size={20} />
</button>
```

#### Loading State
```jsx
<button className="btn-primary btn-loading">
  Loading...
</button>
```

### 3. Badges

```jsx
// Food category badges
<span className="badge-vegan">Vegan</span>
<span className="badge-vegetarian">Vegetarian</span>
<span className="badge-spicy">Spicy</span>

// Status badges
<span className="badge-popular">Popular</span>
<span className="badge-new">NEW</span>
<span className="badge-healthy">Healthy</span>

// Premium badge
<span className="badge-premium">PREMIUM</span>
```

#### Icon Badges (For category selection)
```jsx
<button className="icon-badge">
  <Pizza size={24} />
</button>
```

### 4. Form Elements

#### Input Field
```jsx
<input
  type="text"
  placeholder="Search meals..."
  className="input"
/>

// With error state
<input
  type="email"
  placeholder="Email"
  className="input-error"
/>
```

#### Search Input
```jsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
  <input
    type="search"
    placeholder="Search meals, restaurants..."
    className="search-input"
  />
</div>
```

#### Select Dropdown
```jsx
<select className="select">
  <option>All Categories</option>
  <option>Breakfast</option>
  <option>Lunch</option>
  <option>Dinner</option>
</select>
```

#### Textarea
```jsx
<textarea
  placeholder="Write a review..."
  className="textarea"
  rows={4}
/>
```

### 5. Navigation

#### Top Navbar (LinkedIn-style)
```jsx
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
        <input
          type="search"
          placeholder="Search..."
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
        <img src="/avatar.jpg" alt="User" />
      </div>
    </div>
  </div>
</nav>
```

#### Tab Navigation
```jsx
<div className="tab-nav">
  <button className="tab-item-active">
    For You
  </button>
  <button className="tab-item-inactive">
    Saved
  </button>
  <button className="tab-item-inactive">
    Orders
  </button>
</div>
```

#### Sidebar Navigation
```jsx
<nav className="space-y-1">
  <a href="/feed" className="nav-item-active">
    <Home size={20} />
    <span>Home</span>
  </a>
  <a href="/explore" className="nav-item-inactive">
    <Compass size={20} />
    <span>Explore</span>
  </a>
  <a href="/orders" className="nav-item-inactive">
    <ShoppingBag size={20} />
    <span>My Orders</span>
  </a>
</nav>
```

### 6. Avatars

```jsx
// Sizes
<div className="avatar-xs">...</div>  {/* 24px */}
<div className="avatar-sm">...</div>  {/* 32px */}
<div className="avatar-md">...</div>  {/* 40px */}
<div className="avatar-lg">...</div>  {/* 48px */}
<div className="avatar-xl">...</div>  {/* 64px */}
<div className="avatar-2xl">...</div> {/* 96px */}

// Premium avatar (with glow)
<div className="avatar-md avatar-premium">
  <img src="/avatar.jpg" alt="Premium User" />
</div>
```

### 7. Loading States

#### Skeleton Loaders
```jsx
<div className="card-elevated p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="skeleton-avatar w-12 h-12"></div>
    <div className="flex-1">
      <div className="skeleton-text w-32"></div>
      <div className="skeleton-text w-24"></div>
    </div>
  </div>
  <div className="skeleton-image mb-4"></div>
  <div className="skeleton-title"></div>
  <div className="skeleton-text"></div>
  <div className="skeleton-text w-2/3"></div>
</div>
```

#### Spinner
```jsx
<div className="spinner"></div>
<div className="spinner-sm"></div>
```

---

## Layout System

### LinkedIn-inspired 3-Column Layout

```jsx
<div className="layout-container">
  {/* Left Sidebar - 280px */}
  <aside className="sidebar">
    <div className="sidebar-card">
      {/* User profile quick view */}
      <div className="flex flex-col items-center text-center">
        <div className="avatar-xl mb-3">
          <img src="/avatar.jpg" alt="User" />
        </div>
        <h3 className="font-semibold">John Doe</h3>
        <p className="text-sm text-text-secondary">NYU Student</p>
      </div>
    </div>

    <div className="sidebar-card">
      {/* Navigation */}
      <nav className="space-y-1">
        <a href="#" className="nav-item-active">
          <Home size={20} />
          <span>Home</span>
        </a>
        {/* More nav items */}
      </nav>
    </div>
  </aside>

  {/* Main Content - Flexible */}
  <main className="space-y-4">
    {/* Feed posts, meal cards, etc. */}
  </main>

  {/* Right Sidebar - 300px */}
  <aside className="sidebar">
    <div className="sidebar-card">
      <h3 className="font-semibold mb-3">Trending Meals</h3>
      {/* Trending content */}
    </div>

    <div className="sidebar-card">
      <h3 className="font-semibold mb-3">Quick Cart</h3>
      {/* Cart preview */}
    </div>
  </aside>
</div>
```

### Responsive Behavior
- **Desktop (>1024px)**: 3 columns (280px | flex | 300px)
- **Tablet (768-1024px)**: 2 columns (240px | flex), right sidebar hidden
- **Mobile (<768px)**: 1 column, sidebars hidden/bottom sheet

---

## Usage Examples

### Complete Meal Listing Card
```jsx
<div className="meal-card p-5 hover-lift">
  {/* Image with hover zoom */}
  <div className="meal-card__image-container">
    <img
      src="/meals/spicy-bowl.jpg"
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
    <span>🔥 450 cal</span>
    <span>⚡ 35g protein</span>
    <span>⏱️ 15 min</span>
  </div>

  {/* Rating & Price */}
  <div className="flex items-center justify-between">
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
  <button className="btn-primary w-full mt-4">
    <ShoppingCart size={18} />
    Add to Cart
  </button>
</div>
```

### Feed Post Card (Social)
```jsx
<article className="card-elevated p-6">
  {/* Header */}
  <div className="flex items-center gap-3 mb-4">
    <div className="avatar-md">
      <img src="/users/john.jpg" alt="John" />
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
      src="/posts/meal-photo.jpg"
      alt="Meal"
      className="w-full h-96 object-cover"
    />
  </div>

  {/* Actions */}
  <div className="flex items-center justify-between pt-4 border-t border-border">
    <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
      <Heart size={20} />
      <span className="text-sm font-medium">124</span>
    </button>
    <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
      <MessageCircle size={20} />
      <span className="text-sm font-medium">18</span>
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
```

### Restaurant Card
```jsx
<div className="card-elevated p-5 hover-lift cursor-pointer">
  {/* Image */}
  <div className="relative rounded-lg overflow-hidden mb-4 h-48">
    <img
      src="/restaurants/kimmel.jpg"
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
```

### Cart Summary Widget (Right Sidebar)
```jsx
<div className="sidebar-card sticky top-20">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold">Your Cart</h3>
    <span className="badge-popular">3 items</span>
  </div>

  {/* Cart items */}
  <div className="space-y-3 mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg overflow-hidden">
        <img src="/meals/bowl.jpg" alt="Bowl" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-1">Spicy Chicken Bowl</p>
        <p className="text-xs text-text-tertiary">x1</p>
      </div>
      <p className="text-sm font-semibold">$12.99</p>
    </div>
    {/* More items... */}
  </div>

  {/* Totals */}
  <div className="pt-4 border-t border-border space-y-2 mb-4">
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">Subtotal</span>
      <span className="font-medium">$34.97</span>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">Delivery</span>
      <span className="font-medium">$2.99</span>
    </div>
    <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-border">
      <span>Total</span>
      <span className="text-primary">$37.96</span>
    </div>
  </div>

  {/* CTA */}
  <button className="btn-primary w-full">
    Checkout
  </button>
</div>
```

---

## Design Principles

### 1. **Warmer than LinkedIn**
- Orange primary vs blue (appetite stimulation)
- Larger border radius (12px vs 8px) for friendlier feel
- More elevation and shadows for premium feel

### 2. **Food Photography First**
- Optimized image containers with zoom on hover
- Gradient overlays for readability
- Aspect ratios designed for food photos (4:3, 16:9)

### 3. **Clear Hierarchy**
- Bold CTAs with primary orange
- Secondary actions in teal
- Tertiary actions in ghost style
- Badges for quick category identification

### 4. **Micro-interactions**
- Hover lift on cards
- Button press feedback
- Smooth transitions (200ms standard)
- Loading states for all async actions

### 5. **Accessibility**
- Focus states with primary color outline
- Sufficient color contrast (WCAG AA)
- Touch targets minimum 44x44px
- Semantic HTML structure

---

## Quick Reference

### Spacing Scale (8px grid)
```
xs:  4px   sm:  8px   md: 16px
lg: 24px   xl: 32px  2xl: 48px
```

### Border Radius
```
sm: 6px   md: 8px   lg: 12px (standard)
xl: 16px  2xl: 20px  3xl: 24px (cards)
```

### Shadows
```
soft:        Minimal elevation
card:        Default cards
card-hover:  Hover state
elevated:    Premium cards
premium:     Special features
```

### Colors Quick Access
```jsx
// Tailwind classes
bg-primary text-primary border-primary
bg-secondary text-secondary border-secondary
bg-accent text-accent border-accent

// Shades
bg-primary-light bg-primary-dark
bg-secondary-light bg-secondary-dark
```

---

## Need Help?

Refer to:
- [tailwind.config.js](./tailwind.config.js) for all design tokens
- [globals.css](./src/app/globals.css) for component styles
- LinkedIn.com for UX patterns and interactions

**Remember**: Start with existing components, customize as needed, and maintain consistency across the app!
