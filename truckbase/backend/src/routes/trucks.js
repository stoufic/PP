const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get user's truck
router.get('/my', auth, async (req, res) => {
  try {
    const truck = await req.prisma.truck.findFirst({
      where: { ownerId: req.user.id },
      include: {
        locations: { where: { isActive: true } },
        permits: { where: { status: 'ACTIVE' } },
        _count: { select: { events: true, inventoryItems: true } }
      }
    });

    if (!truck) {
      return res.status(404).json({ error: 'Truck not found.' });
    }

    res.json(truck);
  } catch (error) {
    console.error('Get truck error:', error);
    res.status(500).json({ error: 'Failed to get truck.' });
  }
});

// Create truck (for new users)
router.post('/', auth, [
  body('name').trim().notEmpty(),
  body('cuisineType').optional(),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a truck
    const existing = await req.prisma.truck.findFirst({
      where: { ownerId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({ error: 'You already own a truck.' });
    }

    const { name, cuisineType, description, logoUrl } = req.body;

    const truck = await req.prisma.truck.create({
      data: {
        name,
        cuisineType,
        description,
        logoUrl,
        ownerId: req.user.id
      }
    });

    // Update user with truckId
    await req.prisma.user.update({
      where: { id: req.user.id },
      data: { truckId: truck.id }
    });

    res.status(201).json(truck);
  } catch (error) {
    console.error('Create truck error:', error);
    res.status(500).json({ error: 'Failed to create truck.' });
  }
});

// Update truck
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cuisineType, description, logoUrl, active } = req.body;

    // Verify ownership
    const truck = await req.prisma.truck.findFirst({
      where: { id, ownerId: req.user.id }
    });

    if (!truck) {
      return res.status(404).json({ error: 'Truck not found.' });
    }

    const updated = await req.prisma.truck.update({
      where: { id },
      data: { name, cuisineType, description, logoUrl, active }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update truck error:', error);
    res.status(500).json({ error: 'Failed to update truck.' });
  }
});

module.exports = router;
