import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Pagination } from 'swiper/modules';
import baseUrl from '../../Urls';

const NewArrivalsSwiper = ({ book, openModal }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/books/new-arrivals`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="w-full p-4 overflow-visible">
      <Swiper
        className=""
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 40 },
          1024: { slidesPerView: 4, spaceBetween: 50 },
        }}
        autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
      >
        {books.map((book) => (
          <SwiperSlide key={book._id}>
            <div className="bg-white/75 rounded-lg shadow-lg h-96 overflow-hidden mb-10 transition-all duration-200 ease-in-out hover:bg-white/90 transform hover:drop-shadow-2xl">
              <div className="">
                <img
                  src={book.imageUrl}
                  alt={book.bookName}
                  className="w-full h-48 object-cover object-top transition-all duration-200 ease-in-out transform hover:h-full hover:scale-105"
                />
              </div>
              <div className="flex-grow mt-4 ms-4 space-y-2 mb-4">
                <h3 className="text-lg font-bold">{book.bookName}</h3>
                <p className="text-gray-600">{book.authorName}</p>
                <p className="text-gray-800">₹ {book.price}</p>
              </div>
              <button
                onClick={() => openModal(book)}
                className="mx-2 px-2 py-2 bg-yellow-500 text-white rounded hover:shadow-lg"
              >
                <FontAwesomeIcon icon={faEye} size="lg" />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewArrivalsSwiper;
