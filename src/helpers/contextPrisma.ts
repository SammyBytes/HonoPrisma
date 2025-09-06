import { Context } from "hono";
import { PRISMA_CONTEXT_KEY } from "../constants";
import { PrismaClient } from "@prisma/client";

export const getPrisma = (
  c: Context,
  key: string = PRISMA_CONTEXT_KEY
): PrismaClient => {
  const prisma = c.get(key);
  if (!prisma) {
    throw new Error(
      `Prisma client not found in context with key "${key}". Make sure the prisma middleware is applied.`
    );
  }
  return prisma;
};
