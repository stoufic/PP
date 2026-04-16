const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getPermits, getPermit, createPermit, updatePermit, deletePermit, getExpiringPermits } = require('../controllers/permit.controller');

router.use(protect);

router.route('/')
  .get(getPermits)
  .post(createPermit);

router.get('/expiring', getExpiringPermits);

router.route('/:id')
  .get(getPermit)
  .put(updatePermit)
  .delete(deletePermit);

module.exports = router;
