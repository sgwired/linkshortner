# Best Practices & Patterns

## General Principles

### Code Quality
1. **Write self-documenting code** - Use clear names over comments
2. **Keep functions small** - Single responsibility principle
3. **DRY (Don't Repeat Yourself)** - Extract common patterns
4. **Fail fast** - Validate early, return early
5. **Type safety** - Let TypeScript catch errors at compile time

### Performance
1. **Minimize client-side JavaScript** - Prefer Server Components
2. **Code splitting** - Dynamic imports for large components
3. **Image optimization** - Always use next/image
4. **Database queries** - Avoid N+1 queries, use joins/relations
5. **Caching** - Leverage Next.js caching strategies

## Error Handling

### Client Components
```typescript
"use client"

import { useState } from "react"

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
}

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: 'idle' })
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState({ status: 'loading' })
    
    try {
      const response = await fetch('/api/contact', { method: 'POST' })
      
      if (!response.ok) {
        throw new Error('Failed to submit')
      }
      
      setState({ status: 'success' })
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {state.status === 'error' && (
        <div className="text-destructive">{state.error}</div>
      )}
      {state.status === 'success' && (
        <div className="text-green-600">Success!</div>
      )}
      {/* form fields */}
    </form>
  )
}
```

### Server Components
```typescript
import { db } from "@/db"
import { notFound, redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LinkPage({ params }: PageProps) {
  const { id } = await params
  
  try {
    const link = await db.query.links.findFirst({
      where: (links, { eq }) => eq(links.id, id)
    })
    
    if (!link) {
      notFound()
    }
    
    return <div>{link.originalUrl}</div>
    
  } catch (error) {
    console.error('Failed to fetch link:', error)
    throw error // Let error.tsx handle it
  }
}
```

### API Routes
```typescript
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"

export async function POST(request: Request) {
  try {
    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse and validate input
    const body = await request.json()
    const { url } = body
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      )
    }
    
    // Business logic
    const link = await db.insert(links).values({
      originalUrl: url,
      userId,
    }).returning()
    
    return NextResponse.json({ link })
    
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }
    
    // Generic error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Error Boundaries
```typescript
// app/error.tsx
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

## Form Handling

### Server Actions
```typescript
// app/actions/links.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { links } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface CreateLinkResult {
  success: boolean
  error?: string
  linkId?: string
}

export async function createLink(
  formData: FormData
): Promise<CreateLinkResult> {
  const { userId } = await auth()
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const url = formData.get('url') as string
  
  if (!url) {
    return { success: false, error: 'URL is required' }
  }
  
  try {
    const [link] = await db.insert(links).values({
      originalUrl: url,
      userId,
      shortCode: generateShortCode(),
    }).returning()
    
    revalidatePath('/dashboard')
    return { success: true, linkId: link.id }
    
  } catch (error) {
    console.error('Failed to create link:', error)
    return { success: false, error: 'Failed to create link' }
  }
}
```

### Form Component with Server Action
```typescript
"use client"

import { useActionState } from "react"
import { createLink } from "@/app/actions/links"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CreateLinkForm() {
  const [state, formAction, isPending] = useActionState(createLink, {
    success: false,
  })
  
  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="url"
        type="url"
        placeholder="https://example.com"
        required
        disabled={isPending}
      />
      
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      
      {state.success && (
        <p className="text-sm text-green-600">Link created!</p>
      )}
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Link'}
      </Button>
    </form>
  )
}
```

## Data Validation

### Using Zod
```typescript
import { z } from "zod"

const linkSchema = z.object({
  url: z.string().url('Invalid URL'),
  shortCode: z.string().min(3).max(10).optional(),
  customDomain: z.string().url().optional(),
})

export type LinkInput = z.infer<typeof linkSchema>

// In server action
export async function createLink(input: unknown) {
  try {
    const validated = linkSchema.parse(input)
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    throw error
  }
}
```

## Loading States

### Skeleton Components
```typescript
// components/link-skeleton.tsx
export function LinkSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}

// app/dashboard/loading.tsx
import { LinkSkeleton } from "@/components/link-skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <LinkSkeleton />
      <LinkSkeleton />
      <LinkSkeleton />
    </div>
  )
}
```

### Suspense Boundaries
```typescript
import { Suspense } from "react"
import { LinksList } from "@/components/links-list"
import { LinkSkeleton } from "@/components/link-skeleton"

export default function Dashboard() {
  return (
    <div>
      <h1>My Links</h1>
      <Suspense fallback={<LinkSkeleton />}>
        <LinksList />
      </Suspense>
    </div>
  )
}
```

## Optimistic Updates

```typescript
"use client"

import { useOptimistic } from "react"
import { deleteLink } from "@/app/actions/links"
import type { Link } from "@/db/schema"

interface LinksListProps {
  links: Link[]
}

export function LinksList({ links }: LinksListProps) {
  const [optimisticLinks, setOptimisticLinks] = useOptimistic(
    links,
    (state, deletedId: string) => state.filter(link => link.id !== deletedId)
  )
  
  async function handleDelete(id: string) {
    setOptimisticLinks(id)
    await deleteLink(id)
  }
  
  return (
    <div>
      {optimisticLinks.map(link => (
        <div key={link.id}>
          <span>{link.originalUrl}</span>
          <button onClick={() => handleDelete(link.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## Environment Variables

### Type-Safe Env Vars
```typescript
// lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)

// Usage
import { env } from "@/lib/env"
const db = drizzle(env.DATABASE_URL)
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### API Testing
```typescript
import { POST } from '@/app/api/links/route'

describe('POST /api/links', () => {
  it('creates a link', async () => {
    const request = new Request('http://localhost/api/links', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.link).toBeDefined()
  })
})
```

## Security Best Practices

### Input Sanitization
```typescript
// Always validate and sanitize user input
import DOMPurify from 'isomorphic-dompurify'

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input)
}
```

### SQL Injection Prevention
```typescript
// ✅ Good: Parameterized queries (Drizzle handles this)
await db.select().from(users).where(eq(users.email, email))

// ❌ Bad: Raw SQL with interpolation
await db.execute(sql`SELECT * FROM users WHERE email = '${email}'`)

// ✅ Good: SQL with parameters
await db.execute(sql`SELECT * FROM users WHERE email = ${email}`)
```

### XSS Prevention
```typescript
// React automatically escapes by default
<div>{userInput}</div> // Safe

// Dangerous: Only use when absolutely necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### CSRF Protection
Clerk and Next.js handle CSRF protection automatically for form submissions.

## Performance Optimization

### Dynamic Imports
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if not needed
})
```

### Memoization
```typescript
import { useMemo, useCallback } from 'react'

function Component({ items }: { items: Item[] }) {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )
  
  const handleClick = useCallback(() => {
    // Handle click
  }, [])
  
  return <div>{/* render */}</div>
}
```

### Database Indexing
```typescript
import { index } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  // ... columns
}, (table) => ({
  shortCodeIdx: index('short_code_idx').on(table.shortCode),
  userIdIdx: index('user_id_idx').on(table.userId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}))
```

## Accessibility

### ARIA Labels
```typescript
<button aria-label="Delete link" onClick={handleDelete}>
  <TrashIcon />
</button>
```

### Keyboard Navigation
```typescript
function Dialog({ isOpen, onClose }: DialogProps) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  return <div role="dialog" aria-modal="true">{/* content */}</div>
}
```

### Focus Management
```typescript
import { useRef, useEffect } from 'react'

function Modal({ isOpen }: { isOpen: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])
  
  return <div ref={modalRef} tabIndex={-1}>{/* content */}</div>
}
```

## Internationalization (Future)

### Prepare for i18n
```typescript
// lib/i18n.ts (when needed)
export const messages = {
  'en': {
    'welcome': 'Welcome',
    'createLink': 'Create Link',
  },
  'es': {
    'welcome': 'Bienvenido',
    'createLink': 'Crear Enlace',
  },
}
```

## Monitoring & Logging

### Structured Logging
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }))
  },
  error: (message: string, error?: unknown, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...meta,
    }))
  },
}

// Usage
logger.info('Link created', { linkId, userId })
logger.error('Failed to create link', error, { userId })
```
