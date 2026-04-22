# Agent Instructions for Link Shortener Project

## Overview
This document provides comprehensive coding standards and guidelines for AI assistants working on this Next.js link shortener project. All agents should adhere to these guidelines to maintain code quality, consistency, and best practices.

## 🚨 Critical Notice
**This project uses Next.js 16.2.4** which has breaking changes from earlier versions. Always consult the relevant documentation before implementing features.

## ⚠️ MANDATORY REQUIREMENT - READ FIRST ⚠️

**🔴 STOP: Before generating ANY code, you MUST read the relevant instruction files in the `/docs` directory.**

This is not optional. Failure to read the appropriate documentation BEFORE coding will result in:
- ❌ Incorrect implementations that don't follow project patterns
- ❌ Breaking changes that violate established conventions
- ❌ Wasted time rewriting code to match standards
- ❌ Introduction of bugs and inconsistencies

### Required Reading Process:
1. **IDENTIFY** which area of the codebase you're working on
2. **READ** the corresponding `/docs/*.md` file(s) COMPLETELY
3. **UNDERSTAND** the patterns, rules, and examples provided
4. **ONLY THEN** begin writing code that follows those guidelines

### Available Documentation:
- **Authentication** → `/docs/authentication.md` - Read BEFORE working with auth, protected routes, or user data
- **UI Components** → `/docs/ui-components.md` - Read BEFORE creating or modifying components

**No exceptions. No shortcuts. Read the docs first, every time.**

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

**🚨 CRITICAL: Read `/docs` files BEFORE coding - This is non-negotiable! 🚨**

Every agent working on this project MUST:
1. **FIRST** identify which topic area they're working on
2. **SECOND** read the ENTIRE corresponding `/docs/*.md` file
3. **THIRD** reference the specific patterns and rules while coding
4. **NEVER** skip this process or assume you know the patterns

### Documentation Reference:
- **Authentication** - `/docs/authentication.md` - Clerk authentication, protected routes, redirects
  - Read BEFORE: Adding auth, protecting routes, accessing user data, handling redirects
- **UI Components** - `/docs/ui-components.md` - shadcn/ui usage, component patterns
  - Read BEFORE: Creating components, using UI libraries, styling patterns

**Reminder: If you haven't read the relevant doc file yet, STOP and read it now.**

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

**❗ FIRST AND FOREMOST:** Read the relevant `/docs/*.md` file for your task area
   - Authentication work? → Read `/docs/authentication.md` completely
   - UI/Component work? → Read `/docs/ui-components.md` completely
   - Don't skip this. Don't skim. Read thoroughly.

Then proceed with:
1. **Check existing patterns** - Look for similar implementations in the codebase
2. **Verify Next.js version** - This is Next.js 16.2.4, not earlier versions
3. **Consider Server vs Client** - Default to Server Components
4. **Type everything** - Use TypeScript strict mode properly
5. **Test both themes** - Ensure dark mode compatibility

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

1. **Don't** skip reading the `/docs` files before coding - This is THE most common mistake
2. **Don't** use old Next.js patterns (pages directory, getServerSideProps, etc.)
3. **Don't** make Client Components unnecessarily
4. **Don't** use inline styles instead of Tailwind
5. **Don't** use `any` type in TypeScript
6. **Don't** forget to handle loading and error states
7. **Don't** expose sensitive data to client
8. **Don't** skip authentication checks
9. **Don't** ignore TypeScript errors
10. **Don't** forget dark mode support
11. **Don't** use raw SQL with user input

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

**Last Updated**: April 22, 2026
**Project Version**: 0.1.0

For questions or clarifications about these guidelines, refer to the specific documentation files in `/docs`.
