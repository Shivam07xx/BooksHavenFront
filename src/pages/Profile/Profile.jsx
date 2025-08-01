import { Edit, Heart, Save, ShoppingBag, ShoppingCart, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Profile.css';

const Profile = () => {
  const { user, wishlist, dispatch, getAuthHeaders } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const addToCart = (book) => {
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const removeFromWishlist = (bookId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: bookId });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-confirmed';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user?.name || 'User')}
          </div>
          <div className="profile-info">
            <h1>Welcome, {user?.name}</h1>
            <p>{user?.email}</p>
            <span className="profile-role">{user?.role || 'User'}</span>
          </div>
        </div>

        <div className="profile-content">
          {/* Profile Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <User className="section-icon" size={20} />
                Profile Information
              </h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>

            <form className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Order History */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <ShoppingBag className="section-icon" size={20} />
                Order History
              </h2>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag className="empty-state-icon" size={48} />
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <Link to="/books" className="btn btn-primary">
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <div className="order-id">Order #{order.id}</div>
                        <div className="order-date">{formatDate(order.orderDate)}</div>
                      </div>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="order-item">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="order-item-image"
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
                            }}
                          />
                          <div className="order-item-info">
                            <div className="order-item-title">{item.title}</div>
                            <div className="order-item-quantity">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="order-item">
                          <div className="order-item-info">
                            <div className="order-item-title">
                              +{order.items.length - 3} more items
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="order-total">
                      Total: ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wishlist */}
        <div className="profile-section">
          <div className="section-header">
            <h2 className="section-title">
              <Heart className="section-icon" size={20} />
              My Wishlist ({wishlist.length})
            </h2>
          </div>

          {wishlist.length === 0 ? (
            <div className="empty-state">
              <Heart className="empty-state-icon" size={48} />
              <h3>Your wishlist is empty</h3>
              <p>Save books you're interested in to your wishlist</p>
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map(book => (
                <div key={book.id} className="wishlist-item">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="wishlist-image"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
                    }}
                  />
                  <div className="wishlist-title">{book.title}</div>
                  <div className="wishlist-author">by {book.author}</div>
                  <div className="wishlist-price">₹{book.price}</div>
                  
                  <div className="wishlist-actions">
                    <button 
                      className="wishlist-btn add-cart-btn"
                      onClick={() => addToCart(book)}
                    >
                      <ShoppingCart size={12} />
                      Add to Cart
                    </button>
                    <button 
                      className="wishlist-btn remove-wishlist-btn"
                      onClick={() => removeFromWishlist(book.id)}
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;