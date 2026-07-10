require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', async (req, res) => {
  try {
    // Test koneksi database lewat Prisma
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: 'Study Center KKN API is running 🚀',
      version: '1.0.0',
      env: process.env.NODE_ENV || 'development',
      database: 'connected ✅',
    });
  } catch (err) {
    res.status(503).json({
      message: 'Study Center KKN API is running 🚀',
      version: '1.0.0',
      env: process.env.NODE_ENV || 'development',
      database: `disconnected ❌ - ${err.message}`,
    });
  }
});

// TODO: Tambahkan routes di sini
// const userRoutes = require('./routes/users');
// app.use('/api/users', userRoutes);

// Graceful shutdown: tutup koneksi Prisma saat server berhenti
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database    : ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);

  // Verifikasi koneksi Prisma ke database
  try {
    await prisma.$connect();
    console.log('   Prisma      : Connected to MySQL ✅');
  } catch (err) {
    console.error('   Prisma      : ❌ Gagal terhubung ke database!');
    console.error('                 Pastikan MySQL running dan DATABASE_URL di .env sudah benar.');
    console.error(`                 Error: ${err.message}`);
  }
});