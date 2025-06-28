import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanMessage, setLoanMessage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`/api/books/${id}`);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleLoan = async () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('/api/loans', { book_id: id }, config);
      setLoanMessage('Book successfully loaned!');
      // Optionally, refresh book details to show updated available copies
      const { data } = await axios.get(`/api/books/${id}`);
      setBook(data);
    } catch (err) {
      setLoanMessage(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <Container className="my-4">
      {loanMessage && <Alert variant={loanMessage.includes('successfully') ? 'success' : 'danger'}>{loanMessage}</Alert>}
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h1 className="mb-0">{book.title}</h1>
              <h3 className="text-muted">by {book.author}</h3>
              <hr />
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Category:</strong> {book.category_name}</p>
              <p><strong>Available Copies:</strong> {book.available_copies}</p>
              <p>{book.description}</p>
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-center align-items-center">
              <Button
                variant="primary"
                onClick={handleLoan}
                disabled={book.available_copies === 0}
                className="w-100"
              >
                {book.available_copies > 0 ? 'Loan Book' : 'Not Available'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookDetail;
