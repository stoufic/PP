const prisma = require('../config/database');

// @desc    Get all permits for a truck
// @route   GET /api/permits
// @access  Private
const getPermits = async (req, res, next) => {
  try {
    const truckId = req.query.truckId || req.user.truckId;
    
    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const permits = await prisma.permit.findMany({
      where: { truckId },
      orderBy: { expiryDate: 'asc' }
    });

    res.json({ success: true, count: permits.length, data: permits });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single permit
// @route   GET /api/permits/:id
// @access  Private
const getPermit = async (req, res, next) => {
  try {
    const permit = await prisma.permit.findUnique({
      where: { id: req.params.id }
    });

    if (!permit) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    if (permit.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to access this permit' });
    }

    res.json({ success: true, data: permit });
  } catch (error) {
    next(error);
  }
};

// @desc    Create permit
// @route   POST /api/permits
// @access  Private
const createPermit = async (req, res, next) => {
  try {
    const { type, name, permitNumber, issuedDate, expiryDate, notes, fileUrl } = req.body;
    const truckId = req.body.truckId || req.user.truckId;

    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const permit = await prisma.permit.create({
      data: {
        truckId,
        type,
        name,
        permitNumber,
        issuedDate: new Date(issuedDate),
        expiryDate: new Date(expiryDate),
        notes,
        fileUrl
      }
    });

    res.status(201).json({ success: true, data: permit });
  } catch (error) {
    next(error);
  }
};

// @desc    Update permit
// @route   PUT /api/permits/:id
// @access  Private
const updatePermit = async (req, res, next) => {
  try {
    const { type, name, permitNumber, issuedDate, expiryDate, status, notes, fileUrl, notified } = req.body;

    let permit = await prisma.permit.findUnique({ where: { id: req.params.id } });

    if (!permit) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    if (permit.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to update this permit' });
    }

    permit = await prisma.permit.update({
      where: { id: req.params.id },
      data: {
        type,
        name,
        permitNumber,
        issuedDate: issuedDate ? new Date(issuedDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        status,
        notes,
        fileUrl,
        notified
      }
    });

    res.json({ success: true, data: permit });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete permit
// @route   DELETE /api/permits/:id
// @access  Private
const deletePermit = async (req, res, next) => {
  try {
    const permit = await prisma.permit.findUnique({ where: { id: req.params.id } });

    if (!permit) {
      return res.status(404).json({ error: 'Permit not found' });
    }

    if (permit.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to delete this permit' });
    }

    await prisma.permit.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Permit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expiring permits
// @route   GET /api/permits/expiring
// @access  Private
const getExpiringPermits = async (req, res, next) => {
  try {
    const truckId = req.query.truckId || req.user.truckId;
    const days = parseInt(req.query.days) || 30;

    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const permits = await prisma.permit.findMany({
      where: {
        truckId,
        status: 'ACTIVE',
        expiryDate: { lte: futureDate }
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json({ success: true, count: permits.length, data: permits });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPermits, getPermit, createPermit, updatePermit, deletePermit, getExpiringPermits };
