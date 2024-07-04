import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '../../Urls';

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    bookName: '',
    authorName: '',
    publisherName: '',
    publishingDate: '',
    copiesAvailable: '',
    imageUrl: '' // Adding image URL field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/books`, formData);
      alert('Book added successfully');
      setFormData({
        bookName: '',
        authorName: '',
        publisherName: '',
        publishingDate: '',
        copiesAvailable: '',
        imageUrl: '' // Resetting image URL field
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 py-24">
      <h1 className="text-3xl text-white text-center font-bold mb-4">Books Form</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white/75 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookName">Book Name</label>
          <input
            type="text"
            name="bookName"
            id="bookName"
            placeholder="Book Name"
            value={formData.bookName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorName">Author Name</label>
          <input
            type="text"
            name="authorName"
            id="authorName"
            placeholder="Author Name"
            value={formData.authorName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisherName">Publisher Name</label>
          <input
            type="text"
            name="publisherName"
            id="publisherName"
            placeholder="Publisher Name"
            value={formData.publisherName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publishingDate">Publishing Date</label>
          <input
            type="date"
            name="publishingDate"
            id="publishingDate"
            value={formData.publishingDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="copiesAvailable">Copies Available</label>
          <input
            type="number"
            name="copiesAvailable"
            id="copiesAvailable"
            placeholder="Copies Available"
            value={formData.copiesAvailable}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">Book Image URL</label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">Genre</label>
          <input
            type="text"
            name="genre"
            id="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
