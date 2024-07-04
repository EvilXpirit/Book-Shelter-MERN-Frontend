import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faBook, faTableColumns, faSignOutAlt, faTruckRampBox, faInbox, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/book logo.png';
import baseUrl from '../../Urls';

const AdminNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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

      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <nav className="bg-gradient-to-r from-sky-950 to-violet-900 p-4 fixed w-full top-0 left-0 z-50 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-auto h-12 mr-2" />
          </Link>
        </div>
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {showMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
      </nav>
      
      <div className={`fixed top-0 left-0 h-full bg-indigo-950 transition-transform transform ${showMenu ? 'translate-x-0' : '-translate-x-full'} w-80 p-5 z-40`}>
        <button onClick={toggleMenu} className="text-white mb-4 focus:outline-none">
          {showMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
        <ul className="space-y-6 mt-10 text-white text-base">
          <li><Link to="/admin/chartspage" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faChartPie} className='pr-2' />Statistics</Link></li>
          <li><Link to="/admin/dashboard" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faHome} className='pr-2' />Admin Dashboard</Link></li>
          <li><Link to="/admin/bookform" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faBook} className='pr-2' />Add Books</Link></li>
          <li><Link to="/admin/booksdashboard" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faTableColumns} className='pr-2' />Books Dashboard</Link></li>
          <li><Link to="/admin/ordersdashboard" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faTruckRampBox} className='pr-2' />Orders</Link></li>
          <li><Link to="/admin/contactsinfo" className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faInbox} className='pr-2' />Inquiries</Link></li>
          <li><button onClick={handleLogout} className="hover:text-yellow-400 flex items-center"><FontAwesomeIcon icon={faSignOutAlt} className='pr-2' />Sign Out</button></li>
        </ul>
      </div>
      
      {showMenu && <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={toggleMenu}></div>}
    </div>
  );
};

export default AdminNavbar;
