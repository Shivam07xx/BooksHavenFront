import { BookOpen, DollarSign, Edit, Plus, Shield, ShoppingBag, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Admin.css';

const Admin = () => {
  const { getAuthHeaders } = useApp();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    genre: '',
    description: '',
    image: '',
    stock: '',
    isbn: '',
    publishedDate: '',
    pageCount: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const booksData = await response.json();
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingBook 
        ? `/api/admin/book/${editingBook.id}`
        : '/api/admin/book';
      
      const method = editingBook ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          pageCount: parseInt(formData.pageCount),
          rating: editingBook?.rating || 4.0
        })
      });

      if (response.ok) {
        await fetchBooks();
        await fetchStats();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      genre: book.genre,
      description: book.description,
      image: book.image,
      stock: book.stock.toString(),
      isbn: book.isbn,
      publishedDate: book.publishedDate.split('T')[0],
      pageCount: book.pageCount.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/admin/book/${bookId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          await fetchBooks();
          await fetchStats();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      price: '',
      genre: '',
      description: '',
      image: '',
      stock: '',
      isbn: '',
      publishedDate: '',
      pageCount: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const getStockBadgeClass = (stock) => {
    if (stock < 5) return 'stock-low';
    if (stock < 20) return 'stock-medium';
    return 'stock-high';
  };

  const genres = [
    'Classic Literature',
    'Dystopian Fiction',
    'Romance',
    'Coming-of-age Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Non-Fiction',
    'Biography',
    'History',
    'Self-Help',
    'Business'
  ];

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">
            <Shield className="admin-icon" size={40} />
            Admin Dashboard
          </h1>
          <button className="add-book-btn" onClick={openAddModal}>
            <Plus size={20} />
            Add New Book
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-value">{stats.totalBooks || 0}</div>
            <div className="stat-label">Total Books</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-value">{stats.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-value">{stats.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">₹{(stats.totalRevenue || 0).toFixed(0)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <div className="section-header">
              <h2 className="section-title">
                <BookOpen className="section-icon" size={20} />
                Manage Books
              </h2>
            </div>

            {books.length === 0 ? (
              <div className="empty-state">
                <BookOpen className="empty-state-icon" size={48} />
                <h3>No books found</h3>
                <p>Start by adding your first book to the inventory</p>
              </div>
            ) : (
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Title & Author</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>
                        <img 
                          src={book.image} 
                          alt={book.title}
                          className="book-image-small"
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg';
                          }}
                        />
                      </td>
                      <td className="book-title-cell">
                        <div className="book-title-small">{book.title}</div>
                        <div className="book-author-small">by {book.author}</div>
                      </td>
                      <td>{book.genre}</td>
                      <td>₹{book.price}</td>
                      <td>
                        <span className={`stock-badge ${getStockBadgeClass(book.stock)}`}>
                          {book.stock}
                        </span>
                      </td>
                      <td>{book.rating}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(book)}
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button className="close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="book-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-input"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Genre</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid single">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid single">
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://example.com/book-image.jpg"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Page Count</label>
                    <input
                      type="number"
                      name="pageCount"
                      value={formData.pageCount}
                      onChange={handleChange}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="978-0-123456-78-9"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Published Date</label>
                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;