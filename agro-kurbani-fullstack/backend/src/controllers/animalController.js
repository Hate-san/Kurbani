const { Animal, User } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

const listAnimals = catchAsync(async (req, res) => {
  const { category, status, farmerId } = req.query;
  const where = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (farmerId) where.farmer_id = farmerId;

  const animals = await Animal.findAll({
    where,
    include: [{ model: User, as: 'farmer', attributes: ['id', 'name'] }],
    order: [['created_at', 'DESC']],
  });
  res.json({ animals });
});

const getAnimal = catchAsync(async (req, res) => {
  const animal = await Animal.findByPk(req.params.id, {
    include: [{ model: User, as: 'farmer', attributes: ['id', 'name'] }],
  });
  if (!animal) throw new ApiError(404, 'Animal not found');
  res.json({ animal });
});

const createAnimal = catchAsync(async (req, res) => {
  const { title, category, breed, age, weight, farm_location, price_per_share, total_shares, description, image } = req.body;
  if (!title || !category || !price_per_share) {
    throw new ApiError(400, 'title, category and price_per_share are required');
  }
  const shares = Math.min(7, Math.max(1, parseInt(total_shares, 10) || 1));

  const animal = await Animal.create({
    farmer_id: req.user.id,
    title,
    category,
    breed,
    age,
    weight,
    farm_location,
    price_per_share,
    total_shares: shares,
    available_shares: shares,
    description,
    image,
    status: 'available',
  });
  res.status(201).json({ animal });
});

const updateAnimal = catchAsync(async (req, res) => {
  const animal = await Animal.findByPk(req.params.id);
  if (!animal) throw new ApiError(404, 'Animal not found');
  if (animal.farmer_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only edit your own listings');
  }

  const editable = ['title', 'category', 'breed', 'age', 'weight', 'farm_location', 'price_per_share', 'description', 'image', 'status'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) animal[field] = req.body[field];
  });
  await animal.save();
  res.json({ animal });
});

const deleteAnimal = catchAsync(async (req, res) => {
  const animal = await Animal.findByPk(req.params.id);
  if (!animal) throw new ApiError(404, 'Animal not found');
  if (animal.farmer_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only remove your own listings');
  }
  await animal.destroy();
  res.json({ message: 'Animal removed' });
});

module.exports = { listAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal };
