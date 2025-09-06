import type { PrismaClient } from "@prisma/client";

export interface PrismaPluginOptions {
  /**
   * Prisma Client instance to be used in the middleware.
   * @type {PrismaClient} - An instance of PrismaClient.
   */
  client: PrismaClient;
  /**
   * If true, the Prisma Client will be disconnected after each request.
   * @type {boolean} - Default is false.
   * @default false
   */
  scoped?: boolean | false;
  /**
   * The key name under which the Prisma Client instance will be stored in the context.
   * @type {string} - Default is "prisma".
   * @default "prisma"
   */
  key?: string;
}
