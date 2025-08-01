import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Cart.css';

const Cart = () => {
  const { cart, dispatch } = useApp();
  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id, quantity: newQuantity } 
      });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingCart size={64} className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any books to your cart yet. Start browsing our collection!</p>
            <Link to="/books" className="btn btn-primary">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">{totalItems} items</span>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-content">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
                    }}
                  />
                  
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-author">by {item.author}</p>
                    <span className="item-genre">{item.genre}</span>
                    <div className="item-price">₹{item.price}</div>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                    
                    <div className="item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span className="summary-label">Subtotal ({totalItems} items)</span>
              <span className="summary-value">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Tax</span>
              <span className="summary-value">₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span className="total-label">Total</span>
              <span className="total-value">₹{total.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>
            
            <Link to="/books" className="btn btn-secondary continue-shopping">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;