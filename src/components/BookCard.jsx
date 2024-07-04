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
      <div className="flex-grow p-1">
        <h3 className="text-xl font-semibold mb-2">{book.bookName}</h3>
        <p className="text-gray-600">{book.authorName}</p>
        <p className="text-gray-600">{book.genre}</p>
        <p className="text-orange-600 text-xl font-bold mt-1">₹ {book.price}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
      <button onClick={() => addToCart(book)} className="px-2 py-2 bg-green-500 text-white rounded hover:shadow-lg">Add to Cart  <FontAwesomeIcon icon={faCartShopping} size="lg" /></button>
        <button
          onClick={() => openModal(book)}
          className="bg-yellow-500 text-white text-lg px-2 py-1 rounded-lg hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      </div>
    </div>
  );
};

export default BookCard;
