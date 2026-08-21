const express = require('express');
const router = express.Router();
const { addReview, getPropertyReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.post('/', protect, addReview);
router.get('/property/:propertyId', getPropertyReviews);
router.delete('/:id', protect, authorize('ADMIN'), deleteReview);

module.exports = router;
