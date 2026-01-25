# Campus Meals - Glassmorphic Button Design System

> A comprehensive guide to implementing glassmorphic buttons with shadows following Campus Meals design patterns

## 🎨 Core Glassmorphism Pattern

All buttons in Campus Meals follow a premium glassmorphic aesthetic with the following signature style:

### Base Glass Formula
```css
backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]
```

**Breakdown:**
- `backdrop-blur-lg` - Creates the signature frosted glass effect (16px blur)
- `bg-white/60` - Semi-transparent white background (60% opacity)
- `rounded-[32px]` - Large border radius for premium, soft feel
- `border border-gray-200` - Subtle border for definition
- `shadow-[0_8px_30px_rgba(0,0,0,0.04)]` - Soft, elevated shadow

---

## 🔘 Button Variants

### 1. Primary Glass Button

**Use case:** Main CTAs, important actions, submit buttons

```tsx
<button className="flex items-center justify-center gap-2 px-6 py-3 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 font-semibold text-base">
  Continue
</button>
```

**Key features:**
- `rounded-full` - Perfect for CTAs
- `hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]` - Enhanced shadow on hover
- `hover:scale-[1.02]` - Subtle scale effect for interactivity
- `transition-all duration-200` - Smooth 200ms transitions

---

### 2. Dark Glass Button

**Use case:** Primary actions with strong emphasis, login/signup

```tsx
<button className="flex items-center justify-center gap-2 w-full p-2.5 backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 text-white rounded-lg font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 outline-none select-none hover:scale-[1.02] active:scale-[0.98]">
  Sign In
</button>
```

**Key features:**
- `bg-gray-900/95` - Dark glassmorphism
- `backdrop-blur-2xl` - Extra blur for premium feel (24px blur)
- `active:scale-[0.98]` - Press feedback
- `select-none` - Prevents text selection on click

---

### 3. Light Interactive Button

**Use case:** Cards, selection options, secondary actions

```tsx
<button className="flex flex-col items-start p-5 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-left hover:scale-[1.02] transition-all duration-200 group">
  <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Option Title</h3>
  <p className="text-sm text-[#86868B] leading-relaxed">Option description</p>
</button>
```

**Key features:**
- `rounded-[32px]` - Premium card-like feel
- `text-left` - Content-aligned for card buttons
- `group` - Enables group-hover effects for child elements

---

### 4. Nested Glass Input (Interactive)

**Use case:** Input-style buttons, post composers, search triggers

```tsx
<div className="flex-1 px-5 py-2.5 backdrop-blur-md bg-white/40 hover:bg-white/60 border border-gray-200/40 rounded-full text-gray-500 text-base font-normal transition-all duration-200 cursor-pointer">
  Share something with the community...
</div>
```

**Key features:**
- `bg-white/40` - Lighter base for nested glass
- `hover:bg-white/60` - Increases opacity on hover
- `border-gray-200/40` - Semi-transparent border
- `backdrop-blur-md` - Medium blur (12px)

---

### 5. Icon-Only Glass Button

**Use case:** Action buttons, close buttons, utility controls

```tsx
<button className="w-10 h-10 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-200 flex items-center justify-center">
  <svg className="w-5 h-5" />
</button>
```

**Key features:**
- `w-10 h-10` - Fixed size for consistency
- `hover:scale-105` - Slightly larger scale for small buttons
- Centered icon with flexbox

---

### 6. Minimal Glass Button (Ghost)

**Use case:** Tertiary actions, cancel buttons, low-emphasis actions

```tsx
<button className="px-4 py-2 backdrop-blur-md bg-white/20 hover:bg-white/40 rounded-full border border-gray-200/30 hover:border-gray-300 transition-all duration-200 text-gray-700 text-sm font-medium">
  Cancel
</button>
```

**Key features:**
- `bg-white/20` - Very subtle background
- `border-gray-200/30` - Minimal border
- `hover:bg-white/40` - More visible on hover

---

## 🎭 State Variations

### Loading State

```tsx
<button
  disabled
  className="flex items-center justify-center gap-2 px-6 py-3 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-200 font-semibold text-base opacity-60 cursor-not-allowed"
>
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
  Processing...
</button>
```

### Disabled State

```tsx
<button
  disabled
  className="px-6 py-3 backdrop-blur-lg bg-white/30 rounded-full border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] font-semibold text-base text-gray-400 cursor-not-allowed"
>
  Unavailable
</button>
```

### Active/Selected State

```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-white/80 rounded-full border-2 border-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-semibold text-base scale-[1.02]">
  Selected
</button>
```

---

## 🎨 Color Variations

### Success Glass

```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-green-50/60 hover:bg-green-50/80 rounded-full border border-green-200 shadow-[0_8px_30px_rgba(34,197,94,0.1)] hover:shadow-[0_20px_60px_rgba(34,197,94,0.15)] hover:scale-[1.02] transition-all duration-200 font-semibold text-green-700">
  Confirm
</button>
```

### Error/Danger Glass

```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-red-50/60 hover:bg-red-50/80 rounded-full border border-red-200 shadow-[0_8px_30px_rgba(239,68,68,0.1)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.15)] hover:scale-[1.02] transition-all duration-200 font-semibold text-red-700">
  Delete
</button>
```

### Warning Glass

```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-amber-50/60 hover:bg-amber-50/80 rounded-full border border-amber-200 shadow-[0_8px_30px_rgba(245,158,11,0.1)] hover:shadow-[0_20px_60px_rgba(245,158,11,0.15)] hover:scale-[1.02] transition-all duration-200 font-semibold text-amber-700">
  Warning
</button>
```

### Info Glass

