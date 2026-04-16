const prisma = require('../config/database');

// @desc    Get all inventory items for a truck
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res, next) => {
  try {
    const truckId = req.query.truckId || req.user.truckId;
    
    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const { category, lowStock } = req.query;
    
    const where = { truckId };
    
    if (category) {
      where.category = category;
    }
    
    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventoryItem.fields.minQuantity };
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    // Calculate space usage
    const totalSpaceUsed = items.reduce((sum, item) => sum + (item.spaceRequired * item.quantity), 0);

    res.json({ 
      success: true, 
      count: items.length, 
      data: items,
      meta: { totalSpaceUsed }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItem = async (req, res, next) => {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to access this item' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private
const createInventoryItem = async (req, res, next) => {
  try {
    const { 
      name, category, quantity, unit, minQuantity, maxQuantity, 
      spaceRequired, costPerUnit, supplier, expiryDate, location 
    } = req.body;
    
    const truckId = req.body.truckId || req.user.truckId;

    if (!truckId) {
      return res.status(400).json({ error: 'Truck ID is required' });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        truckId,
        name,
        category,
        quantity,
        unit,
        minQuantity,
        maxQuantity,
        spaceRequired,
        costPerUnit,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        location
      }
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
const updateInventoryItem = async (req, res, next) => {
  try {
    const { 
      name, category, quantity, unit, minQuantity, maxQuantity, 
      spaceRequired, costPerUnit, supplier, expiryDate, location, lastRestocked 
    } = req.body;

    let item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        quantity,
        unit,
        minQuantity,
        maxQuantity,
        spaceRequired,
        costPerUnit,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        location,
        lastRestocked: lastRestocked ? new Date(lastRestocked) : undefined
      }
    });

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await prisma.inventoryItem.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock inventory item
// @route   POST /api/inventory/:id/restock
// @access  Private
const restockItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.truckId !== req.user.truckId && req.user.role !== 'OWNER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        quantity: item.quantity + quantity,
        lastRestocked: new Date()
      }
    });

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem, restockItem };
