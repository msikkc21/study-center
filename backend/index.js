// ============================================
// index.js - Study Center Edumina Backend API
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const prisma = require('./lib/prisma');
const apiRoutes = require('./src/routes/index');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image serving
}));

// ============================================
// CORS
// ============================================
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// Request Logging
// ============================================
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ============================================
// Body Parsers
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Static Files (Upload folder)
// ============================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Health Check
// ============================================
app.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Study Center Edumina API is running 🚀',
      version: '1.0.0',
      env: process.env.NODE_ENV || 'development',
      database: 'connected ✅',
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Study Center Edumina API is running 🚀',
      version: '1.0.0',
      env: process.env.NODE_ENV || 'development',
      database: `disconnected ❌ - ${err.message}`,
    });
  }
});

// ============================================
// API Routes
// ============================================
app.use('/api', apiRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// ============================================
// Global Error Handler (harus paling bawah)
// ============================================
app.use(errorHandler);

// ============================================
// Graceful Shutdown
// ============================================
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ============================================
// Start Server
// ============================================
app.listen(PORT, async () => {
  console.log('\n✅ ================================');
  console.log('   Study Center Edumina Backend');
  console.log('   ================================');
  console.log(`   🌍 URL       : http://localhost:${PORT}`);
  console.log(`   📦 API Base  : http://localhost:${PORT}/api`);
  console.log(`   🔧 Env       : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🗄️  Database  : ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);

  try {
    await prisma.$connect();
    console.log('   🔌 Prisma    : Connected to MySQL ✅');
  } catch (err) {
    console.error('   🔌 Prisma    : ❌ Gagal terhubung ke database!');
    console.error(`   Error: ${err.message}`);
  }

  console.log('   ================================\n');
});

module.exports = app;