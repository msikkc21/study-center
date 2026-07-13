// src/routes/produk.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/produk.controller');
const { authenticate } = require('../middleware/auth');
const { validateCreate, validateUpdate } = require('../validators/produk.validator');
const { uploaders } = require('../config/multer');

const upload = uploaders.produk.single('gambar');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, upload, validateCreate, ctrl.create);
router.put('/:id', authenticate, upload, validateUpdate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
