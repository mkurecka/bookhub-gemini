const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').delete(protect, authorize('admin'), deleteUser);

module.exports = router;