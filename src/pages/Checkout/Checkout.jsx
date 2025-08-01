import { ArrowRight, CheckCircle, CreditCard, Home, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, createOrder, loading } = useApp();
  const navigate = useNavigate();
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment
    paymentMethod: 'credit-card'
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'address', 'city', 'state', 'zipCode'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Zip code validation
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid zip code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const orderData = {
      items: cart,
      totalAmount: total,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: formData.paymentMethod
    };

    const result = await createOrder(orderData);
    
    if (result.success) {
      setOrderDetails({
        orderId: result.order.id,
        total: total,
        estimatedDelivery: result.order.estimatedDelivery
      });
      setOrderPlaced(true);
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <CheckCircle size={80} className="success-icon" />
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>
            
            <div className="order-details">
              <div className="order-detail-row">
                <span>Order ID:</span>
                <span>#{orderDetails?.orderId}</span>
              </div>
              <div className="order-detail-row">
                <span>Total:</span>
                <span>₹{orderDetails?.total.toFixed(2)}</span>
              </div>
              <div className="order-detail-row">
                <span>Estimated Delivery:</span>
                <span>{new Date(orderDetails?.estimatedDelivery).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="success-actions">
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-primary"
              >
                View Orders
              </button>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                <Home size={16} />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your order</p>
        </div>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Billing Information */}
            <div className="form-section">
              <h2 className="section-title">
                <User className="section-icon" size={20} />
                Billing Information
              </h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {formErrors.firstName && (
                    <span className="form-error">{formErrors.firstName}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {formErrors.lastName && (
                    <span className="form-error">{formErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <span className="form-error">{formErrors.email}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {formErrors.phone && (
                    <span className="form-error">{formErrors.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h2 className="section-title">
                <MapPin className="section-icon" size={20} />
                Shipping Address
              </h2>
              
              <div className="form-grid single">
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${formErrors.address ? 'error' : ''}`}
                    placeholder="123 Main Street"
                  />
                  {formErrors.address && (
                    <span className="form-error">{formErrors.address}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-input ${formErrors.city ? 'error' : ''}`}
                    placeholder="Enter city"
                  />
                  {formErrors.city && (
                    <span className="form-error">{formErrors.city}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`form-input ${formErrors.state ? 'error' : ''}`}
                    placeholder="Enter state"
                  />
                  {formErrors.state && (
                    <span className="form-error">{formErrors.state}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`form-input ${formErrors.zipCode ? 'error' : ''}`}
                    placeholder="12345"
                  />
                  {formErrors.zipCode && (
                    <span className="form-error">{formErrors.zipCode}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2 className="section-title">
                <CreditCard className="section-icon" size={20} />
                Payment Method
              </h2>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${formData.paymentMethod === 'credit-card' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit-card' }))}
                >
                  <CreditCard className="payment-icon" size={24} />
                  <span className="payment-label">Credit Card</span>
                </div>
                
                <div 
                  className={`payment-method ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                >
                  <CreditCard className="payment-icon" size={24} />
                  <span className="payment-label">PayPal</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary place-order-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="item-image-small"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
                    }}
                  />
                  <div className="item-info">
                    <div className="item-name">{item.title}</div>
                    <div className="item-author-small">by {item.author}</div>
                    <div className="item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price-small">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;