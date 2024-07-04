import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '../../Urls';

const EditBookModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bookName: book.bookName,
    authorName: book.authorName,
    publisherName: book.publisherName,
    publishingDate: book.publishingDate,
    copiesAvailable: book.copiesAvailable,
    genre: book.genre,
    price: book.price,
    description: book.description,
    imageUrl: book.imageUrl,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseUrl}/api/books/${book._id}`, formData);
      onSave(book._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white w-5/6 p-4 pt-28 rounded overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Edit Book</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="bookName">Book Name</label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="authorName">Author Name</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="publisherName">Publisher Name</label>
            <input
              type="text"
              id="publisherName"
              name="publisherName"
              value={formData.publisherName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="publishingDate">Publishing Date</label>
            <input
              type="date"
              id="publishingDate"
              name="publishingDate"
              value={formData.publishingDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="copiesAvailable">Copies Available</label>
            <input
              type="number"
              id="copiesAvailable"
              name="copiesAvailable"
              value={formData.copiesAvailable}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="imageUrl">Book Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
        </form>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
