
const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getBooks).post(protect, authorize('admin'), createBook);
router.route('/:id').get(getBookById).put(protect, authorize('admin'), updateBook).delete(protect, authorize('admin'), deleteBook);

module.exports = router;
