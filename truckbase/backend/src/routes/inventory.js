const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get inventory with low stock alerts
router.get('/', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const items = await req.prisma.inventoryItem.findMany({
      where: { truckId: user.truckId },
      orderBy: { name: 'asc' }
    });

    // Add low stock alerts
    const itemsWithAlerts = items.map(item => ({
      ...item,
      isLowStock: item.quantity <= item.minQuantity,
      isOverstocked: item.quantity > item.maxQuantity
    }));

    res.json(itemsWithAlerts);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to get inventory.' });
  }
});

// Create inventory item
router.post('/', auth, [
  body('name').trim().notEmpty(),
  body('category').notEmpty(),
  body('quantity').isInt({ min: 0 }),
  body('unit').trim().notEmpty(),
  body('minQuantity').isInt({ min: 0 }),
  body('maxQuantity').isInt({ min: 0 })
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

    const {
      name, category, quantity, unit, minQuantity, maxQuantity,
      spaceRequired, costPerUnit, supplier, location, expiryDate
    } = req.body;

    const item = await req.prisma.inventoryItem.create({
      data: {
        truckId: user.truckId,
        name,
        category,
        quantity,
        unit,
        minQuantity,
        maxQuantity,
        spaceRequired: spaceRequired || 0,
        costPerUnit,
        supplier,
        location,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ error: 'Failed to create inventory item.' });
  }
});

// Update inventory quantity
router.patch('/:id/quantity', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, lastRestocked } = req.body;

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const item = await req.prisma.inventoryItem.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const updated = await req.prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity,
        lastRestocked: lastRestocked ? new Date(lastRestocked) : new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Failed to update inventory.' });
  }
});

// Delete inventory item
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

    const item = await req.prisma.inventoryItem.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    await req.prisma.inventoryItem.delete({ where: { id } });
    res.json({ message: 'Item deleted.' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
