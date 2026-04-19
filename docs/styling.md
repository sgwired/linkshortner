# Styling Guidelines

## Tech Stack
- **Tailwind CSS v4** (latest major version)
- **PostCSS** with @tailwindcss/postcss
- **Design System**: shadcn/ui base-nova style
- **Theme**: CSS variables with dark mode support

## Tailwind Configuration

### No Config File Required
Tailwind CSS v4 doesn't use a traditional config file. Configuration is done via CSS `@theme` directive in `globals.css`.

### Global Styles Location
`app/globals.css` contains:
- Tailwind directives
- CSS variables for theming
- Custom utility classes

## CSS Architecture

### Layer Structure
```css
@import "tailwindcss";

@theme {
  /* Theme configuration here */
}

@layer base {
  /* Base styles */
}

@layer components {
  /* Component-specific styles (use sparingly) */
}

@layer utilities {
  /* Custom utilities */
}
```

## Design Tokens

### CSS Variables
Define all design tokens as CSS variables:

```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  
  /* Spacing */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode overrides */
}
```

### Using Design Tokens
```typescript
// ✅ Use Tailwind classes that reference CSS variables
<div className="bg-background text-foreground" />

// ✅ Custom properties in arbitrary values
<div className="rounded-[--radius-md]" />
```

## Utility-First Approach

### Prefer Utilities Over Custom CSS
```typescript
// ✅ Good: Utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md">

// ❌ Avoid: Custom CSS classes for layout
<div className="card">
```

### When to Use Custom Components (@layer)
Only create component classes for:
1. Frequently repeated complex patterns
2. Third-party library style overrides
3. Base element defaults

```css
@layer components {
  .prose {
    /* Complex prose styling */
  }
}
```

## Responsive Design

### Mobile-First
Always use mobile-first breakpoints:

```typescript
// ✅ Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Desktop-first (don't use max-width breakpoints)
```

### Breakpoints
Default Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Dark Mode

### Class-Based Strategy
This project uses `class` strategy for dark mode:

```typescript
// Theme toggle managed by html class
<html className="dark">

// Use dark: variant
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

### Dark Mode Best Practices
- Define dark mode colors using CSS variables
- Test all components in both modes
- Use semantic color names (background, foreground, primary) rather than specific colors

## Component Styling

### Class Merging
Always use `cn()` utility to merge classes properly:

```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  conditional && "conditional-classes",
  className // Allow className override
)} />
```

### Variant Management
Use CVA (Class Variance Authority) for component variants:

```typescript
import { cva } from "class-variance-authority"

const styles = cva("base-classes", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})
```

## Layout Patterns

### Flexbox
```typescript
// Center content
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Vertical stack with gap
<div className="flex flex-col gap-4">
```

### Grid
```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Auto-fit columns
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
```

### Container
```typescript
// Max width container
<div className="container mx-auto px-4">

// Custom max width
<div className="max-w-7xl mx-auto">
```

## Typography

### Font Families
```typescript
// Defined in layout.tsx
import { Geist, Geist_Mono } from "next/font/google"

// Usage
<p className="font-sans">  // Geist Sans
<code className="font-mono">  // Geist Mono
```

### Text Sizing
```typescript
// Use semantic sizes
<h1 className="text-3xl font-semibold">
<p className="text-base leading-relaxed">
<small className="text-sm text-muted-foreground">
```

## Spacing

### Consistent Spacing Scale
Use Tailwind's default spacing scale (0.25rem increments):
- `gap-1` = 0.25rem
- `gap-2` = 0.5rem
- `gap-4` = 1rem
- `gap-6` = 1.5rem
- `gap-8` = 2rem

### Common Patterns
```typescript
// Card padding
<div className="p-6">

// Section spacing
<section className="py-12 px-4">

// Stack items
<div className="space-y-4">
```

## Colors

### Use Semantic Names
```typescript
// ✅ Good: Semantic colors
<button className="bg-primary text-primary-foreground">
<div className="bg-destructive text-destructive-foreground">

// ❌ Bad: Direct colors (unless specific need)
<button className="bg-blue-600 text-white">
```

### Opacity Modifiers
```typescript
// Background with opacity
<div className="bg-black/50">

// Border with opacity
<div className="border border-gray-200/80">
```

## Animations & Transitions

### Transitions
```typescript
// Hover transitions
<button className="transition-colors hover:bg-primary/80">

// All properties
<div className="transition-all duration-300">
```

### Custom Animations
Define in `globals.css`:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in;
}
```

## Accessibility

### Focus States
Always style focus states:
```typescript
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
```

### Color Contrast
- Ensure sufficient contrast ratios (WCAG AA minimum)
- Test in both light and dark modes
- Use contrast checking tools

## Performance

### JIT Compilation
Tailwind v4 uses JIT by default. Write any utility class and it will be generated.

### Purging
Tailwind automatically purges unused styles in production. Ensure dynamic classes are safe-listed if needed.

### Avoid Arbitrary Values Overuse
```typescript
// ✅ Prefer standard values
<div className="p-4">

// ⚠️ Use arbitrary values sparingly
<div className="p-[17px]">
```

## Best Practices

1. **Consistency**: Use design tokens consistently across the app
2. **Readability**: Break long className strings into logical groups
3. **Reusability**: Extract common patterns into components
4. **Maintainability**: Use CVA for variant-heavy components
5. **Performance**: Avoid inline styles when possible
6. **Accessibility**: Always consider keyboard navigation and screen readers
