import MarkdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';

// We'll create a markdown-it instance with the prism plugin for syntax highlighting
const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItPrism);

// We'll create a function to convert markdown string to HTML
export const markdownToHtml = (markdown) => {
  return md.render(markdown);
};

// We'll create a function to fetch a markdown file and convert it to HTML
// This function will be used in the BlogPost component to load a specific post.
export const fetchMarkdownAsHtml = async (filename) => {
  try {
    const response = await fetch(`/markdown/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${filename}`);
    }
    const markdownText = await response.text();
    return markdownToHtml(markdownText);
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return `<p>Error loading content</p>`;
  }
};

export default {
  markdownToHtml,
  fetchMarkdownAsHtml,
};