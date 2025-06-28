import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminBookCreate = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [availableCopies, setAvailableCopies] = useState(1);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/categories', config);
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        '/api/books',
        { title, author, isbn, category_id: categoryId, available_copies: availableCopies, description },
        config
      );
      setMessage('Book created successfully');
      navigate('/admin/books');
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="p-3">
      <h1>Create Book</h1>
      {message && <Alert variant="success">{message}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="title" className="my-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="author" className="my-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="isbn" className="my-3">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="category" className="my-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="availableCopies" className="my-3">
          <Form.Label>Available Copies</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter available copies"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="description" className="my-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Create Book
        </Button>
      </Form>
    </Card>
  );
};

export default AdminBookCreate;