const prisma = require('../config/database');

// @desc    Get all trucks (admin)
// @route   GET /api/trucks
// @access  Private/Admin
const getTrucks = async (req, res, next) => {
  try {
    const trucks = await prisma.truck.findMany({
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: trucks.length, data: trucks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single truck
// @route   GET /api/trucks/:id
// @access  Private
const getTruck = async (req, res, next) => {
  try {
    const truck = await prisma.truck.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, email: true, firstName: true, lastName: true } },
        locations: true,
        permits: true,
        events: { orderBy: { startDate: 'desc' }, take: 5 }
      }
    });

    if (!truck) {
      return res.status(404).json({ error: 'Truck not found' });
    }

    // Check authorization
    if (req.user.role !== 'OWNER' && truck.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this truck' });
    }

    res.json({ success: true, data: truck });
  } catch (error) {
    next(error);
  }
};

// @desc    Create truck
// @route   POST /api/trucks
// @access  Private
const createTruck = async (req, res, next) => {
  try {
    const { name, description, cuisineType, logoUrl } = req.body;

    const truck = await prisma.truck.create({
      data: {
        name,
        description,
        cuisineType,
        logoUrl,
        ownerId: req.user.id
      },
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } } }
    });

    // Update user's truckId
    await prisma.user.update({
      where: { id: req.user.id },
      data: { truckId: truck.id }
    });

    res.status(201).json({ success: true, data: truck });
  } catch (error) {
    next(error);
  }
};

// @desc    Update truck
// @route   PUT /api/trucks/:id
// @access  Private
const updateTruck = async (req, res, next) => {
  try {
    const { name, description, cuisineType, logoUrl, active } = req.body;

    let truck = await prisma.truck.findUnique({ where: { id: req.params.id } });

    if (!truck) {
      return res.status(404).json({ error: 'Truck not found' });
    }

    if (truck.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to update this truck' });
    }

    truck = await prisma.truck.update({
      where: { id: req.params.id },
      data: { name, description, cuisineType, logoUrl, active },
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } } }
    });

    res.json({ success: true, data: truck });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete truck
// @route   DELETE /api/trucks/:id
// @access  Private/Admin
const deleteTruck = async (req, res, next) => {
  try {
    const truck = await prisma.truck.findUnique({ where: { id: req.params.id } });

    if (!truck) {
      return res.status(404).json({ error: 'Truck not found' });
    }

    if (truck.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to delete this truck' });
    }

    await prisma.truck.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Truck deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTrucks, getTruck, createTruck, updateTruck, deleteTruck };
