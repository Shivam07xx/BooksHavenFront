import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BookCard from '../../components/BookCard/BookCard';
import './Books.css';

const Books = () => {
  const { books, fetchBooks, loading } = useApp();
  const [filters, setFilters] = useState({
    search: '',
    genre: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'title'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'title'
    });
  };

  const genres = [
    'all',
    'Classic Literature',
    'Dystopian Fiction',
    'Romance',
    'Coming-of-age Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Non-Fiction',
    'Biography'
  ];

  const sortOptions = [
    { value: 'title', label: 'Title A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  if (loading) {
    return (
      <div className="books-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="container">
        <div className="books-header">
          <div className="books-title-section">
            <h1 className="books-title">Explore Our Collection</h1>
            <p className="books-subtitle">
              Discover your next favorite book from our curated selection
            </p>
          </div>
          
          <div className="books-stats">
            <span className="books-count">{books.length} Books Found</span>
          </div>
        </div>

        <div className="books-controls">
          <div className="search-bar">
            <div className="search-input-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search books, authors, or genres..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-controls">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>

            <div className="sort-control">
              <SortAsc size={16} />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="filter-select"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="price-input"
                  />
                  <span className="price-separator">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>

              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {books.length === 0 ? (
          <div className="no-books">
            <div className="no-books-content">
              <Search size={48} className="no-books-icon" />
              <h3>No books found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;