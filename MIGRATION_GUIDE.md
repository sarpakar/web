# Migration Guide: Updating to the New Design System

This guide will help you transition your existing components to use the new Campus Meals design system.

## Quick Reference: Old vs New

### Colors

#### Before (Handshake/Reddit-inspired)
```jsx
// Old primary (gray-ish)
bg-primary-900        → bg-primary (orange)
text-primary          → text-text-primary
bg-accent text-white  → bg-primary text-white

// Old accent (Reddit orange)
bg-accent-DEFAULT     → bg-primary
hover:bg-accent-hover → hover:bg-primary-dark

// Old surfaces
bg-surface           → bg-background
bg-white             → bg-background-card
```

#### After (Food-focused)
```jsx
// New vibrant colors
bg-primary           // Energetic orange #FF6B35
bg-secondary         // Fresh teal #4ECDC4
bg-accent            // Vibrant yellow #FFD93D

// Text hierarchy
text-text-primary    // #1A1A1A (main text)
text-text-secondary  // #666666 (supporting text)
text-text-tertiary   // #999999 (muted text)
```

### Components

#### Cards
```jsx
// Before
<div className="bg-white rounded-xl border border-border shadow-card">

// After
<div className="card-elevated">           // More elevation, rounded-xl
<div className="meal-card">               // For food items
<div className="card-premium">            // For premium features
```

#### Buttons
```jsx
// Before
<button className="px-6 py-3 bg-accent-DEFAULT text-white rounded-lg">

// After
<button className="btn-primary">         // Pill-shaped, hover lift
<button className="btn-secondary">       // Teal alternative
<button className="btn-outline">         // White with border
<button className="btn-ghost">           // Minimal style
```

#### Badges
```jsx
// Before
<span className="badge-new bg-green-50 text-green-600">

// After
<span className="badge-new">             // Yellow with pulse animation
<span className="badge-popular">         // Orange for popular items
<span className="badge-vegan">           // Green for vegan
<span className="badge-spicy">           // Red for spicy
<span className="badge-premium">         // Gradient premium badge
```

---

## Step-by-Step Migration

### 1. Update Your Header Component

**File**: `src/components/layout/Header.tsx`

#### Before:
```jsx
<header className="sticky top-0 z-30 bg-white border-b border-border">
  <div className="flex items-center justify-between px-6 h-14">
    <h1 className="text-lg font-semibold text-text-primary">Feed</h1>
    // ...
  </div>
</header>
```

#### After:
```jsx
<header className="navbar">
  <div className="navbar-container">
    <div className="navbar-logo">
      <Utensils size={24} />
      <span>Campus Meals</span>
    </div>

    <div className="navbar-search">
      <SearchBar />
    </div>

    <div className="navbar-actions">
      <button className="btn-icon relative">
        <Bell size={20} />
        <span className="notification-badge">3</span>
      </button>
      {/* More actions */}
    </div>
  </div>
</header>
```

### 2. Update Feed Posts

**File**: `src/components/feed/FeedPost.tsx`

#### Find and Replace:
```jsx
// Old background
bg-white → bg-background-card

// Old borders
border-border → border-border (same, but card-elevated has better shadow)

// Old buttons
bg-accent-DEFAULT → bg-primary
hover:bg-accent-hover → hover:bg-primary-dark

// Old text colors
text-text-primary → text-text-primary (same)
text-text-secondary → text-text-secondary (same)
```

#### Wrap in new card style:
```jsx
// Before
<div className="bg-white rounded-xl border border-border shadow-card">

// After
<article className="card-elevated p-6">
  {/* Same content */}
</article>
```

### 3. Update Meal Cards

**File**: `src/components/meals/*` or similar

#### Before:
```jsx
<div className="bg-white rounded-xl overflow-hidden">
  <img src="..." className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3>Meal Name</h3>
    <p>Description</p>
    <button className="bg-accent text-white px-4 py-2 rounded-lg">
      Add to Cart
    </button>
  </div>
</div>
```

#### After:
```jsx
<div className="meal-card p-5">
  <div className="meal-card__image-container">
    <img src="..." className="meal-card__image" />
    <div className="meal-card__image-overlay">
      {/* Optional overlay content */}
    </div>
  </div>

  <div className="flex items-center gap-2 mb-3">
    <span className="badge-popular">POPULAR</span>
  </div>

  <h3 className="text-lg font-semibold mb-1">Meal Name</h3>
  <p className="text-sm text-text-secondary mb-3">Description</p>

  <button className="btn-primary w-full">
    <ShoppingCart size={18} />
    Add to Cart
  </button>
</div>
```

### 4. Update Vendor Cards

**File**: `src/components/vendors/VendorCard.tsx`

#### Before:
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-4">
  <img src="..." className="rounded-lg mb-3" />
  <h3 className="font-semibold">Restaurant Name</h3>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

#### After:
```jsx
<div className="card-elevated p-5 hover-lift cursor-pointer">
  <div className="relative rounded-lg overflow-hidden mb-4 h-48">
    <img src="..." className="w-full h-full object-cover" />
    <div className="absolute top-3 right-3">
      <span className="badge-new">NEW</span>
    </div>
  </div>

  <div className="flex items-start justify-between mb-2">
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-1">Restaurant Name</h3>
      <p className="text-sm text-text-secondary">Category • Type</p>
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
    </div>
    <span className="text-text-tertiary">15-25 min</span>
  </div>

  {/* Badges */}
  <div className="flex flex-wrap gap-2">
    <span className="badge-healthy">Healthy Options</span>
  </div>
</div>
```

