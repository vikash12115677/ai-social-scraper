const express = require('express');
const router = express.Router();
const { exportCSV, exportPDF } = require('../controllers/exportController');
const { authenticate } = require('../middleware/auth');

router.get('/csv', authenticate, exportCSV);
router.get('/pdf', authenticate, exportPDF);

module.exports = router;
