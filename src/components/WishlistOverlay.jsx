import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const WishlistOverlay = ({ wishlist, removeFromWishlist, setShowWishlist }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mt-20 mb-8 transform transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
          <button
            onClick={() => setShowWishlist(false)}
            className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Your wishlist is empty</p>
              <p className="text-gray-400 mt-2">Start adding some books!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.bookName}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {item.book.bookName}
                    </h3>
                    <p className="text-gray-600 mt-1">{item.book.authorName}</p>
                    <p className="text-gray-800 font-bold mt-2">
                      ₹{item.book.price.toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="mt-3 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Remove from Wishlist</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistOverlay;