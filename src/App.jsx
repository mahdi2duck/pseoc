import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import BlogIndex from './components/BlogIndex.jsx';
import BlogPost from './components/BlogPost.jsx';

// Placeholder components for About and Contact pages
function About() {
  return React.createElement('div', null,
    React.createElement('h1', null, 'About'),
    React.createElement('p', null, 'This is the about page.')
  );
}

function Contact() {
  return React.createElement('div', null,
    React.createElement('h1', null, 'Contact'),
    React.createElement('p', null, 'This is the contact page.')
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BlogIndex />} />
          <Route path="/posts/:filename" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;