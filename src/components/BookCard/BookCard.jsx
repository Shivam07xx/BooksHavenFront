import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { dispatch, cart, wishlist, isAuthenticated } = useApp();

  const isInCart = cart.some(item => item.id === book.id);
  const isInWishlist = wishlist.some(item => item.id === book.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: book 
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch({ 
        type: 'REMOVE_FROM_WISHLIST', 
        payload: book.id 
      });
    } else {
      dispatch({ 
        type: 'ADD_TO_WISHLIST', 
        payload: book 
      });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} fill="currentColor" className="star-filled" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} className="star-half" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} className="star-empty" />
      );
    }

    return stars;
  };

  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        <div className="book-image-container">
          <img 
            src={book.image} 
            alt={book.title}
            className="book-image"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
            }}
          />
          <div className="book-overlay">
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
              onClick={handleToggleWishlist}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        <div className="book-info">
          <div className="book-genre">{book.genre}</div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          
          <div className="book-rating">
            <div className="stars">
              {renderStars(book.rating)}
            </div>
            <span className="rating-value">({book.rating})</span>
          </div>

          <div className="book-footer">
            <div className="book-price">
              <span className="price">${book.price}</span>
            </div>
            
            <button 
              className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              <ShoppingCart size={16} />
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;