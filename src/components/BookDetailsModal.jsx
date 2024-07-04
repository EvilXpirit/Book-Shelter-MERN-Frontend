import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

const BookDetailsModal = ({ book, closeModal, addToWishlist, addToCart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-3xl">
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 float-right">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <div className="flex">
          <img
            src={book.imageUrl}
            alt={book.bookName}
            className="w-1/3 h-auto object-cover rounded"
          />
          <div className="ml-4 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{book.bookName}</h3>
              <p className="text-gray-600">{book.authorName}</p>
              <p className="text-gray-800 mt-1">{book.genre}</p>
              <p className="text-gray-600 mt-1">{book.publisherName}</p>
              {/* <p className="text-gray-600 mt-1">{new Date(book.publishingDate).toLocaleDateString()}</p> */}
              <p className="text-gray-600 mt-1">Copies Available: {book.copiesAvailable}</p>
              <p className="text-gray-600 mt-1">{book.description}</p>
              <p className="text-red-600 text-xl font-bold mt-1">₹ {book.price}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => addToWishlist(book)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                <FontAwesomeIcon icon={faHeart} /> Add to Wishlist
              </button>
              <button
                onClick={() => addToCart(book)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
