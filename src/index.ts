import type { ContextVariableMap } from "hono";
import { createMiddleware } from "hono/factory";
import "./types.d.ts";
import { PrismaPluginOptions } from "./types/options.js";

/**
 * Prisma Middleware for Hono
 * Injects Prisma Client into the context
 *
 * @param options
 * @returns
 */
export const prismaMiddleware = (options?: PrismaPluginOptions) => {
  return createMiddleware(async (context, next) => {
    const prisma = options?.client;

    if (!prisma) {
      throw new Error(
        "PrismaClient is required. Generate it using `prisma generate` in your project."
      );
    }
    context.set("prisma", prisma);

    try {
      await next();
    } catch (error) {
      console.error("Error in prismaMiddleware:", error);
    } finally {
      if (options?.scoped) {
        await prisma.$disconnect();
      }
    }
  });
};
