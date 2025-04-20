// src/components/Login.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MyLottieAnimation from "./MyLottieAnimation";
import baseUrl from "../../Urls";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

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
      localStorage.setItem("username", formData.username);
      localStorage.setItem("token", token);
      setAlert({ message: "Logged in successfully", type: "success" });
      console.log(formData.username, "has logged in");
      console.log("Login successful", response.data);

      if (redirect) {
        navigate(redirect); // Redirect based on the response
      }
    } catch (error) {
      setAlert({
        message: `Error logging in: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
      console.error("Error logging in", error.response || error.message);
    }
  };

  // GSAP Animations
  useGSAP(
    () => {
      // Page container animation
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Form container animation
      gsap.from(".form-container", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Lottie animation container
      gsap.from(".lottie-wrapper", {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      });

      // Form inputs animation
      gsap.from(".form-field", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.5,
        ease: "power2.out",
      });

      // Button animation
      gsap.from(".login-btn-animate", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 0.8,
        ease: "back.out(1.7)",
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/50 via-black to-purple-900/50">
      <div
        ref={containerRef}
        className="max-w-4xl w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Lottie Animation Section */}
          <div className="lottie-wrapper w-full lg:w-1/2 flex justify-center">
            <MyLottieAnimation />
          </div>

          {/* Form Section */}
          <div className="form-container w-full lg:w-1/2 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
              <p className="mt-2 text-gray-300">
                Please sign in to your account
              </p>
            </div>

            {alert.message && (
              <div
                className={`p-4 rounded-lg text-white ${
                  alert.type === "success" ? "bg-green-500/80" : "bg-red-500/80"
                }`}
              >
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="form-field">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-gray-500 rounded-lg 
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-field">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-gray-500 rounded-lg 
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="login-btn-animate w-full flex justify-center py-3 px-4 
           border border-transparent rounded-lg text-sm font-medium 
           text-white bg-blue-600 hover:bg-blue-700 
           hover:scale-[1.02] shadow-lg hover:shadow-blue-500/50"
              >
                Sign in
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
