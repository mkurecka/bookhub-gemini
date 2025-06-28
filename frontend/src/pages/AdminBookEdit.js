import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminBookEdit = () => {
  const { id } = useParams();
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
    const fetchBookAndCategories = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data: bookData } = await axios.get(`/api/books/${id}`, config);
        setTitle(bookData.title);
        setAuthor(bookData.author);
        setIsbn(bookData.isbn);
        setCategoryId(bookData.category_id);
        setAvailableCopies(bookData.available_copies);
        setDescription(bookData.description);

        const { data: categoriesData } = await axios.get('/api/categories', config);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
        setLoading(false);
      }
    };
    fetchBookAndCategories();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `/api/books/${id}`,
        { title, author, isbn, category_id: categoryId, available_copies: availableCopies, description },
        config
      );
      setMessage('Book updated successfully');
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
      <h1>Edit Book</h1>
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
          Update Book
        </Button>
      </Form>
    </Card>
  );
};

export default AdminBookEdit;