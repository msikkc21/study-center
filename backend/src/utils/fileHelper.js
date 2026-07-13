// ============================================
// src/utils/fileHelper.js
// Utility untuk manajemen file upload
// ============================================

const fs = require('fs');
const path = require('path');

/**
 * Hapus file lama dari filesystem
 * @param {string} filePath - Path relatif file (disimpan di DB)
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  // Path absolut ke folder uploads (2 level di atas src/)
  const absolutePath = path.join(__dirname, '../../uploads', filePath);

  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
    } catch (err) {
      console.error(`⚠️  Gagal hapus file: ${absolutePath}`, err.message);
    }
  }
};

/**
 * Buat direktori jika belum ada
 * @param {string} dirPath - Absolute path direktori
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

module.exports = { deleteFile, ensureDir };
