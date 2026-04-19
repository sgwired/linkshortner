# Agent Instructions for Link Shortener Project

## Overview
This document provides comprehensive coding standards and guidelines for AI assistants working on this Next.js link shortener project. All agents should adhere to these guidelines to maintain code quality, consistency, and best practices.

## 🚨 Critical Notice
**This project uses Next.js 16.2.4** which has breaking changes from earlier versions. Always consult the relevant documentation before implementing features.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Runtime**: React 19.2.4
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (base-nova) with Base UI primitives
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Build Tool**: Turbopack (Next.js built-in)

## 📚 Detailed Guidelines

### Core Development Standards
All agents must read and follow the detailed guidelines in the `/docs` directory
ALWAYS refer to the relevant .md file BEFORE generating any code:

- **Authentication** - `/docs/authentication.md` - Clerk authentication, protected routes, redirects
- **UI Components** - `/docs/ui-components.md` - shadcn/ui usage, component patterns

## 🎯 Quick Reference

### Command Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit push        # Push schema to database
```

### Import Patterns
```typescript
// External packages first
import { useState } from "react"
import type { Metadata } from "next"

// Internal absolute imports (@/)
import { db } from "@/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Type imports
import type { User } from "@/db/schema"
```

### Common Utilities
```typescript
// Class merging
import { cn } from "@/lib/utils"
cn("base-classes", conditional && "conditional", className)

// Database client
import { db } from "@/db"

// Auth
import { auth, currentUser } from "@clerk/nextjs/server"
```

## ✅ Code Quality Standards

### TypeScript
- ✅ Always use explicit return types
- ✅ Enable all strict mode checks
- ✅ Use `import type` for type-only imports
- ❌ Never use `any` (use `unknown` instead)
- ✅ Prefer interfaces for objects, types for unions

### React Components
- ✅ Default to Server Components
- ✅ Mark Client Components with `"use client"`
- ✅ Use proper TypeScript typing
- ✅ Forward refs when needed
- ✅ Include accessibility attributes

### Styling
- ✅ Use Tailwind utility classes
- ✅ Use `cn()` utility for class merging
- ✅ Use CVA for component variants
- ✅ Mobile-first responsive design
- ✅ Support dark mode with `dark:` prefix

### Database
- ✅ Use Drizzle ORM query builder
- ✅ Type-safe queries with inferred types
- ✅ Use transactions for multi-step operations
- ❌ Never use raw SQL with user input
- ✅ Handle errors appropriately

### Authentication
- ✅ Protect routes with middleware
- ✅ Check auth state in Server Components
- ✅ Use Clerk hooks in Client Components
- ✅ Validate authentication in API routes
- ✅ Handle loading states properly

## 🔍 Before Writing Code

1. **Check existing patterns** - Look for similar implementations
2. **Read relevant guide** - Consult `/docs` for specific guidelines
3. **Verify Next.js version** - This is Next.js 16.2.4, not earlier versions
4. **Consider Server vs Client** - Default to Server Components
5. **Type everything** - Use TypeScript strict mode properly
6. **Test both themes** - Ensure dark mode compatibility

## 📝 File Creation Checklist

### Creating a Page
- [ ] Use `page.tsx` in appropriate directory
- [ ] Define proper TypeScript interfaces for props
- [ ] Export as default async function (if Server Component)
- [ ] Add metadata export or generateMetadata
- [ ] Implement proper error handling

### Creating a Component
- [ ] Choose Server or Client Component appropriately
- [ ] Add `"use client"` if needed
- [ ] Define TypeScript interface for props
- [ ] Use CVA for variants (if applicable)
- [ ] Support className prop with `cn()`
- [ ] Add proper accessibility attributes
- [ ] Test in light and dark mode

### Creating an API Route
- [ ] Use `route.ts` in `app/api/[route]/`
- [ ] Export named functions (GET, POST, etc.)
- [ ] Add authentication check
- [ ] Validate input data
- [ ] Return proper Response objects
- [ ] Handle errors appropriately

### Creating a Database Table
- [ ] Define schema in `db/schema.ts`
- [ ] Add proper constraints and indexes
- [ ] Define relations if needed
- [ ] Export inferred types
- [ ] Generate and run migration
- [ ] Update related code

## 🚫 Common Pitfalls to Avoid

1. **Don't** use old Next.js patterns (pages directory, getServerSideProps, etc.)
2. **Don't** make Client Components unnecessarily
3. **Don't** use inline styles instead of Tailwind
4. **Don't** use `any` type in TypeScript
5. **Don't** forget to handle loading and error states
6. **Don't** expose sensitive data to client
7. **Don't** skip authentication checks
8. **Don't** ignore TypeScript errors
9. **Don't** forget dark mode support
10. **Don't** use raw SQL with user input

## 🎨 Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use trailing commas
- Max line length: 100 characters (flexible)
- Use descriptive variable names
- Add comments for complex logic only

## 🔗 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: April 19, 2026
**Project Version**: 0.1.0

For questions or clarifications about these guidelines, refer to the specific documentation files in `/docs`.
