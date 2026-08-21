const express = require('express');
const router = express.Router();
const { reportProperty, getReports, resolveReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.post('/', protect, reportProperty);
router.get('/', protect, authorize('ADMIN'), getReports);
router.put('/:id/resolve', protect, authorize('ADMIN'), resolveReport);

module.exports = router;
