// ============================================
// src/validators/auth.validator.js
// ============================================

const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Username/email wajib diisi.',
    'any.required': 'Username/email wajib diisi.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password wajib diisi.',
    'any.required': 'Password wajib diisi.',
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
  validateLogin: validate(loginSchema),
};
