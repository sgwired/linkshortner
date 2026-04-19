# Authentication Guidelines

## Overview
This project uses **Clerk** exclusively for all authentication and user management. No other authentication methods should be implemented.

## 🔒 Core Rules

### Authentication Provider
- ✅ **ONLY use Clerk** for authentication
- ❌ **NEVER implement** custom auth, NextAuth, Passport, or any other auth solution
- ✅ Use Clerk's Next.js SDK (`@clerk/nextjs`)

### Modal-Based Sign In/Sign Up
- ✅ Sign in and sign up **MUST launch as modals**
- ✅ Use `<SignInButton>` and `<SignUpButton>` components
- ❌ **DO NOT** create standalone `/sign-in` or `/sign-up` pages
- ✅ Configure Clerk to use modal mode in `ClerkProvider`

## 🛡️ Protected Routes

### Dashboard Protection
The `/dashboard` route is protected and requires authentication:

```typescript
// In middleware.ts or route protection
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  // Dashboard content
}
```

### Middleware Configuration
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## 🔄 Redirect Logic

### Homepage Redirect
Logged-in users accessing the homepage should be redirected to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  
  // Show homepage for unauthenticated users
  return <LandingPage />;
}
```

## 📦 Common Patterns

### Server Components
```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

// Get user ID only
const { userId } = await auth();

// Get full user object
const user = await currentUser();
```

### Client Components
```typescript
"use client";
import { useUser, useAuth } from "@clerk/nextjs";

export function UserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  
  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return null;
  
  return <div>{user.firstName}</div>;
}
```

### Sign In/Sign Up Buttons
```typescript
"use client";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function NavBar() {
  return (
    <nav>
      <SignInButton mode="modal">
        <button>Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button>Sign Up</button>
      </SignUpButton>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
```

## 🔧 API Route Protection

```typescript
// app/api/example/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Authenticated logic
  return NextResponse.json({ data: "protected data" });
}
```

## ✅ Checklist

### When Adding Authentication
- [ ] Use Clerk SDK methods only
- [ ] Configure modals for sign in/sign up
- [ ] Protect `/dashboard` route
- [ ] Redirect logged-in users from homepage
- [ ] Handle loading states properly
- [ ] Check auth in Server Components with `await auth()`
- [ ] Use Clerk hooks in Client Components
- [ ] Add auth checks to API routes
- [ ] Configure middleware for route protection

### What NOT to Do
- ❌ Create custom authentication logic
- ❌ Use other auth libraries
- ❌ Create standalone sign-in/sign-up pages
- ❌ Skip authentication checks on protected routes
- ❌ Expose protected data without auth verification
- ❌ Forget to handle loading states

## 🔗 Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Route Protection](https://clerk.com/docs/references/nextjs/clerk-middleware)

---

**Last Updated**: April 19, 2026
