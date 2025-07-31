import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  wishlist: [],
  books: [],
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGIN':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,
        loading: false 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        cart: [],
        wishlist: []
      };
    case 'SET_BOOKS':
      return { ...state, books: action.payload, loading: false };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_TO_WISHLIST':
      if (!state.wishlist.find(item => item.id === action.payload.id)) {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        };
      }
      return state;
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const cartData = localStorage.getItem('cart');
    const wishlistData = localStorage.getItem('wishlist');

    if (userData && token) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(userData) });
    }
    if (cartData) {
      dispatch({ type: 'SET_CART', payload: JSON.parse(cartData) });
    }
    if (wishlistData) {
      dispatch({ type: 'SET_WISHLIST', payload: JSON.parse(wishlistData) });
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const fetchBooks = async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();
      dispatch({ type: 'SET_BOOKS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch books' });
      return [];
    }
  };

  const createOrder = async (orderData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, order: data.order };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
      return { success: false, message: 'Network error' };
    }
  };

  const value = {
    ...state,
    dispatch,
    login,
    register,
    logout,
    fetchBooks,
    createOrder,
    getAuthHeaders
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};