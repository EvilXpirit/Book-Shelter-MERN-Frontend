import React, { useState } from 'react';
import baseUrl from '../../Urls';

const CheckoutModal = ({ cart, totalPrice, setShowCheckout, user, clearCart }) => {
  const [address, setAddress] = useState('');

  const handleConfirmPurchase = async () => {
    if (!address) {
      alert('Please enter an address.');
      return;
    }

    const username = localStorage.getItem('username');
    try {
      // Fetch user ID based on username
      const userIdResponse = await fetch(`${baseUrl}/api/auth/userId?username=${username}`);
      if (!userIdResponse.ok) {
        throw new Error(`Failed to fetch user ID. Status: ${userIdResponse.status}`);
      }
      const { userId } = await userIdResponse.json();

      // Prepare purchase details for each item in cart
      const purchaseDetails = cart.map(item => ({
        userId,
        bookId: item.book._id,
        copies: item.quantity,
        address,
      }));

      // Send purchase requests to backend for each item
      const purchaseResponse = await fetch(`${baseUrl}/api/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchases: purchaseDetails }), // Ensure purchases is sent as an object with key 'purchases'
      });

      if (!purchaseResponse.ok) {
        throw new Error(`Failed to complete purchase. Status: ${purchaseResponse.status}`);
      }

      const { message } = await purchaseResponse.json();

      // Handle success message (optional)
      alert(`Order Successful!\n${message}`);

      // Clear cart and close checkout modal
      // clearCart();
      setShowCheckout(false);
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('There was an error processing your purchase. Please try again.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 mt-48 rounded-lg shadow-lg w-3/4 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div>
          <h3 className="text-lg font-bold">Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.book.bookName} (x{item.quantity})</span>
                <span>₹ {item.book.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <h3 className="text-lg font-bold">Total:</h3>
            <span>₹ {totalPrice}</span>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700">Address:</label>
          <textarea id="address" className="w-full p-2 border border-gray-300 rounded" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
        </div>
        <button onClick={handleConfirmPurchase} className="px-4 py-2 bg-green-500 text-white rounded">Confirm Purchase</button>
        <button onClick={() => setShowCheckout(false)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
