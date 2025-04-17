import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useCart from './useCart';
import CheckoutModal from './CheckoutModal';
import baseUrl from '../../Urls';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, setCart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => 
    total + item.book.price * item.quantity, 0);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view cart');
        navigate('/login');
        return false;
      }
      return true;
    };

    const fetchUserDetails = async () => {
      if (!checkAuth()) return;

      const username = localStorage.getItem('username');
      if (!username) return;

      try {
        const response = await fetch(`${baseUrl}/api/auth/username/${username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch user details');
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load user details');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleIncrement = async (itemId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}/increment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const updatedItem = await response.json();
      setCart(prevCart => 
        prevCart.map(item => 
          item._id === itemId 
            ? { ...item, quantity: updatedItem.quantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (itemId) => {
    setIsLoading(true);
    try {
      const cartItem = cart.find(item => item._id === itemId);
      if (!cartItem) return;

      if (cartItem.quantity <= 1) {
        await removeFromCart(itemId);
        return;
      }

      const response = await fetch(`${baseUrl}/api/cart/${itemId}/decrement`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const updatedItem = await response.json();
      if (response.status === 204) {
        // Item was removed
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
      } else {
        // Item quantity was decreased
        setCart(prevCart => 
          prevCart.map(item => 
            item._id === itemId 
              ? { ...item, quantity: updatedItem.quantity } 
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to proceed');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowCheckout(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="bg-white/90 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate('/bookspage')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img 
                    src={item.book.imageUrl} 
                    alt={item.book.bookName} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.book.bookName}</h3>
                    <p className="text-gray-600">{item.book.authorName}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item._id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold">₹{item.book.price * item.quantity}</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={isLoading}
                      className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold">₹{totalPrice}</span>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => navigate('/bookspage')}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading || cart.length === 0}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal 
          cart={cart} 
          totalPrice={totalPrice} 
          setShowCheckout={setShowCheckout} 
          user={user} 
          clearCart={() => setCart([])} 
        />
      )}
    </div>
  );
};

export default CartPage;