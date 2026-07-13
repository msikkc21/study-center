// ============================================
// src/routes/index.js
// Route aggregator - daftarkan semua routes di sini
// ============================================

const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/aktivitas', require('./aktivitas.routes'));
router.use('/produk', require('./produk.routes'));
router.use('/paket-edukasi', require('./paket.routes'));
router.use('/berita', require('./berita.routes'));
router.use('/users', require('./user.routes'));

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Study Center Edumina API v1.0',
    endpoints: {
      auth: '/api/auth',
      aktivitas: '/api/aktivitas',
      produk: '/api/produk',
      paket_edukasi: '/api/paket-edukasi',
      berita: '/api/berita',
      users: '/api/users',
    },
  });
});

module.exports = router;
