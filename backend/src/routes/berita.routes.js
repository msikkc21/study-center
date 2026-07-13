// src/routes/berita.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/berita.controller');
const { authenticate } = require('../middleware/auth');
const { validateCreate, validateUpdate } = require('../validators/berita.validator');
const { uploaders } = require('../config/multer');

const upload = uploaders.berita.single('gambar');

router.get('/', ctrl.getAll);
router.get('/:slug', ctrl.getBySlug);
router.post('/', authenticate, upload, validateCreate, ctrl.create);
router.put('/:id', authenticate, upload, validateUpdate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
