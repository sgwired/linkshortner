# Component Guidelines

## UI Component Architecture

### shadcn/ui with Base UI
This project uses **shadcn/ui** (base-nova style) built on **@base-ui/react** primitives.

#### Component Structure
```
components/
  ui/           # shadcn/ui components (Button, Dialog, etc.)
  [feature]/    # Feature-specific components
```

### Creating UI Components

#### Using CVA (Class Variance Authority)
All UI components should use CVA for variant management:

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes", // Base classes applied to all variants
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        outline: "outline-specific-classes",
      },
      size: {
        sm: "small-size-classes",
        md: "medium-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div className={cn(componentVariants({ variant, size }), className)} {...props} />
  )
}
```

### Base UI Primitives
When creating components, use Base UI primitives:
- `@base-ui/react/button` - Button primitive
- `@base-ui/react/dialog` - Dialog/Modal primitive
- And other Base UI components as needed

```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

## Component Patterns

### Server Components (Default)
```typescript
// app/components/user-profile.tsx
import { db } from "@/db"

interface UserProfileProps {
  userId: string
}

export async function UserProfile({ userId }: UserProfileProps) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId)
  })
  
  return <div>{user?.name}</div>
}
```

### Client Components
```typescript
"use client"

import { useState } from "react"

interface CounterProps {
  initialCount?: number
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Composition Pattern
Prefer composition over configuration:

```typescript
// ✅ Good: Composable
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>

// ❌ Avoid: Configuration-heavy
<Dialog
  trigger="Open"
  title="Title"
  content="Content here"
/>
```

### Polymorphic Components (asChild Pattern)
Support polymorphic components using the `asChild` pattern:

```typescript
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps {
  asChild?: boolean
  children: React.ReactNode
}

function Button({ asChild = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props}>{children}</Comp>
}

// Usage:
<Button asChild>
  <Link href="/home">Go Home</Link>
</Button>
```

## Styling

### className Utility
Always use the `cn()` utility for merging classes:

```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditional && "conditional-classes", className)} />
```

### Tailwind Conventions
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use design tokens from globals.css
- Leverage dark mode classes: `dark:class-name`

```typescript
<div className="flex items-center gap-2 md:gap-4 dark:bg-gray-900">
```

## Props Best Practices

### Extending Native Elements
```typescript
interface ComponentProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary'
}
```

### Children Props
```typescript
// Single child
children: React.ReactNode

// Multiple specific children
children: [React.ReactElement, React.ReactElement]

// Render prop
children: (data: Data) => React.ReactNode
```

### Ref Forwarding
```typescript
import { forwardRef } from "react"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />
  }
)
Button.displayName = "Button"
```

## File Organization
- One component per file
- Co-locate related components in feature directories
- Export components as named exports (not default for reusable UI components)
- Use default export only for pages and route handlers

## Icon Usage
Use **lucide-react** for icons:

```typescript
import { ChevronRight, User } from "lucide-react"

<Button>
  <User className="size-4" />
  Profile
</Button>
```

## Accessibility
- Use semantic HTML elements
- Include ARIA labels when needed
- Ensure keyboard navigation support
- Test with screen readers
- Use Base UI primitives that handle accessibility
