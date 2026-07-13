// ============================================
// src/validators/produk.validator.js
// ============================================

const Joi = require('joi');

const createSchema = Joi.object({
  nama_produk: Joi.string().trim().max(150).required().messages({
    'string.empty': 'Nama produk wajib diisi.',
    'string.max': 'Nama produk maksimal 150 karakter.',
    'any.required': 'Nama produk wajib diisi.',
  }),
  deskripsi: Joi.string().allow('', null).optional(),
  link_wa: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Link WhatsApp harus berupa URL yang valid.',
  }),
});

const updateSchema = Joi.object({
  nama_produk: Joi.string().trim().max(150).messages({
    'string.empty': 'Nama produk tidak boleh kosong.',
    'string.max': 'Nama produk maksimal 150 karakter.',
  }),
  deskripsi: Joi.string().allow('', null).optional(),
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
