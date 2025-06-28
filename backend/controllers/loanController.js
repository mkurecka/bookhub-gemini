
const pool = require('../config/db');

// @desc    Get all loans (Admin only)
// @route   GET /api/loans
// @access  Private (Admin)
const getLoans = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT l.*, u.name as user_name, b.title as book_title FROM loans l JOIN users u ON l.user_id = u.id JOIN books b ON l.book_id = b.id ORDER BY l.loan_date DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's loans
// @route   GET /api/loans/myloans
// @access  Private
const getMyLoans = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT l.*, b.title as book_title, b.author FROM loans l JOIN books b ON l.book_id = b.id WHERE l.user_id = $1 ORDER BY l.loan_date DESC'
      , [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Private
const createLoan = async (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.id;

  try {
    // Check if book is available
    const book = await pool.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
    if (book.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.rows[0].available_copies <= 0) {
      return res.status(400).json({ message: 'Book is not available for loan' });
    }

    // Check if user already has an active loan for this book
    const existingLoan = await pool.query(
      'SELECT * FROM loans WHERE user_id = $1 AND book_id = $2 AND status = $3'
      , [user_id, book_id, 'borrowed']
    );
    if (existingLoan.rows.length > 0) {
      return res.status(400).json({ message: 'You already have this book on loan' });
    }

    // Create loan
    const newLoan = await pool.query(
      'INSERT INTO loans (user_id, book_id) VALUES ($1, $2) RETURNING *'
      , [user_id, book_id]
    );

    // Decrease available copies
    await pool.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

    res.status(201).json(newLoan.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Return a book
// @route   PUT /api/loans/:id/return
// @access  Private
const returnLoan = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Find the loan
    const loan = await pool.query('SELECT * FROM loans WHERE id = $1 AND user_id = $2 AND status = $3', [id, user_id, 'borrowed']);

    if (loan.rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found or already returned' });
    }

    // Update loan status and return date
    const updatedLoan = await pool.query(
      'UPDATE loans SET status = $1, return_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *'
      , ['returned', id]
    );

    // Increase available copies
    await pool.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [loan.rows[0].book_id]);

    res.json(updatedLoan.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLoans, getMyLoans, createLoan, returnLoan };
