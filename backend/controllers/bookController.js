const pool = require('../config/db');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT b.*, c.name as category_name FROM books b JOIN categories c ON b.category_id = c.id';
  const queryParams = [];
  const conditions = [];

  if (search) {
    conditions.push('(LOWER(b.title) LIKE $1 OR LOWER(b.author) LIKE $2)');
    queryParams.push(`%${search.toLowerCase()}%`);
    queryParams.push(`%${search.toLowerCase()}%`);
  }

  if (category) {
    conditions.push('b.category_id = $' + (queryParams.length + 1));
    queryParams.push(category);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY b.title';

  try {
    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT b.*, c.name as category_name FROM books b JOIN categories c ON b.category_id = c.id WHERE b.id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (Admin)
const createBook = async (req, res) => {
  const { title, author, isbn, category_id, available_copies, description } = req.body;

  if (!title || !author || !isbn || !category_id) {
    return res.status(400).json({ message: 'Please enter all required fields: title, author, isbn, category_id' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO books (title, author, isbn, category_id, available_copies, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
      , [title, author, isbn, category_id, available_copies || 1, description]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation for ISBN
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (Admin)
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category_id, available_copies, description } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE books SET title = $1, author = $2, isbn = $3, category_id = $4, available_copies = $5, description = $6 WHERE id = $7 RETURNING *'
      , [title, author, isbn, category_id, available_copies, description, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation for ISBN
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Admin)
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };