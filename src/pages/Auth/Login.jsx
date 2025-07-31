import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Auth.css';

const Login = () => {
  const { login, loading, error, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

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

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_ERROR' });

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async (role) => {
    const credentials = {
      email: role === 'admin' ? 'admin@bookhaven.com' : 'demo@bookhaven.com',
      password: 'demo123'
    };

    const result = await login(credentials);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <BookOpen size={40} />
            <span>BookHaven</span>
          </div>

          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue your reading journey</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {formErrors.email && (
                <span className="form-error">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <span className="form-error">{formErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="demo-section">
            <p className="demo-title">Try Demo Accounts:</p>
            <div className="demo-buttons">
              <button
                onClick={() => handleDemoLogin('user')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="btn btn-accent btn-sm"
                disabled={loading}
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;