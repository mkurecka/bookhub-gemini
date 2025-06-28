import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchBooksAndCategories = async () => {
      try {
        const { data: booksData } = await axios.get(
          `/api/books?search=${searchTerm}&category=${selectedCategory}`
        );
        setBooks(booksData);

        const { data: categoriesData } = await axios.get('/api/categories');
        setCategories(categoriesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBooksAndCategories();
  }, [searchTerm, selectedCategory]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <h1>Books</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {books.length === 0 ? (
          <Col>
            <p>No books found.</p>
          </Col>
        ) : (
          books.map((book) => (
            <Col key={book.id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3 rounded">
                <Card.Body>
                  <Link to={`/books/${book.id}`}>
                    <Card.Title as="div">
                      <strong>{book.title}</strong>
                    </Card.Title>
                  </Link>
                  <Card.Text as="h6">{book.author}</Card.Text>
                  <Card.Text as="p">Category: {book.category_name}</Card.Text>
                  <Card.Text as="p">Available: {book.available_copies}</Card.Text>
                  <Card.Text as="p">
                    {book.description ? `${book.description.substring(0, 100)}...` : 'No description'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default BookList;