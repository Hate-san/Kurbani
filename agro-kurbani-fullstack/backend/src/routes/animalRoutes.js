const router = require('express').Router();
const { listAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', listAnimals);
router.get('/:id', getAnimal);
router.post('/', requireAuth, requireRole('farmer', 'admin'), createAnimal);
router.put('/:id', requireAuth, requireRole('farmer', 'admin'), updateAnimal);
router.delete('/:id', requireAuth, requireRole('farmer', 'admin'), deleteAnimal);

module.exports = router;
