// ============================================
// src/validators/user.validator.js
// ============================================

const Joi = require('joi');

const createSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(100).required().messages({
    'string.empty': 'Username wajib diisi.',
    'string.alphanum': 'Username hanya boleh mengandung huruf dan angka.',
    'string.min': 'Username minimal 3 karakter.',
    'string.max': 'Username maksimal 100 karakter.',
    'any.required': 'Username wajib diisi.',
  }),
  email: Joi.string().email().max(150).required().messages({
    'string.email': 'Format email tidak valid.',
    'string.max': 'Email maksimal 150 karakter.',
    'any.required': 'Email wajib diisi.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimal 8 karakter.',
    'any.required': 'Password wajib diisi.',
  }),
  nama_lengkap: Joi.string().trim().max(150).required().messages({
    'string.empty': 'Nama lengkap wajib diisi.',
    'string.max': 'Nama lengkap maksimal 150 karakter.',
    'any.required': 'Nama lengkap wajib diisi.',
  }),
  role: Joi.string().valid('admin', 'operator').required().messages({
    'any.only': 'Role harus admin atau operator.',
    'any.required': 'Role wajib diisi.',
  }),
  status: Joi.string().valid('active', 'inactive').optional().default('active'),
});

const updateSchema = Joi.object({
  email: Joi.string().email().max(150).messages({
    'string.email': 'Format email tidak valid.',
    'string.max': 'Email maksimal 150 karakter.',
  }),
  password: Joi.string().min(8).allow('', null).optional().messages({
    'string.min': 'Password minimal 8 karakter.',
  }),
  nama_lengkap: Joi.string().trim().max(150).messages({
    'string.empty': 'Nama lengkap tidak boleh kosong.',
    'string.max': 'Nama lengkap maksimal 150 karakter.',
  }),
  role: Joi.string().valid('admin', 'operator').messages({
    'any.only': 'Role harus admin atau operator.',
  }),
  status: Joi.string().valid('active', 'inactive').messages({
    'any.only': 'Status harus active atau inactive.',
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
