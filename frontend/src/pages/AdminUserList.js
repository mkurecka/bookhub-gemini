import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUserHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/users/${id}`, config);
        setMessage('User deleted successfully');
        fetchUsers();
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
      }
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="p-3">
      <h2>Users</h2>
      {message && <Alert variant="success">{message}</Alert>}
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>{user.role}</td>
              <td>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteUserHandler(user.id)}
                  disabled={user.role === 'admin'} // Prevent deleting admin users for safety
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default AdminUserList;