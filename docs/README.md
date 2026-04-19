# Agent Instructions Documentation

This directory contains comprehensive coding standards and guidelines for AI assistants working on this Next.js link shortener project.

## 📚 Documentation Files

### [Next.js Guidelines](nextjs.md)
Complete guide for Next.js 16.2.4 App Router patterns, including:
- Server vs Client Components
- Data fetching and caching
- Route handlers and API routes
- Metadata and SEO
- Image optimization

### [TypeScript Guidelines](typescript.md)
TypeScript strict mode standards, covering:
- Type safety requirements
- Component typing patterns
- Error handling
- Utility types
- Generic types and discriminated unions

### [Component Guidelines](components.md)
UI component architecture with shadcn/ui and Base UI:
- CVA (Class Variance Authority) patterns
- Server and Client component patterns
- Composition over configuration
- Props and ref forwarding
- Accessibility standards

### [Database Guidelines](database.md)
Drizzle ORM and PostgreSQL best practices:
- Schema definition patterns
- Type-safe queries
- Relations and joins
- Migrations workflow
- Performance optimization

### [Styling Guidelines](styling.md)
Tailwind CSS 4 conventions:
- Design tokens and CSS variables
- Utility-first approach
- Dark mode implementation
- Responsive design (mobile-first)
- Component styling patterns

### [Project Structure Guidelines](project-structure.md)
File organization and naming conventions:
- Directory structure
- Import path patterns (@/* aliases)
- File naming conventions
- Feature-based organization
- Configuration files

### [Authentication Guidelines](authentication.md)
Clerk authentication integration:
- Clerk provider setup
- Auth state management
- Middleware route protection
- User metadata handling
- Database sync with webhooks
- Role-based authorization

### [Best Practices & Patterns](best-practices.md)
General coding patterns and practices:
- Error handling strategies
- Form handling with server actions
- Data validation (Zod)
- Loading states and optimistic updates
- Performance optimization
- Security best practices
- Accessibility standards

## 🎯 Quick Start for AI Agents

1. **Read the main [AGENTS.md](../AGENTS.md)** file for project overview
2. **Consult relevant guides** based on your task:
   - Building UI? → [Components](components.md) + [Styling](styling.md)
   - Database work? → [Database](database.md)
   - Auth features? → [Authentication](authentication.md)
   - New pages/routes? → [Next.js](nextjs.md) + [Project Structure](project-structure.md)
   - Everything? → [Best Practices](best-practices.md)

## ✅ Essential Reminders

- **Next.js 16.2.4** has breaking changes - consult docs first
- **Default to Server Components** unless you need client-side features
- **Use TypeScript strict mode** - no `any` types
- **Tailwind for styling** - utility-first approach
- **Drizzle ORM** for all database operations
- **Clerk** for authentication
- **Test dark mode** for all UI components

## 🔄 Keeping Documentation Updated

When you encounter:
- New patterns or solutions
- Version-specific quirks or gotchas
- Common mistakes to avoid
- Performance optimizations

Consider updating the relevant documentation file to help future agents.

---

**Last Updated**: April 19, 2026
