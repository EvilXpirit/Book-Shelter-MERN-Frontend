import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import BookCard from "./BookCard";
import WishlistOverlay from "./WishlistOverlay";
import CartOverlay from "./CartOverlay";
import BookDetailsModal from "./BookDetailsModal"; 
import baseUrl from '../../Urls';
// import CheckoutModal from './CheckoutModal';
// import axios from 'axios';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("genre");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [selectedBook, setSelectedBook] = useState(null); 
  const [user, setUser] = useState(null); 
  
// const getUsernameFromLocalStorage = () => {
//       try{
//         const username = localStorage.getItem('username');
//         console.log(username);
//       } catch (error) {
//         console.error("username not found", error);
//       }
//   };
//   getUsernameFromLocalStorage();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

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

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/wishlist`);
        const data = await response.json();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterBooks = (books, searchTerm) => {
    return books.filter(
      (book) =>
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const groupBooksByCategory = (books, category) => {
    if (category === "all") {
      return { All: books };
    }

    return books.reduce((acc, book) => {
      const key = book[category];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(book);
      return acc;
    }, {});
  };

  const filteredBooks = filterBooks(books, searchTerm);
  const groupedBooks = groupBooksByCategory(filteredBooks, category);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = Object.values(groupedBooks).flat().slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(Object.values(groupedBooks).flat().length / booksPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addToWishlist = async (book) => {
    try {
      const response = await fetch(`${baseUrl}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id }),
      });
      const data = await response.json();
      setWishlist([...wishlist, data]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await fetch(`${baseUrl}/api/wishlist/${itemId}`, {
        method: "DELETE",
      });
      setWishlist(wishlist.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

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



  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container mx-auto pt-32 p-2 bg-black/50">
      <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
        Book Store
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-center flex-1">
          <label htmlFor="search" className="mr-2 text-white">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="p-2 w-3/5 border border-gray-300 rounded bg-white/80 transition-all duration-200 ease-in-out hover:bg-white/90"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center flex-1 justify-end">
          <label htmlFor="category" className="mr-2 text-white">
            Filter by:
          </label>
          <select
            id="category"
            className="p-2 border border-gray-300 rounded bg-white/80"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            <option value="genre">Genre</option>
            <option value="authorName">Author Name</option>
          </select>
        </div>
      </div>
      <div className="books p-5 pt-14">
        {Object.keys(groupedBooks).map((key) => (
          <div key={key}>
            <h2 className="text-2xl text-center pt-4 pb-4 font-semibold text-white mb-4">
              {key}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedBooks[key].map((book) => (
                <BookCard key={book._id} book={book} addToWishlist={addToWishlist} addToCart={addToCart} openModal={openModal} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            onClick={() => handleClick(number)}
            className={`mx-1 px-3 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {number}
          </button>
        ))}
      </div>
      {showWishlist && <WishlistOverlay wishlist={wishlist} removeFromWishlist={removeFromWishlist} setShowWishlist={setShowWishlist} />}
      {showCart && <CartOverlay cart={cart} setShowCart={setShowCart} removeFromCart={removeFromCart} user={user} />}
      {selectedBook && <BookDetailsModal book={selectedBook} closeModal={closeModal} addToWishlist={addToWishlist} addToCart={addToCart} />}
      <button onClick={() => setShowCart(!showCart)} className="fixed top-28 right-4 bg-green-600 text-white px-2 py-2 rounded-lg">
        <FontAwesomeIcon icon={faCartShopping} size="lg" />  <span className="text-sm">{cart.length} </span>
      </button>
      <button onClick={() => setShowWishlist(!showWishlist)} className="fixed top-28 right-20 bg-blue-700 text-white px-2 py-2 rounded-lg">
        <FontAwesomeIcon icon={faHeart} size="lg" /> <span className="text-sm">{wishlist.length} </span>
      </button>
    </div>
  );
};

export default BooksPage;
