import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          PSEOC Blog
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;