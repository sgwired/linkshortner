# Authentication Guidelines

## Stack
- **Auth Provider**: Clerk (@clerk/nextjs v7.2.3)
- **Strategy**: Session-based authentication
- **Integration**: Next.js App Router middleware

## Setup

### Clerk Provider
Wrap your application in `ClerkProvider`:

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

### Environment Variables
```env
# Public key (client-side)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Secret key (server-side only)
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## UI Components

### Pre-built Components
Clerk provides ready-to-use components:

```typescript
import {
  SignIn,
  SignUp,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
  Show,
} from "@clerk/nextjs"

// Sign in/up buttons
<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

// User profile button
<UserButton afterSignOutUrl="/" />

// Full sign-in page
<SignIn />
```

### Conditional Rendering
Use `Show` component for conditional rendering:

```typescript
import { Show } from "@clerk/nextjs"

<Show when="signed-in">
  <UserButton />
</Show>

<Show when="signed-out">
  <SignInButton />
  <SignUpButton />
</Show>
```

## Auth State

### Client Components
```typescript
"use client"

import { useUser, useAuth } from "@clerk/nextjs"

export function ProfileButton() {
  const { isSignedIn, user, isLoaded } = useUser()
  const { signOut } = useAuth()
  
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  
  if (!isSignedIn) {
    return <SignInButton />
  }
  
  return (
    <div>
      <p>{user.firstName}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

### Server Components
```typescript
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function Page() {
  // Get auth state
  const { userId } = await auth()
  
  // Get full user object
  const user = await currentUser()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return <div>Hello {user?.firstName}</div>
}
```

### Server Actions
```typescript
"use server"

import { auth } from "@clerk/nextjs/server"

export async function createLink(formData: FormData) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Unauthorized")
  }
  
  // Create link with userId
}
```

## Middleware Protection

### Basic Middleware
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/links(.*)',
  '/api/links(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

### Public Routes
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

## User Data

### User Metadata
Clerk provides two types of metadata:
- `publicMetadata` - Visible to everyone
- `privateMetadata` - Only visible to the user

```typescript
import { currentUser } from "@clerk/nextjs/server"

const user = await currentUser()

// Access metadata
const role = user?.publicMetadata.role as string
const preferences = user?.privateMetadata.preferences
```

### Updating Metadata
Update via Clerk dashboard or API:

```typescript
import { clerkClient } from "@clerk/nextjs/server"

const client = await clerkClient()
await client.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: 'admin',
  },
  privateMetadata: {
    preferences: { theme: 'dark' },
  },
})
```

## Database Integration

### Sync User to Database
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  const headerPayload = await headers()
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!
  
  // Verify webhook
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")
  
  const body = await req.text()
  
  const wh = new Webhook(webhookSecret)
  const evt = wh.verify(body, {
    "svix-id": svix_id!,
    "svix-timestamp": svix_timestamp!,
    "svix-signature": svix_signature!,
  })
  
  const { id, email_addresses, first_name, last_name } = evt.data
  
  if (evt.type === 'user.created') {
    await db.insert(users).values({
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
    })
  }
  
  return Response.json({ success: true })
}
```

### Webhook Setup
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint URL: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret to `.env.local`:
```env
CLERK_WEBHOOK_SECRET=whsec_...
```

## Authorization

### Role-Based Access
```typescript
import { auth } from "@clerk/nextjs/server"

export default async function AdminPage() {
  const { userId } = await auth()
  const user = await currentUser()
  
  const role = user?.publicMetadata.role as string
  
  if (role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return <div>Admin Dashboard</div>
}
```

### Helper Functions
```typescript
// lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server"

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  return userId
}

export async function requireRole(role: string) {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string
  
  if (userRole !== role) {
    throw new Error('Unauthorized')
  }
  
  return user
}

// Usage
export default async function AdminPage() {
  await requireRole('admin')
  return <div>Admin Dashboard</div>
}
```

## API Route Protection

### Protect API Routes
```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Fetch user's links
  const links = await db.query.links.findMany({
    where: eq(links.userId, userId)
  })
  
  return Response.json({ links })
}
```

## Best Practices

### 1. Always Check Auth State
```typescript
// ✅ Good: Check before data access
const { userId } = await auth()
if (!userId) redirect('/sign-in')

// ❌ Bad: Assume user is authenticated
const links = await db.query.links.findMany()
```

### 2. Use Middleware for Route Protection
Protect routes at the middleware level rather than in each page:

```typescript
// ✅ Good: Middleware protection
export default clerkMiddleware(/* ... */)

// ❌ Bad: Manual check in every page
export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
}
```

### 3. Handle Loading States
```typescript
"use client"

import { useUser } from "@clerk/nextjs"

export function Component() {
  const { isLoaded, user } = useUser()
  
  if (!isLoaded) {
    return <Skeleton />
  }
  
  return <div>{user?.firstName}</div>
}
```

### 4. Secure API Routes
Always validate authentication in API routes:

```typescript
export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Process request
}
```

### 5. Use TypeScript for User Metadata
Define types for metadata:

```typescript
interface UserPublicMetadata {
  role: 'user' | 'admin' | 'moderator'
  tier: 'free' | 'pro' | 'enterprise'
}

const role = user?.publicMetadata.role as UserPublicMetadata['role']
```

## Session Management

### Sign Out
```typescript
import { SignOutButton } from "@clerk/nextjs"

<SignOutButton>
  <button>Sign out</button>
</SignOutButton>

// Or programmatically
import { useAuth } from "@clerk/nextjs"

const { signOut } = useAuth()
await signOut()
```

### Multi-Session Support
Clerk supports multiple sessions per browser. Configure in Clerk Dashboard.

## Testing

### Mock Auth in Tests
```typescript
import { auth } from "@clerk/nextjs/server"

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(() => Promise.resolve({ userId: "test-user-id" })),
  currentUser: jest.fn(() => Promise.resolve({ id: "test-user-id" })),
}))
```
