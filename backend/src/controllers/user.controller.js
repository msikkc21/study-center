// ============================================
// src/controllers/user.controller.js
// Admin-only User Management
// ============================================

const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip, take: limit,
        orderBy: { created_at: 'desc' },
        select: { id: true, username: true, email: true, nama_lengkap: true, role: true, status: true, created_at: true },
      }),
      prisma.user.count(),
    ]);

    return successResponse(res, 200, 'Berhasil mengambil data user.', data, {
      page, limit, total, total_pages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, username: true, email: true, nama_lengkap: true, role: true, status: true, created_at: true, updated_at: true },
    });
    if (!user) return errorResponse(res, 404, 'User tidak ditemukan.');
    return successResponse(res, 200, 'Berhasil mengambil detail user.', user);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { username, email, password, nama_lengkap, role, status } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, nama_lengkap, role, status: status || 'active' },
      select: { id: true, username: true, email: true, nama_lengkap: true, role: true, status: true, created_at: true },
    });

    return successResponse(res, 201, 'User berhasil dibuat.', user);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return errorResponse(res, 404, 'User tidak ditemukan.');

    const { email, password, nama_lengkap, role, status } = req.body;
    const updateData = {};

    if (email) updateData.email = email;
    if (nama_lengkap) updateData.nama_lengkap = nama_lengkap;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, username: true, email: true, nama_lengkap: true, role: true, status: true, updated_at: true },
    });

    return successResponse(res, 200, 'User berhasil diperbarui.', user);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 400, 'Tidak dapat menghapus akun sendiri.');
    }

    const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return errorResponse(res, 404, 'User tidak ditemukan.');

    await prisma.user.delete({ where: { id: parseInt(id) } });
    return successResponse(res, 200, 'User berhasil dihapus.');
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
