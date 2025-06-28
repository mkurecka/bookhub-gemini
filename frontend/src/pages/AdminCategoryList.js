import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('/api/categories', { name: newCategoryName }, config);
      setMessage('Category created successfully');
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/categories/${id}`, config);
        setMessage('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
      }
    }
  };

  const startEditHandler = (category) => {
    setEditingCategory(category.id);
    setEditedCategoryName(category.name);
  };

  const updateCategoryHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/categories/${id}`, { name: editedCategoryName }, config);
      setMessage('Category updated successfully');
      setEditingCategory(null);
      setEditedCategoryName('');
      fetchCategories();
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h2>Categories</h2>
      {message && <Alert variant="success">{message}</Alert>}

      <Card className="p-3 mb-4">
        <h3>Create New Category</h3>
        <Form onSubmit={createCategoryHandler}>
          <Form.Group controlId="newCategoryName" className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Add Category
          </Button>
        </Form>
      </Card>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <Card className="p-3">
          <Table striped bordered hover responsive className="table-sm mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {editingCategory === category.id ? (
                      <Form.Control
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                      ></Form.Control>
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>
                    {editingCategory === category.id ? (
                      <Button
                        variant="success"
                        className="btn-sm me-2"
                        onClick={() => updateCategoryHandler(category.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="light"
                        className="btn-sm me-2"
                        onClick={() => startEditHandler(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteCategoryHandler(category.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default AdminCategoryList;