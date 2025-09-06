# HonoPrisma

A simple and powerful Prisma ORM plugin for HonoJS framework that integrates Prisma Client seamlessly into your Hono applications.

## Features

- 🚀 **Easy Integration** - Add Prisma to any Hono app with one middleware
- 🔧 **Auto Connection Management** - Automatic connect/disconnect handling
- 🛡️ **Type Safe** - Full TypeScript support with proper context typing
- 🎯 **Flexible Configuration** - Customize connection behavior and options
- 📦 **Zero Dependencies** - Only requires Hono and Prisma as peer dependencies

## Installation

```bash
# Using bun
bun add hono-prisma @prisma/client hono

# Using npm
npm install hono-prisma @prisma/client hono

# Using yarn
yarn add hono-prisma @prisma/client hono
```

## Quick Start

### 1. Setup Prisma

Create your Prisma schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Setup your database:

```bash
# Generate Prisma client
bunx prisma generate

# Create database and tables
bunx prisma db push
```

### 2. Use with Hono

```typescript
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { createPrismaPlugin, getPrisma } from "hono-prisma";

const app = new Hono();
const prisma = new PrismaClient();

// Add Prisma middleware
app.use("*", createPrismaPlugin(prisma));

// Use in your routes
app.get("/users", async (c) => {
  const db = getPrisma(c) as PrismaClient;
  const users = await db.user.findMany();
  return c.json(users);
});

app.post("/users", async (c) => {
  const db = getPrisma(c) as PrismaClient;
  const body = await c.req.json();

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return c.json(user);
});

export default app;
```

## API Reference

### `createPrismaPlugin(client, options?)`

Creates the Prisma middleware for your Hono app.

**Parameters:**

- `options` - Optional configuration

**Options:**

```typescript
{
  key?: string              // Context key (default: 'prisma')
  scoped?: boolean         // Scoped connection (default: false)
  client: PrismaClient     // Prisma Client instance (required)
}
```

### `prisma(options)`

Alternative way to create the middleware with full options.

```typescript
app.use(
  "*",
  prisma({
    client: new PrismaClient(),
    key: "db",
    scoped: true,
  })
);
```

### `getPrisma(context, key?)`

Get the Prisma client from Hono context.

```typescript
const db = getPrisma(c) as PrismaClient; // Uses default key 'prisma'
const db = getPrisma(c, "mydb") as PrismaClient; // Uses custom key
```

## Advanced Usage

### Multiple Databases

```typescript
const readDB = new PrismaClient({
  datasources: { db: { url: process.env.READ_DATABASE_URL } },
});
const writeDB = new PrismaClient({
  datasources: { db: { url: process.env.WRITE_DATABASE_URL } },
});

// Different middleware for different routes
app.use("/api/read/*", prisma({ client: readDB, key: "readDB" }));
app.use("/api/write/*", prisma({ client: writeDB, key: "writeDB" }));

app.get("/api/read/users", async (c) => {
  const db = getPrisma(c, "readDB");
  return c.json(await db.user.findMany());
});
```

### Custom Context Key

```typescript
app.use("*", createPrismaPlugin(prisma, { key: "database" }));

app.get("/users", async (c) => {
  const db = getPrisma(c, "database");
  const users = await db.user.findMany();
  return c.json(users);
});
```

### Transactions

```typescript
app.post("/transfer", async (c) => {
  const db = getPrisma(c) as PrismaClient;
  const { fromId, toId, amount } = await c.req.json();

  const result = await db.$transaction(async (tx) => {
    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });

    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    return { success: true };
  });

  return c.json(result);
});
```

## Project Setup

### Database Commands

```bash
# Generate Prisma client
bunx prisma generate

# Create and apply migrations
bunx prisma migrate dev

# Push schema changes (development)
bunx prisma db push

# Open Prisma Studio
bunx prisma studio

# Reset database
bunx prisma migrate reset
```

## TypeScript Support

The plugin automatically extends Hono's context types:

```typescript
// No additional setup needed - types are automatically available
app.get("/users", async (c) => {
  const db = getPrisma(c) as PrismaClient; // ← Fully typed PrismaClient
  const users = await db.user.findMany(); // ← Full autocomplete
  return c.json(users);
});
```

## Troubleshooting

### Table doesn't exist error

```bash
# Make sure you've generated the client
bunx prisma generate

# Push your schema to the database
bunx prisma db push

# Or create a migration
bunx prisma migrate dev
```

### Import errors

Make sure your `package.json` has the correct peer dependencies:

```json
{
  "peerDependencies": {
    "hono": ">=3.0.0",
    "@prisma/client": ">=4.0.0"
  }
}


## Requirements

- Node.js >= 18.0.0
- Hono >= 3.0.0
- Prisma Client >= 4.0.0

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
```
