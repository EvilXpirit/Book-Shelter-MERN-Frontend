// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyLottieAnimation from './MyLottieAnimation';
import baseUrl from '../../Urls';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        username: formData.username,
        password: formData.password,
      });
      const { token, redirect } = response.data;
      localStorage.setItem('username', formData.username);
      localStorage.setItem('token', token);
      setAlert({ message: 'Logged in successfully', type: 'success' });
      console.log(formData.username, 'has logged in')
      console.log('Login successful', response.data);

      if (redirect) {
        navigate(redirect); // Redirect based on the response
      }
    } catch (error) {
      setAlert({ message: `Error logging in: ${error.response?.data?.message || error.message}`, type: 'error' });
      console.error('Error logging in', error.response || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-28 bg-black/30">
      <div className="flex flex-col lg:flex-row bg-white/80 p-8 rounded-lg shadow-md w-full max-w-4xl hover:bg-white/95 transition-all ease-in-out duration-200">
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <MyLottieAnimation />
        </div>
        <div className="w-full lg:w-1/2 p-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          {alert.message && (
            <div className={`mb-4 p-4 rounded-md text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='mt-10'>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
