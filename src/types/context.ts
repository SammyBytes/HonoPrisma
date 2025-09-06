import type { PrismaClient } from "@prisma/client";
import type { Context, MiddlewareHandler } from "hono";

declare module "hono" {
  interface ContextVariableMap {
    prisma: PrismaClient;
    [key: string]: PrismaClient;
  }
}
/**
 * Extended Context type that includes a PrismaClient instance.
 * @param T - The key name for the PrismaClient instance in the context variable map. Default is "prisma".
 * @returns Extended Context type with PrismaClient.
 */
export type PrismaContext<T extends string = "prisma"> = Context & {
  var: Record<T, PrismaClient>;
};

/**
 * Type alias for a middleware handler that uses the extended PrismaContext.
 * @param T - The key name for the PrismaClient instance in the context variable map. Default is "prisma".
 * @returns MiddlewareHandler type with PrismaContext.
 */
export type PrismaMiddleware = MiddlewareHandler;
