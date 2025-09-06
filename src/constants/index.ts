import type { PrismaPluginOptions } from "../types";

export const PRISMA_CONTEXT_KEY = "prisma";

export const DEFAULT_OPTIONS: PrismaPluginOptions = {
  client: {} as PrismaPluginOptions["client"],
  scoped: false,
  key: PRISMA_CONTEXT_KEY,
};
