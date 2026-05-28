// analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getOverview, getTrending } = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/trending', getTrending);

module.exports = router;
