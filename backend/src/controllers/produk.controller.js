// ============================================
// src/controllers/produk.controller.js
// ============================================

const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');
const { deleteFile } = require('../utils/fileHelper');

/**
 * GET /api/produk
 */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.produk.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: { id: true, nama_produk: true, gambar: true, created_at: true },
      }),
      prisma.produk.count(),
    ]);

    return successResponse(res, 200, 'Berhasil mengambil data produk.', data, {
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
 * GET /api/produk/:id
 */
const getById = async (req, res, next) => {
  try {
    const data = await prisma.produk.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return errorResponse(res, 404, 'Produk tidak ditemukan.');
    return successResponse(res, 200, 'Berhasil mengambil detail produk.', data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/produk
 */
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Gambar wajib diupload.');
    }

    const { nama_produk, deskripsi, link_wa } = req.body;
    const gambar = `produk/${req.file.filename}`;

    const data = await prisma.produk.create({
      data: { nama_produk, gambar, deskripsi: deskripsi || null, link_wa: link_wa || null },
    });

    return successResponse(res, 201, 'Produk berhasil dibuat.', data);
  } catch (err) {
    if (req.file) deleteFile(`produk/${req.file.filename}`);
    next(err);
  }
};

/**
 * PUT /api/produk/:id
 */
const update = async (req, res, next) => {
  try {
    const existing = await prisma.produk.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) {
      if (req.file) deleteFile(`produk/${req.file.filename}`);
      return errorResponse(res, 404, 'Produk tidak ditemukan.');
    }

    const { nama_produk, deskripsi, link_wa } = req.body;
    const updateData = {};
    if (nama_produk) updateData.nama_produk = nama_produk;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi || null;
    if (link_wa !== undefined) updateData.link_wa = link_wa || null;

    if (req.file) {
      deleteFile(existing.gambar);
      updateData.gambar = `produk/${req.file.filename}`;
    }

    const data = await prisma.produk.update({ where: { id: parseInt(req.params.id) }, data: updateData });
    return successResponse(res, 200, 'Produk berhasil diperbarui.', data);
  } catch (err) {
    if (req.file) deleteFile(`produk/${req.file.filename}`);
    next(err);
  }
};

/**
 * DELETE /api/produk/:id
 */
const remove = async (req, res, next) => {
  try {
    const existing = await prisma.produk.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return errorResponse(res, 404, 'Produk tidak ditemukan.');
    await prisma.produk.delete({ where: { id: parseInt(req.params.id) } });
    deleteFile(existing.gambar);
    return successResponse(res, 200, 'Produk berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
