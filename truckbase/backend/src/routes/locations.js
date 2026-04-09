const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all locations for user's truck
router.get('/', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const locations = await req.prisma.location.findMany({
      where: { truckId: user.truckId },
      orderBy: { lastVisited: 'desc' }
    });

    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to get locations.' });
  }
});

// Create location
router.post('/', auth, [
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('zipCode').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const { name, address, city, state, zipCode, latitude, longitude, notes } = req.body;

    const location = await req.prisma.location.create({
      data: {
        truckId: user.truckId,
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

    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location.' });
  }
});

// Update location
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const location = await req.prisma.location.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    const { name, address, city, state, zipCode, latitude, longitude, notes, avgRevenue, isActive } = req.body;

    const updated = await req.prisma.location.update({
      where: { id },
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        notes,
        avgRevenue,
        isActive,
        lastVisited: req.body.lastVisited ? new Date(req.body.lastVisited) : undefined
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location.' });
  }
});

// Delete location
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const location = await req.prisma.location.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    await req.prisma.location.delete({ where: { id } });
    res.json({ message: 'Location deleted.' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: 'Failed to delete location.' });
  }
});

module.exports = router;
