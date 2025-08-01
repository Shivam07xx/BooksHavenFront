import { AlertCircle, ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, cart, wishlist, isAuthenticated, loading } = useApp();
  
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [error, setError] = useState(null);

  const isInCart = cart.some(item => item.id === id);
  const isInWishlist = wishlist.some(item => item.id === id);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setBookLoading(true);
        const response = await fetch(`/api/books/${id}`);
        
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else {
          setError('Book not found');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book details');
      } finally {
        setBookLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: book 
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please login to purchase');
      return;
    }

    if (!isInCart) {
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: book 
      });
    }
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
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

  const renderStars = (rating, size = 20) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={size} fill="currentColor" className="star-large" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={size} className="star-large" style={{ opacity: 0.5 }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={size} className="star-large" style={{ opacity: 0.3 }} />
      );
    }

    return stars;
  };

  if (bookLoading) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="error-container">
            <AlertCircle size={64} className="error-icon" />
            <h2 className="error-title">Book Not Found</h2>
            <p className="error-message">
              {error || 'The book you are looking for does not exist.'}
            </p>
            <button 
              onClick={() => navigate('/books')} 
              className="btn btn-primary"
            >
              <ArrowLeft size={16} />
              Back to Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="book-detail-container">
          <div className="book-image-section">
            <img 
              src={book.image} 
              alt={book.title}
              className="book-detail-image"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
              }}
            />
          </div>

          <div className="book-info-section">
            <span className="book-genre-badge">{book.genre}</span>
            
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>

            <div className="book-rating-section">
              <div className="rating-display">
                <div className="stars-large">
                  {renderStars(book.rating, 24)}
                </div>
                <span className="rating-text">{book.rating}</span>
              </div>
              <span className="reviews-count">
                ({book.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="book-price-section">
              <span className="book-detail-price">₹{book.price}</span>
              <span className="stock-info">
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="book-actions">
              <button 
                className="action-btn buy-now-btn"
                onClick={handleBuyNow}
                disabled={book.stock === 0}
              >
                <ShoppingCart size={20} />
                Buy Now
              </button>
              
              <button 
                className={`action-btn add-cart-btn ${isInCart ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart || book.stock === 0}
              >
                <ShoppingCart size={20} />
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
              
              <button 
                className={`action-btn wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
              >
                <Heart size={20} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        <div className="book-details-section">
          <h2 className="section-title">About This Book</h2>
          <p className="book-description">{book.description}</p>
          
          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">ISBN</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Published</span>
              <span className="meta-value">
                {new Date(book.publishedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Pages</span>
              <span className="meta-value">{book.pageCount}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Genre</span>
              <span className="meta-value">{book.genre}</span>
            </div>
          </div>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div className="reviews-section">
            <h2 className="section-title">Customer Reviews</h2>
            <div className="reviews-list">
              {book.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <div className="review-rating">
                      {renderStars(review.rating, 16)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;