import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CheckoutModal from './CheckoutModal';
import baseUrl from '../../Urls';

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
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 mt-48 rounded-lg shadow-lg w-3/4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cart</h2>
          <button 
            onClick={() => setShowCart(false)} 
            className="text-red-500 text-xl"
          >
            ✖
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-4">
            Loading...
          </div>
        )}

        {!isLoading && cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img 
                    src={item.book.imageUrl} 
                    alt={item.book.bookName} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.book.bookName}</h3>
                    <p className="text-gray-600">{item.book.authorName}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecrement(item._id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-500 text-white rounded mr-2 disabled:opacity-50"
                      >
                        -
                      </button>
                      <p className="text-gray-800">Quantity: {item.quantity}</p>
                      <button
                        onClick={() => handleIncrement(item._id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-500 text-white rounded ml-2 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-800 mt-2">₹ {item.book.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={isLoading}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <h3 className="text-xl font-bold">Total: ₹ {totalPrice}</h3>
                <button 
                  onClick={clearCart}
                  disabled={isLoading || cart.length === 0}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                disabled={isLoading || cart.length === 0}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
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