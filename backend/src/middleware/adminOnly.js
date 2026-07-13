// ============================================
// src/middleware/adminOnly.js
// Role-based access: Admin Only
// ============================================

const { errorResponse } = require('../utils/response');

/**
 * Middleware: Hanya izinkan role 'admin'
 * Harus digunakan SETELAH authenticate middleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Tidak terautentikasi.');
  }

  if (req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Akses ditolak. Hanya admin yang dapat mengakses fitur ini.');
  }

  next();
};

module.exports = { adminOnly };
