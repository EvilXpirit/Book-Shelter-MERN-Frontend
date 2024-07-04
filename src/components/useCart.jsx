// useCart.js
import { useState, useEffect } from "react";
import baseUrl from '../../Urls';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/cart`);
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (book) => {
    try {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id, quantity: 1 }),
      });
      const data = await response.json();
      setCart([...cart, data]);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: "DELETE",
      });
      setCart(cart.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return { cart, showCart, setShowCart, addToCart, removeFromCart };
};

export default useCart;
