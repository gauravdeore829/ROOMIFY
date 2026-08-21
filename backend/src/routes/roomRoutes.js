const express = require('express');
const router = express.Router();
const { addRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.post('/', protect, authorize('OWNER', 'ADMIN'), addRoom);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateRoom);
router.delete('/:id', protect, authorize('OWNER', 'ADMIN'), deleteRoom);

module.exports = router;
