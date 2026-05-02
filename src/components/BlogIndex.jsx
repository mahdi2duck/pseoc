import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BlogIndex = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const url = window.location.origin + location.pathname;

  useEffect(() => {
    // Fetch the list of markdown files and authors
    Promise.all([
      fetch('/markdown/list.json').then(res => res.json()),
      fetch('/markdown/authors.json').then(res => res.json()).catch(() => ({})) // optional
    ])
    .then(([filenames, authors]) => {
      // For each filename, fetch the markdown and extract the title (first line) or use the filename as title.
      const postPromises = filenames.map(async (filename) => {
        try {
          const response = await fetch(`/markdown/${filename}`);
          if (!response.ok) {
            throw new Error(`Failed to load markdown file: ${filename}`);
          }
          const markdown = await response.text();
          // Extract the first line as the title (assuming it's a header) or use the filename without extension and replace underscores with spaces.
          const firstLine = markdown.split('\n')[0];
          let title = firstLine.replace(/^#+ /, '').trim(); // Remove markdown header syntax and trim
          if (!title) {
            // If no header, use the filename without extension and replace underscores with spaces
            title = filename.replace(/\.md$/, '').replace(/[_]/g, ' ');
          }
          return {
            id: filename,
            title,
            filename,
            author: authors[filename] || 'Unknown Author',
            // We can also extract a date from the filename if we have a naming convention, but for now we'll skip.
            date: new Date().toISOString().split('T')[0], // Placeholder
          };
        } catch (error) {
          console.error(`Error loading post ${filename}:`, error);
          return null;
        }
      });

      Promise.all(postPromises)
        .then(results => {
          const validPosts = results.filter(post => post !== null);
          setPosts(validPosts);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading posts:', error);
          setLoading(false);
          setError('Failed to load posts');
        });
    })
    .catch(error => {
      console.error('Error loading list.json:', error);
      setLoading(false);
      setError('Failed to load list of posts');
    });
  }, []);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading - PSEOC Blog</title>
          <meta property="og:title" content="Loading - PSEOC Blog" />
          <meta property="og:description" content="Loading blog posts..." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
        </Helmet>
        <p>Loading posts...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - PSEOC Blog</title>
          <meta name="description" content="An error occurred while loading the blog posts." />
          <meta property="og:title" content="Error - PSEOC Blog" />
          <meta property="og:description" content="An error occurred while loading the blog posts." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
        </Helmet>
        <p className="error">{error}</p>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>PSEOC Blog - Programmatic SEO & AI Travel Blog</title>
        <meta name="description" content="A collection of research articles on programmatic SEO, AI-generated content, and travel blogging challenges." />
        <meta property="og:title" content="PSEOC Blog - Programmatic SEO & AI Travel Blog" />
        <meta property="og:description" content="A collection of research articles on programmatic SEO, AI-generated content, and travel blogging challenges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
      </Helmet>
      <div className="blog-index">
        <h1>Blog Posts</h1>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                <p className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-author">by {post.author}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default BlogIndex;