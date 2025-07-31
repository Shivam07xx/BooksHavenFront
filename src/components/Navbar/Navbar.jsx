import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, Heart, LogOut, Menu, X, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <BookOpen size={28} />
          <span>BookHaven</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/books" className="nav-link" onClick={closeMenu}>
              Books
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-icon-link" onClick={closeMenu}>
                  <div className="cart-icon">
                    <ShoppingCart size={20} />
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </div>
                </Link>
                
                <div className="user-menu">
                  <span className="user-greeting">Hi, {user?.name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;