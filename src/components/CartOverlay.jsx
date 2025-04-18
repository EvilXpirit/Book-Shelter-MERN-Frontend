import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CheckoutModal from './CheckoutModal';
import baseUrl from '../../Urls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const CartOverlay = ({ cart, setCart, setShowCart, removeFromCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPrice = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (!token || !username) {
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/auth/username/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user details');
      }
    };

    fetchUserDetails();
  }, []);

  const handleIncrement = async (itemId) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}/increment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to increment quantity');
      }
  
      const updatedItem = await response.json();
      
      // Update cart state with the new item
      setCart(prevCart => 
        prevCart.map(item => 
          item._id === itemId ? updatedItem : item
        )
      );
      
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDecrement = async (itemId) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}/decrement`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to decrement quantity');
      }
  
      const result = await response.json();
      
      if (result.deleted) {
        // Remove item from cart if quantity reached 0
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
      } else {
        // Update cart with new quantity
        setCart(prevCart => 
          prevCart.map(item => 
            item._id === itemId ? result : item
          )
        );
      }
      
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please log in to proceed with the purchase');
      return;
    }
    
    if (!user) {
      toast.error('Unable to load user details. Please try again');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowCheckout(true);
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseUrl}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCart([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start z-[60] overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 my-20 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <p className="text-sm text-gray-500 mt-1">{cart.length} items in your cart</p>
          </div>
          <button 
            onClick={() => setShowCart(false)} 
            className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty Cart State */}
        {!isLoading && cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img 
              src="/empty-cart.svg" 
              alt="Empty Cart" 
              className="w-48 h-48 mb-6 opacity-50"
            />
            <p className="text-xl text-gray-600 mb-2">Your cart is empty</p>
            <p className="text-gray-400 mb-6">Add some books to start shopping!</p>
            <button 
              onClick={() => setShowCart(false)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Cart Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cart.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden group">
                    <img 
                      src={item.book.imageUrl} 
                      alt={item.book.bookName} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.book.bookName}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.book.authorName}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          disabled={isLoading}
                          className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                        </button>
                        <span className="text-gray-800 font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item._id)}
                          disabled={isLoading}
                          className="p-2 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-500 transition-colors disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-gray-800">₹{(item.book.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-start">
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="text-3xl font-bold text-gray-800">₹{totalPrice.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={clearCart}
                    disabled={isLoading || cart.length === 0}
                    className="px-6 py-3 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={isLoading || cart.length === 0}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal 
          cart={cart} 
          totalPrice={totalPrice} 
          setShowCheckout={setShowCheckout} 
          user={user} 
          clearCart={clearCart} 
        />
      )}
    </div>
  );
};

export default CartOverlay;