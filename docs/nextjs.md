# Next.js Guidelines

## Version Notice
This project uses **Next.js 16.2.4** with breaking changes from earlier versions. Always consult the official Next.js documentation in `node_modules/next/dist/docs/` before implementing features.

## App Router Structure
- Use the App Router (`app/` directory) for all routing
- Leverage React Server Components (RSC) by default
- Mark client components explicitly with `"use client"` directive
- Place page components in `page.tsx` files
- Use `layout.tsx` for shared layouts
- Implement `loading.tsx` for loading states
- Create `error.tsx` for error boundaries

## Server vs Client Components
**Default to Server Components** unless you need:
- Interactive event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries that require client-side rendering

## Data Fetching
- Use async Server Components for data fetching
- Fetch data at the component level where needed
- Leverage automatic request deduplication
- Use `fetch` with appropriate caching strategies:
  ```typescript
  // Revalidate every 60 seconds
  fetch(url, { next: { revalidate: 60 } })
  
  // No caching
  fetch(url, { cache: 'no-store' })
  ```

## Route Handlers (API Routes)
- Create route handlers in `route.ts` files
- Export named functions: GET, POST, PUT, DELETE, etc.
- Return `Response` or `NextResponse` objects
- Example:
  ```typescript
  export async function GET(request: Request) {
    return Response.json({ data: 'value' })
  }
  ```

## Metadata
- Export `metadata` object for static metadata
- Use `generateMetadata` for dynamic metadata
- Example:
  ```typescript
  export const metadata: Metadata = {
    title: 'Page Title',
    description: 'Page description',
  }
  ```

## Image Optimization
- Always use `next/image` Image component
- Provide `width`, `height`, or use `fill` prop
- Use `priority` for above-the-fold images
- Optimize image formats (WebP/AVIF)

## Navigation
- Use `next/navigation` instead of `next/router`
- Import `useRouter`, `usePathname`, `useSearchParams` from `next/navigation`
- Use `<Link>` component for client-side navigation

## Environment Variables
- Prefix client-side variables with `NEXT_PUBLIC_`
- Access server-side variables directly via `process.env`
- Never expose sensitive keys to the client

## Performance Best Practices
- Minimize client-side JavaScript
- Use streaming and Suspense boundaries
- Implement proper code splitting
- Optimize third-party scripts with `next/script`
- Enable compression and caching headers
