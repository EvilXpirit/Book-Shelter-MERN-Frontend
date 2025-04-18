import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faBook, faCompass, faUser, faSignOutAlt, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/book logo.png';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink, scroller } from 'react-scroll';
import axios from 'axios';
import withCart from './withCart';
import baseUrl from '../../Urls';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = ({ cart, setShowCart }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  // Add GSAP animations
  useGSAP(() => {
    // Logo animation
    gsap.from('.nav-logo', {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Nav items animation
    gsap.from('.nav-item', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Mobile menu button animation
    gsap.from('.mobile-menu-btn', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: 0.8,
      ease: 'back.out(1.7)'
    });
  });

    // Handle navbar background on scroll
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  

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
    if (!showMenu) {
      gsap.from('.mobile-menu-item', {
        x: -30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
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
      <li key="home" className="nav-item">
        <RouterLink 
          to="/" 
          className={`hover:text-yellow-400 relative group py-2 px-3 transition-all duration-300
            ${location.pathname === '/' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FontAwesomeIcon icon={faHome} className="pr-2" />
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
        </RouterLink>
      </li>,
      <li key="books" className="nav-item">
        <button onClick={handleBooksClick}   className={`hover:text-yellow-400 relative group py-2 px-3 transition-all duration-300 text-white`}
        >
          <FontAwesomeIcon icon={faBook} className="pr-2" />
          Books
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
        </button>
      </li>,
      <li key="explore" className="nav-item">
                <RouterLink 
          to="/bookspage" 
          className={`hover:text-yellow-400 relative group py-2 px-3 transition-all duration-300
            ${location.pathname === '/bookspage' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FontAwesomeIcon icon={faCompass} className="pr-2" />
          Explore
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
        </RouterLink>
      </li>
    ];

    if (isLoggedIn) {
      return [
        ...commonItems,
        <li key="cart" className="nav-item">
          <RouterLink to="/cart" className={`hover:text-yellow-400 py-2  px-3 relative group transition-all duration-300
            ${location.pathname === '/cart' ? 'text-yellow-400' : 'text-white'}`}
        >
            <FontAwesomeIcon icon={faShoppingCart} className="pr-2" />
            ({cart.length})
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
        </li>,
        <li key="logout" className="nav-item">
          <button onClick={handleLogout} className={`hover:text-yellow-400  px-3 relative group transition-all duration-300
            ${location.pathname === '/logout' ? 'text-yellow-400' : 'text-white'}`}
        >
            <FontAwesomeIcon icon={faSignOutAlt} className="pr-2" />
            Sign Out
            <span className="absolute bottom-0 left-0 w-0 h-0.5 -my-2 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
          </button>
        </li>
      ];
    } else {
      return [
        ...commonItems,
        <li key="login" className="nav-item">
          <RouterLink to="/login" className={`hover:text-yellow-400 py-2 px-3 relative group transition-all duration-300
            ${location.pathname === '/login' ? 'text-yellow-400' : 'text-white'}`}
        >
            <FontAwesomeIcon icon={faUser} className="pr-2" />
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
        </li>
      ];

          // Update mobile menu items
    if (showMenu) {
      return commonItems.map((item, index) => (
        <div key={index} className="mobile-menu-item">
          {item}
        </div>
      ));
    }

    return commonItems;

    }
  };

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gradient-to-l from-blue-900/75 to-blue-600/75 backdrop-blur-md shadow-2xl rounded-b-md' 
      : 'bg-gradient-to-r from-blue-900/85 to-blue-600/85 p-5 shadow-lg rounded-b-lg'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with animation class */}
          <RouterLink to="/" className="nav-logo flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-auto h-12 transition-transform duration-300 group-hover:scale-110" 
            />
          </RouterLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 list-none">
            {renderNavItems()}
          </div>

          {/* Mobile Navigation Button with animation class */}
          <div className="lg:hidden flex items-center space-x-4">
            <button 
              onClick={toggleMenu} 
              className="mobile-menu-btn text-white p-2 hover:text-yellow-400 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={showMenu ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {/* <div className={`${
          showSearch ? 'max-h-16 opacity-100 mt-4' : 'max-h-0 opacity-0'
        } lg:hidden transition-all duration-300 overflow-hidden`}>
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div> */}

        {/* Mobile Menu */}
        <div className={`lg:hidden ${
          showMenu 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        } transition-all duration-300 ease-in-out`}>
          <ul className="pt-4 pb-3 space-y-2">
            {renderNavItems()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default withCart(Navbar);

