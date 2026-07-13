// src/routes/auth.routes.js
const router = require('express').Router();
const { login, logout, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validateLogin } = require('../validators/auth.validator');

router.post('/login', validateLogin, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
