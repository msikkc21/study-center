// ============================================
// src/controllers/aktivitas.controller.js
// ============================================

const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');
const { deleteFile } = require('../utils/fileHelper');

/**
 * GET /api/aktivitas
 * Pagination: 10 per page, sort tanggal DESC
 */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.aktivitas.findMany({
        skip,
        take: limit,
        orderBy: { tanggal: 'desc' },
        select: { id: true, judul: true, tanggal: true, gambar: true, created_at: true },
      }),
      prisma.aktivitas.count(),
    ]);

    return successResponse(res, 200, 'Berhasil mengambil data aktivitas.', data, {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/aktivitas/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.aktivitas.findUnique({ where: { id: parseInt(id) } });
    if (!data) return errorResponse(res, 404, 'Aktivitas tidak ditemukan.');
    return successResponse(res, 200, 'Berhasil mengambil detail aktivitas.', data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/aktivitas
 */
const create = async (req, res, next) => {
  try {
    const { judul, tanggal } = req.body;

    if (!req.file) {
      return errorResponse(res, 400, 'Gambar wajib diupload.');
    }

    const gambar = `aktivitas/${req.file.filename}`;

    const data = await prisma.aktivitas.create({
      data: { judul, tanggal: new Date(tanggal), gambar },
    });

    return successResponse(res, 201, 'Aktivitas berhasil dibuat.', data);
  } catch (err) {
    // Hapus file jika gagal simpan ke DB
    if (req.file) deleteFile(`aktivitas/${req.file.filename}`);
    next(err);
  }
};

/**
 * PUT /api/aktivitas/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { judul, tanggal } = req.body;

    const existing = await prisma.aktivitas.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      if (req.file) deleteFile(`aktivitas/${req.file.filename}`);
      return errorResponse(res, 404, 'Aktivitas tidak ditemukan.');
    }

    const updateData = {};
    if (judul) updateData.judul = judul;
    if (tanggal) updateData.tanggal = new Date(tanggal);

    if (req.file) {
      deleteFile(existing.gambar); // hapus file lama
      updateData.gambar = `aktivitas/${req.file.filename}`;
    }

    const data = await prisma.aktivitas.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return successResponse(res, 200, 'Aktivitas berhasil diperbarui.', data);
  } catch (err) {
    if (req.file) deleteFile(`aktivitas/${req.file.filename}`);
    next(err);
  }
};

/**
 * DELETE /api/aktivitas/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.aktivitas.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return errorResponse(res, 404, 'Aktivitas tidak ditemukan.');

    await prisma.aktivitas.delete({ where: { id: parseInt(id) } });
    deleteFile(existing.gambar);

    return successResponse(res, 200, 'Aktivitas berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
