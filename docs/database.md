# Database Guidelines

## Stack
- **ORM**: Drizzle ORM v0.45.2
- **Database**: Neon (PostgreSQL)
- **Driver**: `@neondatabase/serverless`

## Configuration

### Database Connection
```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'

const db = drizzle(process.env.DATABASE_URL!)

export { db }
```

### Drizzle Config
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',          // Migration output directory
  schema: './db/schema.ts',  // Schema location
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Schema Definition

### Table Schema Pattern
```typescript
// db/schema.ts
import { pgTable, text, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  originalUrl: text('original_url').notNull(),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  clicks: integer('clicks').default(0).notNull(),
})
```

### Type Inference
```typescript
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, links } from './schema'

// Infer types from schema
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type Link = InferSelectModel<typeof links>
export type NewLink = InferInsertModel<typeof links>
```

## Queries

### Select Queries
```typescript
import { db } from '@/db'
import { users, links } from '@/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'

// Find one
const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
})

// Find many
const allUsers = await db.query.users.findMany({
  where: eq(users.active, true),
  orderBy: [desc(users.createdAt)],
  limit: 10,
})

// With relations
const userWithLinks = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    links: true,
  },
})

// Using select builder
const specificFields = await db
  .select({
    id: users.id,
    name: users.name,
  })
  .from(users)
  .where(eq(users.email, email))
```

### Insert Queries
```typescript
// Insert one
const [newUser] = await db
  .insert(users)
  .values({
    email: 'user@example.com',
    name: 'John Doe',
  })
  .returning()

// Insert many
await db.insert(links).values([
  { shortCode: 'abc123', originalUrl: 'https://example.com' },
  { shortCode: 'def456', originalUrl: 'https://example.org' },
])
```

### Update Queries
```typescript
// Update with where
await db
  .update(links)
  .set({ clicks: sql`${links.clicks} + 1` })
  .where(eq(links.shortCode, shortCode))

// Update single record
const [updatedUser] = await db
  .update(users)
  .set({ name: 'Jane Doe', updatedAt: new Date() })
  .where(eq(users.id, userId))
  .returning()
```

### Delete Queries
```typescript
await db
  .delete(links)
  .where(eq(links.id, linkId))
```

## Relations

### Defining Relations
```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}))

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}))
```

### Querying Relations
```typescript
const userWithLinks = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    links: {
      orderBy: [desc(links.createdAt)],
      limit: 5,
    },
  },
})
```

## Migrations

### Generate Migration
```bash
npx drizzle-kit generate
```

### Run Migration
```bash
npx drizzle-kit migrate
```

### Push to Database (Development)
```bash
npx drizzle-kit push
```

## Best Practices

### Use Transactions
```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({ email }).returning()
  await tx.insert(links).values({ userId: user.id, shortCode, originalUrl })
})
```

### SQL Injection Prevention
Drizzle automatically handles SQL injection prevention. Never use raw SQL with user input:

```typescript
// ✅ Safe: Parameterized query
await db.select().from(users).where(eq(users.email, userEmail))

// ❌ Dangerous: Raw SQL with user input
await db.execute(sql`SELECT * FROM users WHERE email = '${userEmail}'`)

// ✅ Safe: SQL with parameters
await db.execute(sql`SELECT * FROM users WHERE email = ${userEmail}`)
```

### Error Handling
```typescript
try {
  await db.insert(users).values({ email })
} catch (error) {
  if (error.code === '23505') { // Unique violation
    throw new Error('Email already exists')
  }
  throw error
}
```

### Connection Pooling
Neon handles connection pooling automatically. No need for manual connection management.

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Type Safety
Always use inferred types from schema:
```typescript
import type { User } from '@/db/schema'

async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  return await db.insert(users).values(data).returning()
}
```

## Performance

### Indexing
Add indexes for frequently queried fields:
```typescript
export const links = pgTable('links', {
  // ... fields
}, (table) => ({
  shortCodeIdx: index('short_code_idx').on(table.shortCode),
  userIdIdx: index('user_id_idx').on(table.userId),
}))
```

### Prepared Statements
```typescript
import { placeholder } from 'drizzle-orm/sql'

const prepared = db
  .select()
  .from(users)
  .where(eq(users.email, placeholder('email')))
  .prepare('get_user_by_email')

const user = await prepared.execute({ email: 'user@example.com' })
```

### Avoid N+1 Queries
Use relations and joins instead of separate queries:
```typescript
// ✅ Good: Single query with relations
const usersWithLinks = await db.query.users.findMany({
  with: { links: true }
})

// ❌ Bad: N+1 queries
const users = await db.query.users.findMany()
for (const user of users) {
  const links = await db.query.links.findMany({
    where: eq(links.userId, user.id)
  })
}
```
