import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchMarkdownAsHtml } from '../services/markdownService';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { filename } = useParams();
  const location = useLocation();
  const url = window.location.origin + location.pathname;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('PSEOC Blog');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Unknown Author');

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch markdown and authors in parallel
        const [markdownResponse, authorsResponse] = await Promise.all([
          fetch(`/markdown/${filename}`),
          fetch('/markdown/authors.json')
        ]);

        if (!markdownResponse.ok) {
          throw new Error(`Failed to load markdown file: ${filename}`);
        }
        const markdownText = await markdownResponse.text();
        
        // Extract title from first line or use filename
        const firstLine = markdownText.split('\n')[0];
        let postTitle = firstLine.replace(/^#+ /, '').trim();
        if (!postTitle) {
          postTitle = filename.replace(/\.md$/, '').replace(/[_]/g, ' ');
        }
        setTitle(`${postTitle} - PSEOC Blog`);
        
        // Create a description from the first 200 characters of the markdown (or first paragraph)
        const plainText = markdownText.replace(/[#*`\[\]()_~>]/g, '').replace(/\n+/g, ' ').trim();
        const desc = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
        setDescription(desc);
        
        // Convert markdown to HTML
        const html = await fetchMarkdownAsHtml(filename);
        setContent(html);
        
        // Get author from authors.json
        if (authorsResponse.ok) {
          const authors = await authorsResponse.json();
          setAuthor(authors[filename] || 'Unknown Author');
        } else {
          setAuthor('Unknown Author');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
        setTitle('Error - PSEOC Blog');
        setDescription('Could not load the requested post.');
        setAuthor('Unknown Author');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [filename]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading - PSEOC Blog</title>
          <meta property="og:title" content="Loading - PSEOC Blog" />
          <meta property="og:description" content="Loading blog post..." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
        </Helmet>
        <p>Loading post...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
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
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
      </Helmet>
      <div className="blog-post">
        <div className="post-header">
          <h1>{title.replace(' - PSEOC Blog', '')}</h1>
          <p className="post-meta">
            <span className="post-author">by {author}</span>
            <span className="post-date">{new Date().toISOString().split('T')[0]}</span>
          </p>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
};

export default BlogPost;