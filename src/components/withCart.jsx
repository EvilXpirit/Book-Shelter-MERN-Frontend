import React from "react";
import useCart from "./useCart";
import CartOverlay from "./CartOverlay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const withCart = (WrappedComponent) => {
  return (props) => {
    const { cart, showCart, setShowCart, addToCart, removeFromCart } = useCart();

    return (
      <>
        <WrappedComponent
          {...props}
          cart={cart}
          addToCart={addToCart}
        />
        {showCart && (
          <CartOverlay cart={cart} setShowCart={setShowCart} removeFromCart={removeFromCart} />
        )}
        {/* <button onClick={() => setShowCart(!showCart)} className="fixed top-28 right-4 bg-green-600 text-white px-2 py-2 rounded-lg">
          <FontAwesomeIcon icon={faCartShopping} size="lg" /> <span className="text-sm">{cart.length} </span>
        </button> */}
      </>
    );
  };
};

export default withCart;
