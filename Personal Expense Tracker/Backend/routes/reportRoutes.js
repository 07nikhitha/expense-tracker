const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports', reportController.getAllReports);
router.post('/reports',reportController.createReport);
router.get('/reports/user/:userId',reportController.getUserReports);
module.exports = router;

