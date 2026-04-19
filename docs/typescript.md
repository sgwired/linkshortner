# TypeScript Guidelines

## Configuration
This project uses **strict mode** TypeScript. All strict checks are enabled:
- `strict: true`
- `noEmit: true`
- `isolatedModules: true`

## Type Safety Standards

### Explicit Types
- Always define explicit return types for functions
- Use proper type annotations for function parameters
- Avoid `any` type - use `unknown` if truly unknown
- Prefer interfaces for object shapes, types for unions/intersections

### Good Practices
```typescript
// ✅ Good: Explicit return type
function getUserData(id: string): Promise<User> {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// ❌ Bad: Implicit any
function getData(id) {
  return fetch(`/api/${id}`)
}

// ✅ Good: Proper typing
function getData(id: string): Promise<Response> {
  return fetch(`/api/${id}`)
}
```

### Type Imports
- Use `import type` for type-only imports
- Helps with tree-shaking and clarity
```typescript
import type { Metadata } from "next"
import type { User } from "@/db/schema"
```

### Null Safety
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Handle null/undefined cases explicitly
```typescript
// ✅ Good
const name = user?.profile?.name ?? 'Guest'

// ❌ Bad
const name = user.profile.name || 'Guest'
```

### Generic Types
- Use generics for reusable components and functions
- Provide default types when appropriate
```typescript
interface ApiResponse<T = unknown> {
  data: T
  error?: string
  status: number
}
```

### Discriminated Unions
- Use discriminated unions for complex state
```typescript
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }
```

## Component Types

### React Components
```typescript
// Server Component (async)
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  // ...
}

// Client Component
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  // ...
}
```

### Props with Variants (CVA)
```typescript
import type { VariantProps } from "class-variance-authority"

const buttonVariants = cva(/* ... */)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

## Error Handling
- Use typed error handling
- Create custom error types when needed
```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}
```

## Utility Types
Leverage TypeScript utility types:
- `Partial<T>` - Make all properties optional
- `Pick<T, K>` - Select specific properties
- `Omit<T, K>` - Exclude specific properties
- `Record<K, V>` - Object with specific key-value types
- `NonNullable<T>` - Exclude null and undefined

## File Naming
- Use `.ts` for TypeScript files
- Use `.tsx` for files with JSX/React components
- Use `.d.ts` for type declaration files
