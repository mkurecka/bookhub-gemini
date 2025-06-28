import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Home = () => {
  return (
    <div className="home-hero">
      <Container className="text-center text-white d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <h1>Welcome to BookHub!</h1>
        <p className="lead">Your online library portal. Discover and borrow books with ease.</p>
        <LinkContainer to="/books">
          <Button variant="primary" size="lg" className="mt-3">Browse Books</Button>
        </LinkContainer>
      </Container>
    </div>
  );
};

export default Home;