// ============================================
// src/config/multer.js
// Multer configuration untuk file upload
// ============================================

const multer = require('multer');
const path = require('path');
const { ensureDir } = require('../utils/fileHelper');

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Buat multer instance untuk modul tertentu
 * @param {string} folder - Nama subfolder upload
 * @returns multer instance
 */
const createUploader = (folder) => {
  const uploadPath = path.join(__dirname, '../../uploads', folder);
  ensureDir(uploadPath);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
  });
};

// Pre-create uploaders untuk setiap modul
const uploaders = {
  aktivitas: createUploader('aktivitas'),
  produk: createUploader('produk'),
  paket: createUploader('paket'),
  berita: createUploader('berita'),
};

module.exports = { uploaders };
