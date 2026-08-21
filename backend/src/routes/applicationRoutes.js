const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createApplication);
router.get('/', protect, getApplications);
router.put('/:id', protect, updateApplicationStatus);

module.exports = router;
