import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
// import Dashboard from './Dashboard';
import BookForm from './components/BookForm';
import BooksDashboard from './components/BooksDashboard';
import AdminDashboard from './components/AdminDashboard';
import BooksPage from './components/BookPage'; 
import OrdersDashboard from './components/OrdersDashboard'; 
import ContactsInfo from './components/ContactsInfo'; 
import ChartsPage from './components/ChartsPage'; 
import AdminLayout from './layouts/AdminLayout'; 
import UserLayout from './layouts/UserLayout'; 
import CartPage from './components/CartPage';
import './index.css';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="bookspage" element={<BooksPage />} />
          <Route path="booksdashboard" element={<BooksDashboard />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookform" element={<BookForm />} />
          <Route path="booksdashboard" element={<BooksDashboard />} />
          <Route path="bookspage" element={<BooksPage />} />
          <Route path="ordersdashboard" element={<OrdersDashboard />} />
          <Route path="contactsinfo" element={<ContactsInfo />} />
          <Route path="chartspage" element={<ChartsPage />} />
          <Route path="" element={<ChartsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
