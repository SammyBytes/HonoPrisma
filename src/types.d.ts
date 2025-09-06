declare module 'hono' {
    interface ContextVariableMap {
        prisma: PrismaClient
    }
}