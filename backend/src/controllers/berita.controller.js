// ============================================
// src/controllers/berita.controller.js
// ============================================

const prisma = require('../../lib/prisma');
const { successResponse, errorResponse } = require('../utils/response');
const { deleteFile } = require('../utils/fileHelper');
const { generateSlug, generateUniqueSlug } = require('../utils/slugify');

const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 9));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.berita.findMany({
        skip, take: limit,
        orderBy: { tanggal_publish: 'desc' },
        select: { id: true, judul: true, slug: true, tanggal_publish: true, gambar: true, created_at: true },
      }),
      prisma.berita.count(),
    ]);

    return successResponse(res, 200, 'Berhasil mengambil data berita.', data, {
      page, limit, total, total_pages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
};

const getBySlug = async (req, res, next) => {
  try {
    const data = await prisma.berita.findUnique({ where: { slug: req.params.slug } });
    if (!data) return errorResponse(res, 404, 'Berita tidak ditemukan.');
    return successResponse(res, 200, 'Berhasil mengambil detail berita.', data);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 400, 'Gambar wajib diupload.');

    const { judul, isi_konten, tanggal_publish } = req.body;
    const gambar = `berita/${req.file.filename}`;

    let slug = generateSlug(judul);
    const existing = await prisma.berita.findUnique({ where: { slug } });
    if (existing) slug = generateUniqueSlug(judul, true);

    const data = await prisma.berita.create({
      data: { judul, slug, isi_konten: isi_konten || null, tanggal_publish: new Date(tanggal_publish), gambar },
    });

    return successResponse(res, 201, 'Berita berhasil dibuat.', data);
  } catch (err) {
    if (req.file) deleteFile(`berita/${req.file.filename}`);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await prisma.berita.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) {
      if (req.file) deleteFile(`berita/${req.file.filename}`);
      return errorResponse(res, 404, 'Berita tidak ditemukan.');
    }

    const { judul, isi_konten, tanggal_publish } = req.body;
    const updateData = {};

    if (judul && judul !== existing.judul) {
      updateData.judul = judul;
      let newSlug = generateSlug(judul);
      const slugExists = await prisma.berita.findFirst({
        where: { slug: newSlug, NOT: { id: parseInt(req.params.id) } },
      });
      if (slugExists) newSlug = generateUniqueSlug(judul, true);
      updateData.slug = newSlug;
    }

    if (isi_konten !== undefined) updateData.isi_konten = isi_konten || null;
    if (tanggal_publish) updateData.tanggal_publish = new Date(tanggal_publish);

    if (req.file) {
      deleteFile(existing.gambar);
      updateData.gambar = `berita/${req.file.filename}`;
    }

    const data = await prisma.berita.update({ where: { id: parseInt(req.params.id) }, data: updateData });
    return successResponse(res, 200, 'Berita berhasil diperbarui.', data);
  } catch (err) {
    if (req.file) deleteFile(`berita/${req.file.filename}`);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const existing = await prisma.berita.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return errorResponse(res, 404, 'Berita tidak ditemukan.');
    await prisma.berita.delete({ where: { id: parseInt(req.params.id) } });
    deleteFile(existing.gambar);
    return successResponse(res, 200, 'Berita berhasil dihapus.');
  } catch (err) { next(err); }
};

module.exports = { getAll, getBySlug, create, update, remove };
