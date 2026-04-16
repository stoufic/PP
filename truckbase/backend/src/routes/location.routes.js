const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getLocations, getLocation, createLocation, updateLocation, deleteLocation, recordVisit } = require('../controllers/location.controller');

router.use(protect);

router.route('/')
  .get(getLocations)
  .post(createLocation);

router.route('/:id')
  .get(getLocation)
  .put(updateLocation)
  .delete(deleteLocation);

router.post('/:id/visit', recordVisit);

module.exports = router;
