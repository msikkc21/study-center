// ============================================
// src/validators/paket.validator.js
// ============================================

const Joi = require('joi');

const createSchema = Joi.object({
  judul: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Judul wajib diisi.',
    'string.max': 'Judul maksimal 200 karakter.',
    'any.required': 'Judul wajib diisi.',
  }),
  harga: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Harga harus berupa angka.',
    'number.positive': 'Harga harus lebih dari 0.',
    'any.required': 'Harga wajib diisi.',
  }),
  deskripsi_singkat: Joi.string().allow('', null).optional(),
  deskripsi_lengkap: Joi.string().allow('', null).optional(),
  durasi: Joi.string().max(100).allow('', null).optional(),
  fasilitas: Joi.string().allow('', null).optional(),
  link_wa: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Link WhatsApp harus berupa URL yang valid.',
  }),
});

const updateSchema = Joi.object({
  judul: Joi.string().trim().max(200).messages({
    'string.empty': 'Judul tidak boleh kosong.',
    'string.max': 'Judul maksimal 200 karakter.',
  }),
  harga: Joi.number().positive().precision(2).messages({
    'number.base': 'Harga harus berupa angka.',
    'number.positive': 'Harga harus lebih dari 0.',
  }),
  deskripsi_singkat: Joi.string().allow('', null).optional(),
  deskripsi_lengkap: Joi.string().allow('', null).optional(),
  durasi: Joi.string().max(100).allow('', null).optional(),
  fasilitas: Joi.string().allow('', null).optional(),
  link_wa: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Link WhatsApp harus berupa URL yang valid.',
  }),
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
