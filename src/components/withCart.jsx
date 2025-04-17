import React, { useEffect } from "react";
import useCart from "./useCart";
import CartOverlay from "./CartOverlay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import baseUrl from '../../Urls';

const withCart = (WrappedComponent) => {
  return (props) => {
    const { 
      cart, 
      setCart,
      showCart, 
      setShowCart, 
      addToCart, 
      removeFromCart 
    } = useCart();

    useEffect(() => {
      const fetchUserCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setCart([]);
          return;
        }

        try {
          const response = await fetch(`${baseUrl}/api/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setCart(data);
          } else {
            console.error('Failed to fetch cart');
            setCart([]);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart([]);
        }
      };

      fetchUserCart();
    }, [setCart]);

    const handleAddToCart = async (book) => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }
      await addToCart(book);
    };

    const handleRemoveFromCart = async (itemId) => {
      const token = localStorage.getItem('token');
      if (!token) return;
      await removeFromCart(itemId);
    };

    return (
      <>
        <WrappedComponent
          {...props}
          cart={cart}
          addToCart={handleAddToCart}
        />
        {showCart && (
          <CartOverlay 
            cart={cart} 
            setShowCart={setShowCart} 
            removeFromCart={handleRemoveFromCart} 
          />
        )}
      </>
    );
  };
};

export default withCart;