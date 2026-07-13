// ============================================
// src/controllers/paket.controller.js
// ============================================

const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');
const { deleteFile } = require('../utils/fileHelper');

/**
 * GET /api/paket-edukasi
 */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.paketEdukasi.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          judul: true,
          deskripsi_singkat: true,
          harga: true,
          durasi: true,
          gambar: true,
          created_at: true,
        },
      }),
      prisma.paketEdukasi.count(),
    ]);

    return successResponse(res, 200, 'Berhasil mengambil data paket edukasi.', data, {
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
 * GET /api/paket-edukasi/:id
 */
const getById = async (req, res, next) => {
  try {
    const data = await prisma.paketEdukasi.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!data) return errorResponse(res, 404, 'Paket edukasi tidak ditemukan.');
    return successResponse(res, 200, 'Berhasil mengambil detail paket edukasi.', data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/paket-edukasi
 */
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Gambar wajib diupload.');
    }

    const { judul, deskripsi_singkat, deskripsi_lengkap, harga, durasi, fasilitas, link_wa } = req.body;
    const gambar = `paket/${req.file.filename}`;

    const data = await prisma.paketEdukasi.create({
      data: {
        judul,
        deskripsi_singkat: deskripsi_singkat || null,
        deskripsi_lengkap: deskripsi_lengkap || null,
        harga: parseFloat(harga),
        durasi: durasi || null,
        fasilitas: fasilitas || null,
        gambar,
        link_wa: link_wa || null,
      },
    });

    return successResponse(res, 201, 'Paket edukasi berhasil dibuat.', data);
  } catch (err) {
    if (req.file) deleteFile(`paket/${req.file.filename}`);
    next(err);
  }
};

/**
 * PUT /api/paket-edukasi/:id
 */
const update = async (req, res, next) => {
  try {
    const existing = await prisma.paketEdukasi.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) {
      if (req.file) deleteFile(`paket/${req.file.filename}`);
      return errorResponse(res, 404, 'Paket edukasi tidak ditemukan.');
    }

    const { judul, deskripsi_singkat, deskripsi_lengkap, harga, durasi, fasilitas, link_wa } = req.body;
    const updateData = {};

    if (judul) updateData.judul = judul;
    if (deskripsi_singkat !== undefined) updateData.deskripsi_singkat = deskripsi_singkat || null;
    if (deskripsi_lengkap !== undefined) updateData.deskripsi_lengkap = deskripsi_lengkap || null;
    if (harga !== undefined) updateData.harga = parseFloat(harga);
    if (durasi !== undefined) updateData.durasi = durasi || null;
    if (fasilitas !== undefined) updateData.fasilitas = fasilitas || null;
    if (link_wa !== undefined) updateData.link_wa = link_wa || null;

    if (req.file) {
      deleteFile(existing.gambar);
      updateData.gambar = `paket/${req.file.filename}`;
    }

    const data = await prisma.paketEdukasi.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });

    return successResponse(res, 200, 'Paket edukasi berhasil diperbarui.', data);
  } catch (err) {
    if (req.file) deleteFile(`paket/${req.file.filename}`);
    next(err);
  }
};

/**
 * DELETE /api/paket-edukasi/:id
 */
const remove = async (req, res, next) => {
  try {
    const existing = await prisma.paketEdukasi.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return errorResponse(res, 404, 'Paket edukasi tidak ditemukan.');
    await prisma.paketEdukasi.delete({ where: { id: parseInt(req.params.id) } });
    deleteFile(existing.gambar);
    return successResponse(res, 200, 'Paket edukasi berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
