const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.get('/', getProperties);
router.get('/my-properties', protect, authorize('OWNER', 'ADMIN'), getOwnerProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('OWNER', 'ADMIN'), createProperty);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateProperty);
router.delete('/:id', protect, authorize('OWNER', 'ADMIN'), deleteProperty);

module.exports = router;
