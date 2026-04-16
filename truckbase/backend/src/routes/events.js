const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const events = await req.prisma.event.findMany({
      where: { truckId: user.truckId },
      orderBy: { startDate: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events.' });
  }
});

// Create event
router.post('/', auth, [
  body('name').trim().notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('location').trim().notEmpty()
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

    const { name, description, startDate, endDate, location, address, type, fee, notes } = req.body;

    const event = await req.prisma.event.create({
      data: {
        truckId: user.truckId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        address,
        type: type || 'OTHER',
        fee,
        notes
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

// Update event
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

    const event = await req.prisma.event.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const { name, description, startDate, endDate, location, address, type, status, fee, notes } = req.body;

    const updated = await req.prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        address,
        type,
        status,
        fee,
        notes
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event.' });
  }
});

// Delete event
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

    const event = await req.prisma.event.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    await req.prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

module.exports = router;
