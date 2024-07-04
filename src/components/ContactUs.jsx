import React, { useState } from "react";
import axios from "axios";
import baseUrl from '../../Urls';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/contact`, formData);
      console.log("Form submitted with data:", formData);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      alert('Contact details sent successfully!');
    } catch (error) {
      console.error('Error Submitting Contact Form:', error);
      alert('There was an error submitting your contact form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="enquiry-form p-5 mx-auto w-2/3 mt-10 bg-gray-100/80 rounded-lg shadow-lg">
      <h4 className="text-gray-700 text-xl mb-4">Need to get in touch with us?</h4>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-white/80 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-white rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="text-gray-700">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="bg-white rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
