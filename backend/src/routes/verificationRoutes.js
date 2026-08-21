const express = require('express');
const router = express.Router();
const { submitVerification, getVerifications, handleVerification } = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.post('/', protect, authorize('OWNER'), submitVerification);
router.get('/', protect, authorize('ADMIN'), getVerifications);
router.put('/:id', protect, authorize('ADMIN'), handleVerification);

module.exports = router;