```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-blue-50/60 hover:bg-blue-50/80 rounded-full border border-blue-200 shadow-[0_8px_30px_rgba(59,130,246,0.1)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] hover:scale-[1.02] transition-all duration-200 font-semibold text-blue-700">
  Learn More
</button>
```

---

## 📐 Sizing System

### Extra Small (`btn-glass-xs`)
```tsx
<button className="px-3 py-1.5 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 text-xs font-semibold">
  Tag
</button>
```

### Small (`btn-glass-sm`)
```tsx
<button className="px-4 py-2 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 text-sm font-semibold">
  Small
</button>
```

### Medium (`btn-glass-md`) - Default
```tsx
<button className="px-6 py-3 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 text-base font-semibold">
  Medium
</button>
```

### Large (`btn-glass-lg`)
```tsx
<button className="px-8 py-4 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 text-lg font-semibold">
  Large
</button>
```

---

## 🎯 Best Practices

### 1. **Always Use Backdrop Blur**
Every button should have `backdrop-blur-{size}` for the signature glass effect.

### 2. **Layer Your Shadows**
Use lighter shadows at rest, heavier on hover:
- Rest: `shadow-[0_8px_30px_rgba(0,0,0,0.04)]`
- Hover: `hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]`

### 3. **Consistent Border Radius**
- Buttons: `rounded-full` (pill shape)
- Cards/Large buttons: `rounded-[32px]` or `rounded-[24px]`
- Icon buttons: `rounded-full`
- Standard elements: `rounded-lg` (8px)

### 4. **Scale on Hover**
Always include `hover:scale-[1.02]` for interactive feedback (icon buttons can use `1.05`)

### 5. **Transition Everything**
Use `transition-all duration-200` for smooth, polished interactions

### 6. **Opacity Levels**
- Light glass: `bg-white/40` to `bg-white/60`
- Medium glass: `bg-white/60` to `bg-white/80`
- Dark glass: `bg-gray-900/90` to `bg-gray-900/95`

### 7. **Group Hover for Cards**
Add `group` class to parent, use `group-hover:` for child animations

### 8. **Active States**
Include `active:scale-[0.98]` for press feedback on primary actions

---

## 🚀 Real-World Examples

### Login Button (from codebase)
```tsx
<button className="flex items-center justify-center gap-2 w-full p-2.5 backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 text-white rounded-lg font-semibold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-200 outline-none select-none hover:scale-[1.02] active:scale-[0.98]">
  <svg className="w-5 h-5" />
  Sign In
</button>
```

### Search/Filter Card Button (from codebase)
```tsx
<button className="flex flex-col items-start p-5 backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-left hover:scale-[1.02] transition-all duration-200 group">
  <div className="flex -space-x-2 mb-4">
    {/* Avatars with ring effects */}
    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all duration-200">
      <img src="/avatar.jpg" alt="User" className="w-full h-full object-cover" />
    </div>
  </div>
  <h3 className="text-base font-semibold text-[#1D1D1F] mb-1">Title</h3>
  <p className="text-sm text-[#86868B] leading-relaxed">Description text</p>
</button>
```

### Post Composer Input (from codebase)
```tsx
<div className="backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4">
  <div className="flex items-center gap-3">
    <Avatar src={photoURL} name={displayName} size="md" />
    <div className="flex-1 px-5 py-2.5 backdrop-blur-md bg-white/40 hover:bg-white/60 border border-gray-200/40 rounded-full text-gray-500 text-base font-normal transition-all duration-200 cursor-pointer">
      Share something with the community...
    </div>
  </div>
</div>
```

---

## 🎨 Shadow Reference Guide

### Elevation Levels

```css
/* Level 1 - Subtle (resting state) */
shadow-[0_4px_12px_rgba(0,0,0,0.04)]

/* Level 2 - Default (cards, buttons at rest) */
shadow-[0_8px_30px_rgba(0,0,0,0.04)]

/* Level 3 - Elevated (hover state) */
shadow-[0_20px_60px_rgba(0,0,0,0.08)]

/* Level 4 - Dark elements */
shadow-[0_4px_12px_rgba(0,0,0,0.15)]
shadow-[0_8px_20px_rgba(0,0,0,0.25)]
```

---

## 📱 Responsive Considerations

### Mobile Optimization
```tsx
<button className="px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 text-sm sm:text-base font-semibold">
  Responsive Button
</button>
```

### Touch Targets
Ensure minimum 44x44px touch targets on mobile:
```tsx
<button className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 ...">
  Touch-Friendly
</button>
```

---

## ⚡ Performance Tips

1. **Use `backdrop-blur` sparingly** - It's GPU-intensive
2. **Prefer `will-change-transform`** for frequently animated buttons
3. **Avoid blur on large surfaces** on low-end devices
4. **Use `transition-all` only when necessary** - specify properties for better performance

```tsx
// Optimized transitions
<button className="... transition-[transform,shadow,background-color] duration-200">
  Optimized
</button>
```

---

## 🎓 Quick Reference

### Copy-Paste Templates

**Standard Glass Button:**
```
backdrop-blur-lg bg-white/60 rounded-full border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200
```

**Dark Glass Button:**
```
backdrop-blur-2xl bg-gray-900/95 hover:bg-gray-900 text-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
```

**Glass Card Button:**
```
backdrop-blur-lg bg-white/60 rounded-[32px] border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200
```

---

## 🔗 Related Files

- `src/app/globals.css` - Core design system styles
- `DESIGN_SYSTEM.md` - Complete design system documentation
- `src/components/search/SearchChat.tsx` - Glass button examples
- `src/components/feed/PostComposer.tsx` - Nested glass examples
- `src/components/layout/Sidebar.tsx` - Dark glass examples

---

**Last Updated:** January 2026
**Maintained By:** Campus Meals Design Team
