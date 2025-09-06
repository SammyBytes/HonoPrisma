import { MiddlewareHandler } from "hono";
import { PrismaPluginOptions } from "../types";
import { DEFAULT_OPTIONS } from "../constants";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma middleware for Hono framework.
 * @param options PrismaPluginOptions to configure the middleware.
 * @returns MiddlewareHandler that injects Prisma Client into the context.
 */
export const prisma = (options: PrismaPluginOptions): MiddlewareHandler => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { client, key = "prisma", scoped } = config;

  if (!client) {
    throw new Error(
      "PrismaClient is required. Generate it using `prisma generate` in your project."
    );
  }
  return async (c, next) => {
    c.set(key, client);
    try {
      await next();
    } catch (error) {
      console.error("Error in prisma middleware:", error);
    } finally {
      if (scoped) {
        await client.$disconnect();
      }
    }
  };
};

/**
 * Factory function to create a Prisma middleware for Hono with given client and options.
 * @param client PrismaClient instance to be used in the middleware.
 * @param options Optional PrismaPluginOptions excluding the client.
 * @returns MiddlewareHandler that injects Prisma Client into the context.
 */
export const createPrismaPlugin = (
  client: PrismaClient,
  options?: Omit<PrismaPluginOptions, "client">
): MiddlewareHandler => {
  return prisma({ client, ...options });
};
