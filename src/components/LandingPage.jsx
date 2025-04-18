import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import CarouselBooks from './Carousel';
import BookDetailsModal from "./BookDetailsModal"; 
import ContactForm from './ContactUs';
import TestimonialSlider from './TestimonialSlider';
import NewArrivalsSwiper from './NewArrivalsSwiper'; 
import withCart from "./withCart";
import baseUrl from '../../Urls';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const [booksByAuthor, setBooksByAuthor] = useState([]);
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/books`);
        const data = await response.json();
        // Group books by author name
        const booksGroupedByAuthor = groupBooksByAuthor(data);
        setBooksByAuthor(booksGroupedByAuthor);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);
  

  const addToWishlist = async (book) => {
    if (!isAuthenticated()) {
      toast("Please log in to add items to your wishlist");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/wishlist`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId: book._id }),
      });
      
      if (!response.ok) throw new Error('Failed to add to wishlist');
      
      const data = await response.json();
      setWishlist([...wishlist, data]);
      toast.sucess("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const addToCart = async (book) => {
    if (!isAuthenticated()) {
      toast("Please log in to add items to your cart");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId: book._id, quantity: 1 }),
      });
      
      if (!response.ok) throw new Error('Failed to add to cart');
      
      const data = await response.json();
      setCart([...cart, data]);
      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const groupBooksByAuthor = (books) => {
    const groupedBooks = {};
    books.forEach((book) => {
      if (!groupedBooks[book.authorName]) {
        groupedBooks[book.authorName] = [];
      }
      groupedBooks[book.authorName].push(book);
    });
    return groupedBooks;
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };


  return (
    <div id="home" className="container mx-auto pt-28 p-2 bg-black/50">
       <CarouselBooks />
       <div className="container mx-auto mt-14">
       <h1 id="new-arrivals" className="text-4xl font-bold text-center text-white pb-4 drop-shadow-lg">
          New Arrivals
        </h1>
        <NewArrivalsSwiper openModal={openModal}/> 
      </div>
      <div className="books p-5 pt-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
          Popular Authors
        </h1>
        {Object.keys(booksByAuthor).map((authorName) => (
          <div key={authorName}>
            <h2 className="text-2xl text-center pt-4 pb-4 font-semibold text-white mb-4">
              {authorName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {booksByAuthor[authorName].map((book) => (
                <BookCard key={book._id} book={book} addToWishlist={addToWishlist} addToCart={addToCart} openModal={openModal} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <section className="mt-10">
      <h1 className="text-4xl font-bold text-center text-white mb-10 drop-shadow-lg">
        Testimonials
      </h1>
      <TestimonialSlider />
      </section>

      <div className="enquiry p-5 pt-14">
      <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
        Send us your feedback
      </h1>
      <ContactForm />
      </div>
      {selectedBook && <BookDetailsModal book={selectedBook} closeModal={closeModal} addToWishlist={addToWishlist} addToCart={addToCart} />}
    </div>
  );
};

export default withCart(LandingPage);
