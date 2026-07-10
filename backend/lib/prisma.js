const { PrismaClient } = require('../generated/prisma');

// Singleton pattern: mencegah multiple instance saat hot-reload di development
// Referensi: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
