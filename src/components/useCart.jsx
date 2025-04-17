import { useState, useEffect } from "react";
import baseUrl from '../../Urls';
import { toast } from 'react-toastify';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  const updateCartItem = (itemId, updatedItem) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === itemId ? updatedItem : item
      )
    );
  };

  const removeCartItem = (itemId) => {
    setCart(prevCart => 
      prevCart.filter(item => item._id !== itemId)
    );
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/cart`, {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart items");
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (book) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId: book._id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      setCart(prevCart => [...prevCart, data]);
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to remove items from cart");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      setCart(prevCart => prevCart.filter(item => item._id !== itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return { 
    cart, 
    setCart, 
    showCart, 
    setShowCart, 
    addToCart, 
    removeFromCart,
    clearCart,
    isLoading ,
    updateCartItem,
    removeCartItem
  };
};

export default useCart;