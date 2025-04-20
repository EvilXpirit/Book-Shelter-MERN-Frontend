import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import axios from 'axios';
import baseUrl from '../../Urls';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  });

  const containerRef = useRef(null);
  const navigate = useNavigate(); // Add this hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${baseUrl}/api/auth/register`, {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber,
      });
      
      // Clear the form
      setFormData({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
      });

      toast.success("User registered successfully! Please login to continue.");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500); // 1.5 second delay to show the success message

    } catch (error) {
      toast.error("Error registering user: " + error.response.data);
    }
  };

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(".form-field", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.out"
    });

    gsap.from(".signup-btn", {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: "back.out(1.7)"
    });
  }, { scope: containerRef });

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/50 via-black to-purple-900/50">
      <div
        ref={containerRef}
        className="max-w-2xl w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Explore the world of books
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
                Full Name
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Naruto Uzumaki"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                Username
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="username123"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-200">
                Mobile Number
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="signup-btn group relative w-full flex justify-center py-3 px-4 
                       border border-transparent rounded-lg text-sm font-medium text-white 
                       bg-blue-600 hover:bg-blue-700 
                       transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/50"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
