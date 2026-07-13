// ============================================
// src/validators/berita.validator.js
// ============================================

const Joi = require('joi');

const createSchema = Joi.object({
  judul: Joi.string().trim().max(250).required().messages({
    'string.empty': 'Judul wajib diisi.',
    'string.max': 'Judul maksimal 250 karakter.',
    'any.required': 'Judul wajib diisi.',
  }),
  tanggal_publish: Joi.date().iso().required().messages({
    'date.base': 'Tanggal publish tidak valid.',
    'date.format': 'Format tanggal harus YYYY-MM-DD.',
    'any.required': 'Tanggal publish wajib diisi.',
  }),
  isi_konten: Joi.string().allow('', null).optional(),
  // slug tidak diperlukan di input (auto-generate)
});

const updateSchema = Joi.object({
  judul: Joi.string().trim().max(250).messages({
    'string.empty': 'Judul tidak boleh kosong.',
    'string.max': 'Judul maksimal 250 karakter.',
  }),
  tanggal_publish: Joi.date().iso().messages({
    'date.base': 'Tanggal publish tidak valid.',
    'date.format': 'Format tanggal harus YYYY-MM-DD.',
  }),
  isi_konten: Joi.string().allow('', null).optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: 'Validasi gagal.', errors: messages });
  }
  next();
};

module.exports = {
  validateCreate: validate(createSchema),
  validateUpdate: validate(updateSchema),
};
