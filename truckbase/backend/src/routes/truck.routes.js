const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getTrucks, getTruck, createTruck, updateTruck, deleteTruck } = require('../controllers/truck.controller');

router.use(protect);

router.route('/')
  .get(getTrucks)
  .post(createTruck);

router.route('/:id')
  .get(getTruck)
  .put(updateTruck)
  .delete(deleteTruck);

module.exports = router;
