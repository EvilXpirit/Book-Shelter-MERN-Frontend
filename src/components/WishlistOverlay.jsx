import React from "react";

const WishlistOverlay = ({ wishlist, removeFromWishlist, setShowWishlist }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wishlist</h2>
          <button
            onClick={() => setShowWishlist(false)}
            className="text-red-500 text-xl"
          >
            ✖
          </button>
        </div>
        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={item.book.imageUrl}
                  alt={item.book.bookName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{item.book.bookName}</h3>
                  <p className="text-gray-600">{item.book.authorName}</p>
                  <p className="text-gray-800 mt-2">₹ {item.book.price}</p>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistOverlay;
