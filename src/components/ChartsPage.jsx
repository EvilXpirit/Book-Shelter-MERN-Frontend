// ChartsPage.jsx
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartsPage = () => {
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch book data
        const bookResponse = await axios.get('http://localhost:3000/api/books'); 
        const books = bookResponse.data;
        console.log('Books:', books);

        // Fetch order data
        const orderResponse = await axios.get('http://localhost:3000/api/purchase'); 
        const orders = orderResponse.data;
        console.log('Orders:', orders);

        // Prepare line chart data
        const bookSalesData = books.map(book => {
          const totalSales = orders
            .filter(order => order.book._id === book._id)
            .reduce((sum, order) => sum + order.copiesPurchased, 0);
          return { bookName: book.bookName, totalSales, copiesAvailable: book.copiesAvailable };
        });

        console.log('Book Sales Data:', bookSalesData);

        setLineChartData({
          labels: bookSalesData.map(data => data.bookName),
          datasets: [
            {
              label: 'Total Sales',
              data: bookSalesData.map(data => data.totalSales),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
              label: 'Copies Available',
              data: bookSalesData.map(data => data.copiesAvailable),
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
            }
          ]
        });

        // Prepare pie chart data
        const genres = books.reduce((acc, book) => {
          acc[book.genre] = (acc[book.genre] || 0) + 1;
          return acc;
        }, {});

        setPieChartData({
          labels: Object.keys(genres),
          datasets: [
            {
              label: '# of Books',
              data: Object.values(genres),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-gray-800/25">
      <h2 className="text-center text-3xl text-white font-bold mb-8">Book Statistics</h2>
      <div className="flex justify-center space-x-10 mx-8">
        {lineChartData && (
          <div className="bg-white/80 p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Total Sales</h3>
            <Line data={lineChartData} />
          </div>
        )}
        {pieChartData && (
          <div className="bg-white/80 p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Book Genres</h3>
            <div className="relative h-80 w-80 mx-auto">
              <Pie data={pieChartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsPage;
