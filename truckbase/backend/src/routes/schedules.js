const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get schedule for date range
router.get('/', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const { startDate, endDate } = req.query;
    
    const where = { truckId: user.truckId };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const schedules = await req.prisma.schedule.findMany({
      where,
      include: {
        location: { select: { name: true, address: true, city: true } }
      },
      orderBy: { date: 'asc' }
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to get schedules.' });
  }
});

// Create schedule entry
router.post('/', auth, [
  body('date').isISO8601(),
  body('startTime').trim().notEmpty(),
  body('endTime').trim().notEmpty()
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

    const { date, startTime, endTime, locationId, notes } = req.body;

    const schedule = await req.prisma.schedule.create({
      data: {
        truckId: user.truckId,
        date: new Date(date),
        startTime,
        endTime,
        locationId,
        notes
      }
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule.' });
  }
});

// Delete schedule
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

    const schedule = await req.prisma.schedule.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    await req.prisma.schedule.delete({ where: { id } });
    res.json({ message: 'Schedule deleted.' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule.' });
  }
});

module.exports = router;
