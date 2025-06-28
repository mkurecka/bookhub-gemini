import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const UserProfile = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnMessage, setReturnMessage] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchMyLoans = async () => {
    if (!userInfo || !userInfo.token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/loans/myloans', config);
      setLoans(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/loans/${loanId}/return`, {}, config);
      setReturnMessage('Book successfully returned!');
      fetchMyLoans(); // Refresh loans after return
    } catch (err) {
      setReturnMessage(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container className="my-4">
      <Row>
        <Col md={12}>
          <h1 className="mb-4">User Profile</h1>
          {userInfo && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Welcome, {userInfo.user.name}!</Card.Title>
                <Card.Text>Email: {userInfo.user.email}</Card.Text>
                <Card.Text>Role: {userInfo.user.role}</Card.Text>
              </Card.Body>
            </Card>
          )}

          <h2>My Loans</h2>
          {returnMessage && <Alert variant={returnMessage.includes('successfully') ? 'success' : 'danger'}>{returnMessage}</Alert>}
          {loans.length === 0 ? (
            <p>You have no loans.</p>
          ) : (
            <Card>
              <Card.Body>
                <Table striped bordered hover responsive className="table-sm mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Loan Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{loan.book_title}</td>
                        <td>{loan.author}</td>
                        <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                        <td>
                          {loan.return_date
                            ? new Date(loan.return_date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>{loan.status}</td>
                        <td>
                          {loan.status === 'borrowed' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleReturn(loan.id)}
                            >
                              Return
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;