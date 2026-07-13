// ============================================
// src/middleware/auth.js
// JWT Authentication Middleware
// ============================================

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const prisma = require('../../lib/prisma');

/**
 * Middleware: Verifikasi JWT token
 * Attach user data ke req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Token sudah kadaluarsa. Silakan login kembali.');
      }
      return errorResponse(res, 401, 'Token tidak valid.');
    }

    // Verifikasi user masih ada dan aktif di DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        nama_lengkap: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return errorResponse(res, 401, 'User tidak ditemukan.');
    }

    if (user.status !== 'active') {
      return errorResponse(res, 403, 'Akun Anda tidak aktif. Hubungi administrator.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
