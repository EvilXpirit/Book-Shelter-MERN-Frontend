import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import BookCard from "./BookCard";
import WishlistOverlay from "./WishlistOverlay";
import CartOverlay from "./CartOverlay";
import BookDetailsModal from "./BookDetailsModal"; 
import baseUrl from '../../Urls';
import { toast } from 'react-toastify';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



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

  useGSAP(() => {
    // Header animation
    gsap.from(".page-title", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Search and filter controls animation
    gsap.from(".controls-container", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.out"
    });

    // Book cards stagger animation
    gsap.from(".book-card", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)",
      // scrollTrigger: {
      //   trigger: ".books",
      //   start: "top center",
      //   toggleActions: "play none none reverse"
      // }
    });

    // Category headers animation
    gsap.from(".category-header", {
      x: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".books",
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated()) return;
      
      try {
        const response = await fetch(`${baseUrl}/api/cart`, {
          headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
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
      if (!isAuthenticated()) return;

      try {
        const response = await fetch(`${baseUrl}/api/wishlist`, {
          headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
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
      toast.success("Added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!isAuthenticated()) return;

    try {
      const response = await fetch(`${baseUrl}/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      
      setWishlist(wishlist.filter((item) => item._id !== itemId));
      toast("Removed from wishlist");
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      toast.error("Failed to remove from wishlist");
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
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) return;

    try {
      const response = await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to remove from cart');
      
      setCart(cart.filter((item) => item._id !== itemId));
      toast("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/75 via-blue-900/75 to-gray-900/65">
      <div className="container mx-auto pt-36 px-4 sm:px-6 lg:px-8">
        <h1 className="page-title text-5xl text-center text-white mb-12 tracking-wider">
          Discover Your Next Adventure
        </h1>

        <div className="controls-container backdrop-blur-md bg-white/10 rounded-xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search Section */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Search books or authors..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  🔍
                </span>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex-1 w-full md:w-auto">
              <select
                id="category"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                value={category}
                onChange={handleCategoryChange}
              >
                <option className="text-black" value="all">All Categories</option>
                <option className="text-black" value="genre">By Genre</option>
                <option className="text-black" value="authorName">By Author</option>
              </select>
            </div>
          </div>
        </div>

        <div className="books space-y-12">
          {Object.keys(groupedBooks).map((key) => (
            <div key={key} className="category-section">
              <h2 className="category-header text-3xl text-white mb-8 pl-4 border-l-4 border-blue-500">
                {key}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {groupedBooks[key].map((book) => (
                  <div key={book._id} className="book-card">
                    <BookCard
                      book={book}
                      addToWishlist={addToWishlist}
                      addToCart={addToCart}
                      openModal={openModal}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 pb-8">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              onClick={() => handleClick(number)}
              className={`mx-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === number
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faCartShopping} size="lg" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {cart.length}
            </span>
          </button>
          <button
            onClick={() => setShowWishlist(!showWishlist)}
            className="bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faHeart} size="lg" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {wishlist.length}
            </span>
          </button>
        </div>

        {/* Modals */}
        {showWishlist && <WishlistOverlay wishlist={wishlist} removeFromWishlist={removeFromWishlist} setShowWishlist={setShowWishlist} />}
        {showCart && <CartOverlay cart={cart} setShowCart={setShowCart} removeFromCart={removeFromCart} user={user} />}
        {selectedBook && <BookDetailsModal book={selectedBook} closeModal={closeModal} addToWishlist={addToWishlist} addToCart={addToCart} />}
      </div>
    </div>
  );
};

export default BooksPage;
