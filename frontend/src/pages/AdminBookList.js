import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

const AdminBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchBooks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/books', config);
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBookHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/books/${id}`, config);
        setMessage('Book deleted successfully');
        fetchBooks();
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
      }
    }
  };

  return (
    <Card className="p-3">
      <Row className="align-items-center">
        <Col>
          <h2>Books</h2>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/books/create">
            <Button className="my-3">Create Book</Button>
          </LinkContainer>
        </Col>
      </Row>
      {message && <Alert variant="success">{message}</Alert>}
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Available Copies</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category_name}</td>
                <td>{book.available_copies}</td>
                <td>
                  <LinkContainer to={`/admin/books/${book.id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteBookHandler(book.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default AdminBookList;