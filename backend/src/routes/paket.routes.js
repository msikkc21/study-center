// src/routes/paket.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/paket.controller');
const { authenticate } = require('../middleware/auth');
const { validateCreate, validateUpdate } = require('../validators/paket.validator');
const { uploaders } = require('../config/multer');

const upload = uploaders.paket.single('gambar');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, upload, validateCreate, ctrl.create);
router.put('/:id', authenticate, upload, validateUpdate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
