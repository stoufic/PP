const prisma = require('../config/database');

// @desc    Get all locations for a truck
// @route   GET /api/locations
// @access  Private
const getLocations = async (req, res, next) => {
  try {
    const truckId = req.query.truckId || req.user.truckId;
    
    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const locations = await prisma.location.findMany({
      where: { truckId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
const getLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.findUnique({
      where: { id: req.params.id }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    if (location.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to access this location' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

// @desc    Create location
// @route   POST /api/locations
// @access  Private
const createLocation = async (req, res, next) => {
  try {
    const { name, address, city, state, zipCode, latitude, longitude, notes } = req.body;
    const truckId = req.body.truckId || req.user.truckId;

    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const location = await prisma.location.create({
      data: {
        truckId,
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        notes
      }
    });

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { name, address, city, state, zipCode, latitude, longitude, notes, isActive, avgRevenue } = req.body;

    let location = await prisma.location.findUnique({ where: { id: req.params.id } });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    if (location.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to update this location' });
    }

    location = await prisma.location.update({
      where: { id: req.params.id },
      data: { name, address, city, state, zipCode, latitude, longitude, notes, isActive, avgRevenue }
    });

    res.json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private
const deleteLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.findUnique({ where: { id: req.params.id } });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    if (location.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to delete this location' });
    }

    await prisma.location.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Record location visit
// @route   POST /api/locations/:id/visit
// @access  Private
const recordVisit = async (req, res, next) => {
  try {
    const { revenue } = req.body;

    const location = await prisma.location.findUnique({ where: { id: req.params.id } });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    if (location.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const newVisitCount = location.visitCount + 1;
    const newAvgRevenue = revenue 
      ? ((location.avgRevenue || 0) * location.visitCount + revenue) / newVisitCount
      : location.avgRevenue;

    const updatedLocation = await prisma.location.update({
      where: { id: req.params.id },
      data: {
        visitCount: newVisitCount,
        lastVisited: new Date(),
        avgRevenue: newAvgRevenue
      }
    });

    res.json({ success: true, data: updatedLocation });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLocations, getLocation, createLocation, updateLocation, deleteLocation, recordVisit };
