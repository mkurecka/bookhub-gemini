
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminUserList from './pages/AdminUserList';
import AdminBookList from './pages/AdminBookList';
import AdminBookCreate from './pages/AdminBookCreate';
import AdminBookEdit from './pages/AdminBookEdit';
import AdminLoanList from './pages/AdminLoanList';
import AdminCategoryList from './pages/AdminCategoryList';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
            <Route path="users" element={<AdminUserList />} />
            <Route path="books" element={<AdminBookList />} />
            <Route path="books/create" element={<AdminBookCreate />} />
            <Route path="books/:id/edit" element={<AdminBookEdit />} />
            <Route path="loans" element={<AdminLoanList />} />
            <Route path="categories" element={<AdminCategoryList />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
