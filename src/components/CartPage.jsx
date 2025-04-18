import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useCart from './useCart';
import CheckoutModal from './CheckoutModal';
import baseUrl from '../../Urls';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faArrowLeft, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const CartPage = () => {
  const { cart, setCart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const totalPrice = cart.reduce((total, item) => 
    total + item.book.price * item.quantity, 0);

    // Add GSAP animations
    useGSAP(() => {
      gsap.from('.cart-header', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
  
      gsap.from('.cart-items', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        stagger: 0.1,
        ease: 'power3.out'
      });
  
      gsap.from('.cart-summary', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
      });
    });

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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/75 to-gray-100 pt-36 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="cart-header mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{cart.length} items in your cart</p>
          </div>
          <button
            onClick={() => navigate('/bookspage')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
              <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
              <p className="text-gray-600 max-w-md">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={() => navigate('/bookspage')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 duration-200 shadow-md"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div 
                    key={item._id} 
                    className="cart-items bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48">
                        <img 
                          src={item.book.imageUrl} 
                          alt={item.book.bookName} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{item.book.bookName}</h3>
                            <p className="text-gray-600 mt-1">{item.book.authorName}</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{(item.book.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleDecrement(item._id)}
                              disabled={isLoading}
                              className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors"
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrement(item._id)}
                              disabled={isLoading}
                              className="p-2 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-500 transition-colors"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="cart-summary bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={isLoading || cart.length === 0}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 duration-200 disabled:opacity-50 disabled:hover:scale-100 mt-6"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
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
          clearCart={() => setCart([])} 
        />
      )}
    </div>
  );
};

export default CartPage;