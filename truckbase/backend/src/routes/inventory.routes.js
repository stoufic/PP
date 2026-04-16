const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getInventory, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem, restockItem } = require('../controllers/inventory.controller');

router.use(protect);

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

router.route('/:id')
  .get(getInventoryItem)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

router.post('/:id/restock', restockItem);

module.exports = router;
