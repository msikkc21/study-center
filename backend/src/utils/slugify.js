// ============================================
// src/utils/slugify.js
// Auto-generate slug dari judul artikel
// ============================================

/**
 * Convert string to URL-friendly slug
 * Contoh: "Berita Terbaru!" → "berita-terbaru"
 * @param {string} text - Input text
 * @returns {string} slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Ganti karakter khusus Indonesia
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    // Hapus karakter non-alphanumeric (kecuali spasi dan dash)
    .replace(/[^a-z0-9\s-]/g, '')
    // Ganti spasi dan multiple dash dengan single dash
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    // Hapus dash di awal dan akhir
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate unique slug dengan timestamp suffix jika diperlukan
 * @param {string} text - Input text
 * @param {boolean} withSuffix - Tambahkan suffix timestamp
 * @returns {string} slug
 */
const generateUniqueSlug = (text, withSuffix = false) => {
  const base = generateSlug(text);
  if (!withSuffix) return base;
  return `${base}-${Date.now()}`;
};

module.exports = { generateSlug, generateUniqueSlug };
