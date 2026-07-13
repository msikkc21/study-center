// ============================================
// src/controllers/auth.controller.js
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username ATAU email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username.trim() }, { email: username.trim() }],
      },
    });

    if (!user) {
      return errorResponse(res, 401, 'Username/email atau password salah.');
    }

    if (user.status !== 'active') {
      return errorResponse(res, 403, 'Akun Anda tidak aktif. Hubungi administrator.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Username/email atau password salah.');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
      status: user.status,
    };

    return successResponse(res, 200, 'Login berhasil.', { token, user: userData });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * JWT is stateless; client harus hapus token sendiri.
 */
const logout = async (req, res) => {
  return successResponse(res, 200, 'Logout berhasil. Silakan hapus token di sisi client.');
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        nama_lengkap: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) return errorResponse(res, 404, 'User tidak ditemukan.');

    return successResponse(res, 200, 'Data user berhasil diambil.', user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getMe };
