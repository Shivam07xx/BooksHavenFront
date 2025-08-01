import { ArrowRight, Award, BookOpen, Star, Truck, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/BookCard/BookCard';
import { useApp } from '../../context/AppContext';
import './Home.css';

const Home = () => {
  const { fetchBooks } = useApp();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Canvas animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1
    });

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Fetch featured books
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const response = await fetch('/api/books/featured/top');
        if (response.ok) {
          const books = await response.json();
          setFeaturedBooks(books);
        }
      } catch (error) {
        console.error('Error loading featured books:', error);
      }
    };

    loadFeaturedBooks();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing selection of books and fast delivery. BookHaven has become my go-to bookstore!",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Great prices and excellent customer service. The website is easy to navigate.",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      comment: "I love the variety of genres available. Found some rare books I couldn't find elsewhere.",
      avatar: "ED"
    }
  ];

  const benefits = [
    {
      icon: <BookOpen size={32} />,
      title: "Vast Collection",
      description: "Over 10,000 books across all genres and categories"
    },
    {
      icon: <Truck size={32} />,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹50 with quick delivery"
    },
    {
      icon: <Award size={32} />,
      title: "Quality Guaranteed",
      description: "All books are carefully selected and quality checked"
    },
    {
      icon: <Users size={32} />,
      title: "Expert Curation",
      description: "Books curated by literary experts and avid readers"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <canvas ref={canvasRef} className="hero-canvas"></canvas>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Your Next
              <span className="hero-highlight"> Great Read</span>
            </h1>
            <p className="hero-description">
              Explore thousands of books across every genre. From bestsellers to hidden gems, 
              find the perfect book that speaks to your soul.
            </p>
            <div className="hero-actions">
              <Link to="/books" className="btn btn-primary btn-lg">
                Explore Books
                <ArrowRight size={20} />
              </Link>
              <Link to="/books?sortBy=rating" className="btn btn-secondary btn-lg">
                Top Rated
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Books</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Readers</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Books</h2>
            <p className="section-description">
              Handpicked selections from our literary experts
            </p>
          </div>
          
          <div className="books-grid">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/books" className="btn btn-primary">
              View All Books
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose BookHaven?</h2>
            <p className="section-description">
              We're committed to bringing you the best reading experience
            </p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Readers Say</h2>
            <p className="section-description">
              Join thousands of satisfied customers
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h2 className="newsletter-title">Stay Updated</h2>
              <p className="newsletter-description">
                Get notified about new releases, special offers, and literary events
              </p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="btn btn-accent">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;