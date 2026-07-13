// ============================================
// src/validators/aktivitas.validator.js
// ============================================

const Joi = require('joi');

const createSchema = Joi.object({
  judul: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Judul wajib diisi.',
    'string.max': 'Judul maksimal 200 karakter.',
    'any.required': 'Judul wajib diisi.',
  }),
  tanggal: Joi.date().iso().required().messages({
    'date.base': 'Tanggal tidak valid.',
    'date.format': 'Format tanggal harus YYYY-MM-DD.',
    'any.required': 'Tanggal wajib diisi.',
  }),
});

const updateSchema = Joi.object({
  judul: Joi.string().trim().max(200).messages({
    'string.empty': 'Judul tidak boleh kosong.',
    'string.max': 'Judul maksimal 200 karakter.',
  }),
  tanggal: Joi.date().iso().messages({
    'date.base': 'Tanggal tidak valid.',
    'date.format': 'Format tanggal harus YYYY-MM-DD.',
  }),
}).min(1).messages({ 'object.min': 'Minimal satu field harus diisi.' });

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
