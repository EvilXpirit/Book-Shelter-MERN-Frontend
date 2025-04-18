import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const BookCard = ({ book, addToWishlist, addToCart, openModal }) => {
  return (
    <div className="relative bg-white/75 shadow-md rounded-lg p-2 overflow-hidden z-0 transition-all duration-200 ease-in-out hover:bg-white/90 transform hover:scale-105 hover:drop-shadow-2xl">
        <div className="absolute top-2 right-4 z-10">
        <button onClick={() => addToWishlist(book)} className="text-white focus:outline-none px-2 py-2 bg-blue-500/75 rounded-full hover:bg-red-500 hover:shadow-md">
          <FontAwesomeIcon icon={regularHeart} size="2x" />
        </button>
      </div>
      <div className=" p-2">
   <img src={book.imageUrl} alt={book.bookName} className="w-fit h-64 mx-auto object-cover transition-all duration-200 ease-in-out transform hover:translate-x-2 hover:-skew-y-6 hover:drop-shadow-2xl hover:brightness-125" />
      </div>
      {/* Content Container */}
      <div className="p-5">
        {/* Book Details */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
            {book.bookName}
          </h3>
          <p className="text-sm text-gray-600">{book.authorName}</p>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-full">
              {book.genre}
            </span>
            <p className="text-xl font-bold text-blue-600">
              ₹{book.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button 
            onClick={() => addToCart(book)} 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                     bg-blue-600 text-white rounded-lg transition-all duration-300
                     hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4" />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
          <button
            onClick={() => openModal(book)}
            className="p-2.5 text-gray-700 bg-gray-100 rounded-lg transition-all duration-300
                     hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="View details"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
