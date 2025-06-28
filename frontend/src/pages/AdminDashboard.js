import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container className="my-4">
      <Row>
        <Col md={3}>
          <Card className="p-3">
            <Nav className="flex-column" variant="pills">
              <LinkContainer to="/admin/users">
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin/books">
                <Nav.Link>Books</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin/loans">
                <Nav.Link>Loans</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin/categories">
                <Nav.Link>Categories</Nav.Link>
              </LinkContainer>
            </Nav>
          </Card>
        </Col>
        <Col md={9}>
          <Card className="p-3">
            <h1>Admin Dashboard</h1>
            <Outlet /> {/* This will render the nested routes */}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
