import React, { useState, useEffect } from 'react';
import { Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/loans', config);
        setLoans(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) return <p>Loading loans...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="p-3">
      <h2>Loans</h2>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Book</th>
              <th>Loan Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.user_name}</td>
                <td>{loan.book_title}</td>
                <td>{loan.loan_date ? new Date(loan.loan_date).toLocaleDateString() : '-'}</td>
                <td>
                  {loan.return_date
                    ? new Date(loan.return_date).toLocaleDateString()
                    : '-'}
                </td>
                <td>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default AdminLoanList;