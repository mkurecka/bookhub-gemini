
const express = require('express');
const router = express.Router();
const { getLoans, getMyLoans, createLoan, returnLoan } = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, authorize('admin'), getLoans).post(protect, createLoan);
router.get('/myloans', protect, getMyLoans);
router.put('/:id/return', protect, returnLoan);

module.exports = router;
