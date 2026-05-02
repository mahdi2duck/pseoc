# TODO: Convert pseoc to a Real Blog with Vite React

## Phase 1: Setup
- [x] Initialize Vite React project in pseoc directory
- [x] Install necessary dependencies (react-router-dom, markdown-it)
- [x] Restore markdown files from git
- [x] Configure Vite for React
- [x] Created markdown service to convert markdown to HTML
- [x] Created public/markdown folder and copied markdown files there
- [x] Created public/markdown/list.json with list of markdown filenames
- [x] Updated markdown service to fetch markdown files from /markdown/
- [x] Created public/markdown/authors.json with author suggestions for each post

## Phase 2: Structure
- [x] Create Navbar component with logo and title
- [x] Create Footer component
- [x] Create Layout component to wrap pages
- [x] Set up routing for blog index and individual posts

## Phase 3: Content
- [x] Create BlogIndex component to list all posts with title, date, author suggestion
- [x] Create BlogPost component to display individual post with meta data (title, author, date, reading time)

## Phase 4: Styling
- [x] Add basic CSS or CSS-in-js for navbar, footer, layout, and blog components
- [x] Ensure responsive design

## Phase 5: Metadata & SEO
- [x] Install react-helmet-async
- [x] Add meta tags (title, description) for each blog post
- [x] Add open graph tags for social sharing
- [ ] Generate sitemap.xml (optional for now)

## Phase 6: Optimization & Improvements
- [x] Add syntax highlighting for code blocks
- [ ] Implement lazy loading for images (if any)
- [ ] Add author suggestions for each post (from a config or frontmatter) -> [x] done via authors.json
- [ ] Add pagination or infinite scroll for blog index
- [ ] Add search functionality
- [ ] Add dark mode toggle

## Phase 7: Deployment
- [x] Build the React app for production
- [x] Deploy to GitHub Pages (or another free hosting)
- [ ] Update the GitHub Pages configuration if needed

## Phase 8: Maintenance & Future Ideas
- [ ] Create a script to convert new markdown files to blog posts
- [ ] Add support for tags/categories
- [ ] Add comments (via staticman, utterances, etc.)
- [ ] Add newsletter signup
- [ ] Add RSS feed