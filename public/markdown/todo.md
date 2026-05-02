# TODO: Convert pseoc to a Real Blog with Vite React

## Phase 1: Setup
- [x] Initialize Vite React project in pseoc directory
- [x] Install necessary dependencies (react-router-dom, markdown-it)
- [x] Restore markdown files from git
- [x] Configure Vite for React

## Phase 2: Structure
- [ ] Create Navbar component with logo and title
- [ ] Create Footer component
- [ ] Create Layout component to wrap pages
- [ ] Set up routing for blog index and individual posts

## Phase 3: Content
- [ ] Create a service to load markdown files from the pseoc directory (or public/markdown)
- [ ] Convert markdown to HTML using markdown-it or similar
- [ ] Create BlogIndex component to list all posts with title, date, author suggestion
- [ ] Create BlogPost component to display individual post with meta data (title, author, date, reading time)

## Phase 4: Styling
- [ ] Add basic CSS or CSS-in-js for navbar, footer, layout, and blog components
- [ ] Ensure responsive design

## Phase 5: Metadata & SEO
- [ ] Add meta tags (title, description) for each blog post
- [ ] Add open graph tags for social sharing
- [ ] Generate sitemap.xml (optional for now)

## Phase 6: Optimization & Improvements
- [ ] Add syntax highlighting for code blocks
- [ ] Implement lazy loading for images (if any)
- [ ] Add author suggestions for each post (from a config or frontmatter)
- [ ] Add pagination or infinite scroll for blog index
- [ ] Add search functionality
- [ ] Add dark mode toggle

## Phase 7: Deployment
- [ ] Build the React app for production
- [ ] Deploy to GitHub Pages (or another free hosting)
- [ ] Update the GitHub Pages configuration if needed

## Phase 8: Maintenance & Future Ideas
- [ ] Create a script to convert new markdown files to blog posts
- [ ] Add support for tags/categories
- [ ] Add comments (via staticman, utterances, etc.)
- [ ] Add newsletter signup
- [ ] Add RSS feed