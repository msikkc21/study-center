// ============================================
// src/middleware/errorHandler.js
// Global Error Handler Middleware
// ============================================

const { errorResponse } = require('../utils/response');

/**
 * Global error handler - harus diregister TERAKHIR di Express
 */
const errorHandler = (err, req, res, next) => {
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 400, 'Ukuran file terlalu besar. Maksimal 5MB.');
    }
    return errorResponse(res, 400, `Upload error: ${err.message}`);
  }

  // Custom multer fileFilter error
  if (err.message && err.message.includes('Format file tidak didukung')) {
    return errorResponse(res, 400, err.message);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return errorResponse(res, 409, `Data sudah ada: ${field} harus unik.`);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 404, 'Data tidak ditemukan.');
  }

  if (err.code === 'P2003') {
    return errorResponse(res, 400, 'Referensi data tidak valid (foreign key constraint).');
  }

  // JWT errors (handled in middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Token tidak valid.');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Token sudah kadaluarsa.');
  }

  // Validation errors from Joi
  if (err.isJoi) {
    const messages = err.details.map((d) => d.message);
    return errorResponse(res, 400, 'Validasi gagal.', messages);
  }

  // Default: 500 Internal Server Error
  console.error('❌ Unhandled Error:', err);
  return errorResponse(
    res,
    err.status || 500,
    process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan pada server.' : err.message
  );
};

module.exports = { errorHandler };
