import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLock, faUser, faGlobe, faCookie } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/book logo.png';


const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white p-4 lg:p-8">
      <div className="container mx-auto text-center">
       
        <div className="mt-4 flex flex-col lg:flex-row justify-between items-center">
        <div>
            <img src={logo} alt="Logo" className="w-auto h-10" /> 
          </div>
          <div className="lg:mr-8 mb-4 lg:mb-0 text-left flex flex-col gap-2">
            <p>Contact Us:</p>
            <p>Email: info@bookshelter.com</p>
            <p>Phone: +1234567890</p>
          </div>
          <div className='text-3xl'>
            <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
          <div className='flex flex-col text-left gap-2'>
          <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faLock} /> Terms of Use</a>
            <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faUser} /> Privacy Statement</a>
            <a href="#" className="text-white hover:underline mr-4"><FontAwesomeIcon icon={faGlobe} /> Accessibility</a>
            <a href="#" className="text-white hover:underline"><FontAwesomeIcon icon={faCookie} /> Cookies</a>
          </div>
        </div>
      </div>
        <p className='mx-auto text-center mt-5'>&copy; 2024 Book Shelter. By Aditya Sharma.</p>
    </footer>
  );
};

export default Footer;
