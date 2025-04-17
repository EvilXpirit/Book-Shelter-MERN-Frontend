import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faBook, faCompass, faUser, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/book logo.png';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as ScrollLink, scroller } from 'react-scroll';
import axios from 'axios';
import withCart from './withCart';
import baseUrl from '../../Urls';

const Navbar = ({ cart, setShowCart }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(`${baseUrl}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out: ' + (error.response?.data || error.message));
    }
  };

  const handleBooksClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo('new-arrivals', {
          duration: 500,
          smooth: true,
        });
      }, 100); 
    } else {
      scroller.scrollTo('new-arrivals', {
        duration: 500,
        smooth: true,
      });
    }
  };
  const renderNavItems = () => {
    const commonItems = [
      <li key="home">
        <RouterLink to="/" className="hover:text-yellow-400">
          <FontAwesomeIcon icon={faHome} className="pr-2" />
          Home
        </RouterLink>
      </li>,
      <li key="books">
        <button onClick={handleBooksClick} className="hover:text-yellow-400">
          <FontAwesomeIcon icon={faBook} className="pr-2" />
          Books
        </button>
      </li>,
      <li key="explore">
        <RouterLink to="/bookspage" className="hover:text-yellow-400">
          <FontAwesomeIcon icon={faCompass} className="pr-2" />
          Explore
        </RouterLink>
      </li>
    ];

    if (isLoggedIn) {
      return [
        ...commonItems,
        <li key="cart">
          <RouterLink to="/cart" className="hover:text-yellow-400">
            <FontAwesomeIcon icon={faShoppingCart} className="pr-2" />
            ({cart.length})
          </RouterLink>
        </li>,
        <li key="logout">
          <button onClick={handleLogout} className="hover:text-yellow-400">
            <FontAwesomeIcon icon={faSignOutAlt} className="pr-2" />
            Sign Out
          </button>
        </li>
      ];
    } else {
      return [
        ...commonItems,
        <li key="login">
          <RouterLink to="/login" className="hover:text-yellow-400">
            <FontAwesomeIcon icon={faUser} className="pr-2" />
            Login
          </RouterLink>
        </li>
      ];
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-3">
        <div className="flex items-center">
          <RouterLink to="/">
            <img src={logo} alt="Logo" className="w-auto h-12 mr-2" />
          </RouterLink>
        </div>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {showMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
          </button>
        </div>
        <ul className={`lg:flex ${showMenu ? 'flex flex-col absolute top-20 left-0 right-0 bg-blue-700 p-5' : 'hidden'} space-y-4 lg:space-y-0 lg:space-x-8 text-white text-base`}>
          {renderNavItems()}
        </ul>
      </div>
    </nav>
  );
};

export default withCart(Navbar);

