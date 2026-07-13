// src/routes/user.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');
const { validateCreate, validateUpdate } = require('../validators/user.validator');

// Semua routes user memerlukan authenticate + adminOnly
router.use(authenticate, adminOnly);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validateCreate, ctrl.create);
router.put('/:id', validateUpdate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
