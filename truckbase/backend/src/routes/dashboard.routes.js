const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getOverview, getAnalytics } = require('../controllers/dashboard.controller');

router.use(protect);

router.get('/overview', getOverview);
router.get('/analytics', getAnalytics);

module.exports = router;