### 5. Update Navigation Items

**File**: `src/components/layout/Sidebar.tsx`

#### Before:
```jsx
<a href="/feed" className="flex items-center gap-3 px-3 py-2.5 bg-gray-100 text-gray-900 rounded-lg">
  <Home size={20} />
  <span>Home</span>
</a>
```

#### After:
```jsx
<a href="/feed" className="nav-item-active">
  <Home size={20} />
  <span>Home</span>
</a>

<a href="/explore" className="nav-item-inactive">
  <Compass size={20} />
  <span>Explore</span>
</a>
```

### 6. Update Loading States

#### Before:
```jsx
<div className="animate-pulse">
  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
</div>
```

#### After:
```jsx
<div className="card-elevated p-5">
  <div className="skeleton-image mb-4"></div>
  <div className="skeleton-title mb-2"></div>
  <div className="skeleton-text mb-2"></div>
  <div className="skeleton-text w-2/3"></div>
</div>

{/* Or use the component */}
<MealCardSkeleton />
```

### 7. Update Forms

#### Before:
```jsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
/>
```

#### After:
```jsx
<input
  type="text"
  className="input"
/>

{/* Search input */}
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
  <input type="search" className="search-input" />
</div>

{/* Select */}
<select className="select">
  <option>Option 1</option>
</select>
```

---

## Automated Find & Replace

Use these in your editor for quick updates:

### VS Code Find & Replace (Regex)

```regex
Find:    bg-accent-DEFAULT
Replace: bg-primary

Find:    hover:bg-accent-hover
Replace: hover:bg-primary-dark

Find:    bg-accent text-white
Replace: bg-primary text-white

Find:    bg-surface(?!-)
Replace: bg-background

Find:    text-primary(?!-)
Replace: text-text-primary

Find:    rounded-xl border border-border shadow-card
Replace: card-elevated
```

---

## Component-by-Component Checklist

### Pages to Update

- [ ] `/feed/page.tsx` - Update to use new card styles
- [ ] `/explore/page.tsx` - Update meal cards
- [ ] `/profile/page.tsx` - Update stats widgets
- [ ] `/search/page.tsx` - Update search bar
- [ ] `/log-meal/page.tsx` - Update forms

### Components to Update

- [ ] `Header.tsx` - Migrate to navbar classes
- [ ] `Sidebar.tsx` - Update nav items
- [ ] `RightSidebar.tsx` - Update widgets
- [ ] `FeedPost.tsx` - Use card-elevated
- [ ] `PostComposer.tsx` - Update buttons
- [ ] `VendorCard.tsx` - Use restaurant card pattern
- [ ] `MealCard.tsx` (if exists) - Use meal-card
- [ ] `CommunityCard.tsx` - Update card style
- [ ] `ChallengeCard.tsx` - Update badge styles
- [ ] `FilterPills.tsx` - Update badges

---

## Testing Checklist

After migration, test:

- [ ] **Colors** - All brand colors show orange/teal/yellow
- [ ] **Hover effects** - Cards lift on hover
- [ ] **Button states** - All buttons have proper hover/active states
- [ ] **Loading states** - Skeletons show smooth shimmer
- [ ] **Forms** - Inputs have glow effect on focus
- [ ] **Navigation** - Active states show orange highlight
- [ ] **Responsive** - Layout works on mobile/tablet/desktop
- [ ] **Images** - Food photos zoom on hover
- [ ] **Badges** - All badges use new color system

---

## Common Issues & Solutions

### Issue: Colors look wrong
**Solution**: Clear your browser cache and rebuild
```bash
rm -rf .next
npm run dev
```

### Issue: Tailwind classes not working
**Solution**: Make sure tailwind.config.js is updated and restart dev server

### Issue: Layout breaking on mobile
**Solution**: Use the `layout-container` class which handles responsive breakpoints automatically

### Issue: Animations not smooth
**Solution**: Check that you're using the new transition classes:
```jsx
transition-all duration-200  // Standard
hover:shadow-card-hover      // Hover shadows
hover-lift                   // Hover lift effect
```

---

## Performance Tips

1. **Use skeleton loaders** instead of spinners for better UX
2. **Lazy load images** with `loading="lazy"` attribute
3. **Optimize images** - Use WebP format when possible
4. **Use the `hover-lift` utility** instead of custom transform code
5. **Batch animations** using `animation-delay-*` utilities

---

## Need Help?

1. Check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for full documentation
2. See [DesignSystemExamples.tsx](./src/components/examples/DesignSystemExamples.tsx) for copy-paste examples
3. Reference LinkedIn.com for UX patterns

---

## Migration Priority

### Phase 1: Critical (Do First) ⭐
1. Update color variables in tailwind.config.js ✅ (Done)
2. Update globals.css ✅ (Done)
3. Update Header/Navbar
4. Update primary buttons (CTAs)

### Phase 2: High Priority
1. Update all card components
2. Update navigation items
3. Update form inputs
4. Update badges

### Phase 3: Polish
1. Add hover effects to cards
2. Add loading skeletons
3. Add micro-animations
4. Optimize images

---

## Before & After Examples

### Feed Page
**Before**: Gray cards, blue buttons, flat design
**After**: Elevated white cards, orange buttons, subtle shadows, hover lifts

### Meal Cards
**Before**: Static images, simple borders
**After**: Zoom on hover, gradient overlays, vibrant badges, animated CTAs

### Buttons
**Before**: Rectangular, static
**After**: Pill-shaped, lift on hover, press feedback

---

Good luck with the migration! The new design system will make your app feel much more premium and food-focused. 🎨🍔
