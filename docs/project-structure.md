# Project Structure Guidelines

## Directory Organization

```
linkshortner/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups (optional)
│   ├── api/               # API route handlers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [feature]/        # Feature-specific components
├── db/                    # Database
│   ├── index.ts          # Database client
│   └── schema.ts         # Drizzle schema
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities (cn, etc.)
├── public/               # Static assets
├── docs/                 # Agent instructions
├── drizzle/              # Migration files (generated)
└── [config files]        # Configuration files
```

## File Naming Conventions

### Next.js Special Files
- `page.tsx` - Route page component
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `route.ts` - API route handler
- `middleware.ts` - Middleware

### Component Files
```
# React components
ComponentName.tsx         # PascalCase for components
use-hook-name.ts          # kebab-case for hooks
componentName.utils.ts    # camelCase for utilities
```

### Non-Component Files
```
kebab-case.ts            # Utilities, configs, types
snake_case.sql           # SQL/migration files
```

## Import Paths

### Path Aliases
The project uses `@/*` for absolute imports:

```typescript
// ✅ Good: Absolute imports with @/
import { db } from "@/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@/db/schema"

// ❌ Bad: Relative imports for cross-directory
import { db } from "../../../db"
```

### Import Order
Organize imports in this order:

```typescript
// 1. External packages
import { useState } from "react"
import type { Metadata } from "next"

// 2. Internal absolute imports (@/)
import { db } from "@/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 3. Relative imports (same directory)
import { helper } from "./helper"

// 4. Type imports (can be mixed or at end)
import type { User } from "@/db/schema"
```

### Import Grouping
```typescript
// Separate with blank lines
import { useState, useEffect } from "react"
import type { NextPage } from "next"

import { db } from "@/db"
import { users } from "@/db/schema"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { User } from "@/db/schema"
```

## Component Organization

### Server Components (Default)
```
app/
  dashboard/
    page.tsx              # Server component
    layout.tsx
    loading.tsx
```

### Client Components
```
components/
  dashboard/
    dashboard-chart.tsx   # "use client"
    dashboard-stats.tsx   # "use client"
```

### Shared UI Components
```
components/
  ui/
    button.tsx           # shadcn/ui component
    dialog.tsx
    input.tsx
```

## Feature-Based Organization

For larger features, group related files:

```
app/
  links/
    page.tsx                    # Links list page
    [id]/
      page.tsx                  # Link detail page
      edit/
        page.tsx                # Edit link page
    
components/
  links/
    link-card.tsx              # Link display component
    link-form.tsx              # Link form component
    link-stats.tsx             # Link statistics

lib/
  links/
    validation.ts              # Link validation logic
    utils.ts                   # Link utilities
```

## Database Structure

### Schema Organization
```typescript
// db/schema.ts
// Group related tables
export const users = pgTable(/* ... */)
export const sessions = pgTable(/* ... */)

export const links = pgTable(/* ... */)
export const linkClicks = pgTable(/* ... */)

// Relations at the end
export const usersRelations = relations(/* ... */)
export const linksRelations = relations(/* ... */)

// Type exports
export type User = InferSelectModel<typeof users>
export type Link = InferSelectModel<typeof links>
```

### Migration Files
```
drizzle/
  0000_initial_schema.sql
  0001_add_clicks_table.sql
  0002_add_user_indexes.sql
```

## Configuration Files

### Root Level Configs
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `drizzle.config.ts` - Drizzle Kit configuration
- `components.json` - shadcn/ui configuration
- `postcss.config.mjs` - PostCSS configuration
- `package.json` - Dependencies and scripts

## Environment Variables

### .env.local (gitignored)
```env
DATABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

### .env.example (committed)
```env
DATABASE_URL=your_database_url_here
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Static Assets

### Public Directory
```
public/
  images/
    logo.svg
    hero.png
  fonts/           # If using local fonts
  favicon.ico
```

### Usage
```typescript
import Image from "next/image"

<Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
```

## Type Definitions

### Global Types
```
types/
  global.d.ts              # Global type declarations
  api.ts                   # API types
  database.ts              # Database types
```

### Co-located Types
```typescript
// For component-specific types, define in same file
interface UserCardProps {
  user: User
  onEdit: () => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // ...
}
```

## Utilities Organization

### Shared Utilities
```
lib/
  utils.ts                # Common utilities (cn, etc.)
  api/
    client.ts            # API client utilities
    errors.ts            # Error handling
  validation/
    schemas.ts           # Validation schemas
```

### Feature-Specific Utilities
Co-locate with feature:
```
app/
  links/
    utils/
      generate-short-code.ts
      validate-url.ts
```

## API Routes

### Route Handler Organization
```
app/
  api/
    links/
      route.ts                  # GET, POST /api/links
      [id]/
        route.ts                # GET, PUT, DELETE /api/links/:id
        clicks/
          route.ts              # GET /api/links/:id/clicks
```

### Route Handler Pattern
```typescript
// app/api/links/route.ts
export async function GET(request: Request) { }
export async function POST(request: Request) { }

// app/api/links/[id]/route.ts
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: RouteContext) { }
export async function PUT(request: Request, context: RouteContext) { }
export async function DELETE(request: Request, context: RouteContext) { }
```

## Best Practices

### Co-location
Keep related files close together:
```
✅ Good:
components/
  user-profile/
    user-profile.tsx
    user-profile.test.tsx
    user-profile.utils.ts

❌ Bad:
components/user-profile.tsx
tests/user-profile.test.tsx
utils/user-profile-utils.ts
```

### Index Files
Avoid index.ts barrel files unless exporting many related items:
```typescript
// ✅ Good: Direct imports
import { Button } from "@/components/ui/button"

// ❌ Avoid: Barrel files that re-export
import { Button } from "@/components/ui"
```

### Single Responsibility
Each file should have a single clear purpose:
- One component per file
- One route handler per file
- Utilities grouped by feature

### Naming Consistency
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `PascalCase` (UserProfile, ApiResponse)
- Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## Git Ignore

Essential entries:
```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env.local
.env*.local

# Database
drizzle/

# IDE
.vscode/
.idea/

# OS
.DS_Store
```
