const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, toggleUserStatus, verifyProperty } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.put('/properties/:id/verify', verifyProperty);

module.exports = router;
