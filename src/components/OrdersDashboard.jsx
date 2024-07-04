import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../Urls';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/purchase`); 
        setOrders(response.data);
        console.log('Fetched orders:', response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 mt-10 py-24">
      <h1 className="text-3xl text-white text-center font-bold mb-4">Orders</h1>
      <table className="min-w-full bg-white/75 border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Order Date</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Customer Email</th>
            <th className="border border-gray-300 px-4 py-2">Book Name</th>
            <th className="border border-gray-300 px-4 py-2">Copies Purchased</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order._id}>
              <td className="border border-gray-300 px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{order.customer.username}</td>
              <td className="border border-gray-300 px-4 py-2">{order.customerName}</td>
              <td className="border border-gray-300 px-4 py-2">{order.customerEmail}</td>
              <td className="border border-gray-300 px-4 py-2">{order.book.bookName}</td>
              <td className="border border-gray-300 px-4 py-2">{order.copiesPurchased}</td>
              <td className="border border-gray-300 px-4 py-2">{order.price}</td>
              <td className="border border-gray-300 px-4 py-2">{order.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-3 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersDashboard;
