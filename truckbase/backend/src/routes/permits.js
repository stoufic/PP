const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all permits with expiry alerts
router.get('/', auth, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const permits = await req.prisma.permit.findMany({
      where: { truckId: user.truckId },
      orderBy: { expiryDate: 'asc' }
    });

    // Add expiry alert flag
    const permitsWithAlerts = permits.map(permit => ({
      ...permit,
      expiresSoon: new Date(permit.expiryDate) <= thirtyDaysFromNow,
      isExpired: new Date(permit.expiryDate) < new Date()
    }));

    res.json(permitsWithAlerts);
  } catch (error) {
    console.error('Get permits error:', error);
    res.status(500).json({ error: 'Failed to get permits.' });
  }
});

// Create permit
router.post('/', auth, [
  body('type').notEmpty(),
  body('name').trim().notEmpty(),
  body('expiryDate').isISO8601(),
  body('issuedDate').optional().isISO8601()
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

    const { type, name, permitNumber, issuedDate, expiryDate, notes, fileUrl } = req.body;

    const permit = await req.prisma.permit.create({
      data: {
        truckId: user.truckId,
        type,
        name,
        permitNumber,
        issuedDate: issuedDate ? new Date(issuedDate) : new Date(),
        expiryDate: new Date(expiryDate),
        notes,
        fileUrl
      }
    });

    res.status(201).json(permit);
  } catch (error) {
    console.error('Create permit error:', error);
    res.status(500).json({ error: 'Failed to create permit.' });
  }
});

// Update permit status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { truckId: true }
    });

    if (!user?.truckId) {
      return res.status(404).json({ error: 'No truck found.' });
    }

    const permit = await req.prisma.permit.findFirst({
      where: { id, truckId: user.truckId }
    });

    if (!permit) {
      return res.status(404).json({ error: 'Permit not found.' });
    }

    const updated = await req.prisma.permit.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update permit error:', error);
    res.status(500).json({ error: 'Failed to update permit.' });
  }
});

module.exports = router;
