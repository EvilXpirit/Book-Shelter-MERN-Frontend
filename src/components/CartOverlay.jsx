import React, { useState, useEffect } from 'react';
import CheckoutModal from './CheckoutModal';
import baseUrl from '../../Urls';

const CartOverlay = ({ cart, setCart, setShowCart, removeFromCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const totalPrice = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);

  useEffect(() => {
    const getUsernameFromLocalStorage = () => {
      try {
        const username = localStorage.getItem('username');
        return username;
      } catch (error) {
        console.error("Username not found", error);
        return null;
      }
    };

    const fetchUserDetails = async (username) => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/users?username=${username}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      }
    };

    const username = getUsernameFromLocalStorage();
    if (username) {
      fetchUserDetails(username);
    }
  }, []); // Run once on component mount to fetch user data

  const handleIncrement = async (itemId) => {
    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}/increment`, {
        method: 'PUT',
      });
      const updatedCartItem = await response.json();
      const updatedCart = cart.map(item =>
        item._id === itemId ? { ...item, quantity: updatedCartItem.quantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrement = async (itemId) => {
    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}/decrement`, {
        method: 'PUT',
      });
      const updatedCartItem = await response.json();
      const updatedCart = cart.map(item =>
        item._id === itemId ? { ...item, quantity: updatedCartItem.quantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please log in to proceed with the purchase.');
      return;
    }
    setShowCheckout(true);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 mt-48 rounded-lg shadow-lg w-3/4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cart</h2>
          <button onClick={() => setShowCart(false)} className="text-red-500 text-xl">✖</button>
        </div>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img src={item.book.imageUrl} alt={item.book.bookName} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.book.bookName}</h3>
                    <p className="text-gray-600">{item.book.authorName}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecrement(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded mr-2"
                      >
                        -
                      </button>
                      <p className="text-gray-800">Quantity: {item.quantity}</p>
                      <button
                        onClick={() => handleIncrement(item._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded ml-2"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-800 mt-2">₹ {item.book.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-xl font-bold">Total:</h3>
              <p className="text-xl font-bold">₹ {totalPrice}</p>
            </div>
            <button onClick={handleBuyNow} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded ml-2">Buy Now</button>
          </div>
        )}
      </div>
      {showCheckout && <CheckoutModal cart={cart} totalPrice={totalPrice} setShowCheckout={setShowCheckout} user={user} clearCart={clearCart} />}
    </div>
  );
};

export default CartOverlay;
