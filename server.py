#!/usr/bin/env python3
"""
Simple HTTP server that serves Markdown files as rendered HTML.
Place this file in the directory with your .md articles.
Run: python3 server.py
Then visit http://localhost:8080 in your browser.
"""
import http.server
import socketserver
import markdown
import os
from urllib.parse import unquote

PORT = 8080
DIRECTORY = os.getcwd()  # serve files from current directory

# Configure Markdown with useful extensions
md = markdown.Markdown(extensions=['extra', 'codehilite', 'tables'])

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Decode URL
        path = unquote(self.path)
        # Remove query string and fragment
        if '?' in path:
            path = path.split('?', 1)[0]
        if '#' in path:
            path = path.split('#', 1)[0]

        # Normalize root to index.html (we'll generate a listing)
        if path == '/':
            self.send_index()
            return

        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]

        # Security: prevent directory traversal
        if '..' in path or path.startswith('/'):
            self.send_error(403, "Forbidden")
            return

        # Determine file path
        file_path = os.path.join(DIRECTORY, path)

        # If it's a directory, try to serve index.html or generate listing
        if os.path.isdir(file_path):
            # Look for index.html or index.md
            for idx in ('index.html', 'index.md'):
                idx_path = os.path.join(file_path, idx)
                if os.path.isfile(idx_path):
                    path = os.path.join(path, idx)
                    file_path = idx_path
                    break
            else:
                self.send_index(file_path)
                return

        # If file doesn't exist, 404
        if not os.path.isfile(file_path):
            self.send_error(404, "File not found")
            return

        # Serve .md files as rendered HTML
        if file_path.endswith('.md'):
            self.serve_markdown(file_path)
        else:
            # For other files, use default behavior (but restrict to safe types)
            self.serve_file(file_path)

    def send_index(self, subdir=None):
        """Generate a simple index of .md files in the given directory."""
        if subdir is None:
            subdir = DIRECTORY
        rel_subdir = os.path.relpath(subdir, DIRECTORY)
        if rel_subdir == '.':
            rel_subdir = ''
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        # List .md files
        files = []
        for f in os.listdir(subdir):
            if f.endswith('.md') and os.path.isfile(os.path.join(subdir, f)):
                files.append(f)
        files.sort()
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Travel Blog Articles</title>
    <style>
        body {{ font-family: sans-serif; margin: 2rem; line-height: 1.6; }}
        h1 {{ color: #2c3e50; }}
        ul {{ list-style: none; padding: 0; }}
        li {{ margin: 0.5rem 0; }}
        a {{ text-decoration: none; color: #3498db; }}
        a:hover {{ text-decoration: underline; }}
        .back {{ display: inline-block; margin-bottom: 1.5rem; }}
    </style>
</head>
<body>
    <h1>Travel Blog Articles</h1>
    <p>Click an article to read it.</p>
    <ul>
'''
        for f in files:
            # Build link relative to current directory
            if rel_subdir:
                link = f'{rel_subdir}/{f}'
            else:
                link = f
            html += f'        <li><a href="/{link}">{f[:-3]}</a></li>\n'
        html += '''    </ul>
</body>
</html>'''
        self.wfile.write(html.encode('utf-8'))

    def serve_markdown(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            self.send_error(500, f"Cannot read file: {e}")
            return
        # Convert markdown to HTML
        html_body = md.convert(text)
        # Reset markdown state for next conversion
        md.reset()
        # Build full HTML page
        rel_path = os.path.relpath(file_path, DIRECTORY)
        title = os.path.splitext(os.path.basename(file_path))[0].replace('_', ' ').title()
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <style>
        body {{ font-family: serif; line-height: 1.7; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #333; }}
        h1, h2, h3, h4, h5, h6 {{ color: #2c3e50; margin-top: 1.5rem; }}
        p {{ margin-bottom: 1rem; }}
        ul, ol {{ margin-left: 2rem; margin-bottom: 1rem; }}
        pre {{ background: #f8f8f8; padding: 1rem; overflow: auto; }}
        code {{ background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; }}
        table {{ border-collapse: collapse; width: 100%; margin-bottom: 1rem; }}
        th, td {{ border: 1px solid #ddd; padding: 0.5rem; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        a {{ color: #3498db; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        .back {{ display: inline-block; margin-bottom: 1.5rem; }}
        .back a {{ font-size: 0.9rem; }}
    </style>
</head>
<body>
    <a href="/" class="back">&larr; Back to index</a>
    <article>
        {html_body}
    </article>
</body>
</html>'''
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(html)))
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_file(self, file_path):
        # Use base class for static files but restrict to safe extensions
        safe_extensions = ('.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.txt', '.json')
        if not file_path.lower().endswith(safe_extensions):
            self.send_error(403, "Forbidden")
            return
        # Use SimpleHTTPRequestHandler's logic but ensure we serve from DIRECTORY
        # Temporarily change directory
        old_cwd = os.getcwd()
        os.chdir(DIRECTORY)
        try:
            # Call parent method
            super().do_GET()
        finally:
            os.chdir(old_cwd)

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")
            httpd.shutdown()