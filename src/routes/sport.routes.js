const { Router } = require('express');
const sportController = require('../controllers/sport.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);
router.get('/', sportController.getAll);
router.get('/:id', sportController.getById);
router.post('/', sportController.create);
router.put('/:id', sportController.update);
router.delete('/:id', sportController.remove);
router.patch('/:id/status', sportController.changeStatus);

module.exports = router;