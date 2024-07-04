import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditBookModal from './EditBookModal';
import baseUrl from '../../Urls';

const BooksDashboard = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBook, setEditingBook] = useState(null);
  const booksPerPage = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/books`);
        const sortedBooks = response.data.sort((a, b) => a.authorName.localeCompare(b.authorName));
        setBooks(sortedBooks);
        console.log('Fetched books:', response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
      console.log('Deleted book with id:', id);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleSave = (id, updatedBook) => {
    setBooks(books.map(book => (book._id === id ? updatedBook : book)));
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(books.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 mt-10 py-24">
      <h1 className="text-3xl text-white text-center font-bold mb-4">Books</h1>
      <table className="min-w-full bg-white/75 border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Author Name</th>
            <th className="border border-gray-300 px-4 py-2">Book Name</th>
            <th className="border border-gray-300 px-4 py-2">Publisher Name</th>
            <th className="border border-gray-300 px-4 py-2">Publishing Date</th>
            <th className="border border-gray-300 px-4 py-2">Copies Available</th>
            <th className="border border-gray-300 px-4 py-2">Genre</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Book Image</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book, index) => {
            const isFirstBookOfAuthor = index === 0 || currentBooks[index - 1].authorName !== book.authorName;
            return (
              <tr key={book._id}>
                {isFirstBookOfAuthor && (
                  <td className="border border-gray-300 px-4 py-2" rowSpan={currentBooks.filter(b => b.authorName === book.authorName).length}>
                    {book.authorName}
                  </td>
                )}
                <td className="border border-gray-300 px-4 py-2">{book.bookName}</td>
                <td className="border border-gray-300 px-4 py-2">{book.publisherName}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(book.publishingDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{book.copiesAvailable}</td>
                <td className="border border-gray-300 px-4 py-2">{book.genre}</td>
                <td className="border border-gray-300 px-4 py-2">{book.price}</td>
                <td className="border border-gray-300 px-4 py-2">{book.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {book.imageUrl && (
                    <img src={book.imageUrl} alt={book.bookName} className="h-16 w-auto mx-auto" />
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleEdit(book)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-3 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {number}
          </button>
        ))}
      </div>
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BooksDashboard;
