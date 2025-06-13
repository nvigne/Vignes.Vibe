import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import fm from 'front-matter';

class BlogGenerator {
  constructor() {
    this.postsDir = './posts';
    this.templatesDir = './templates';
    this.publicDir = './public';
    this.posts = [];
    // Set base path for GitHub Pages deployment
    this.basePath = process.env.NODE_ENV === 'production' ? '/Vignes.Vibe' : '';
  }

  async build() {
    console.log('🚀 Building blog...');
      // Ensure public directory exists
    await this.ensureDir(this.publicDir);
    await this.ensureDir(path.join(this.publicDir, 'posts'));
    await this.ensureDir(path.join(this.publicDir, 'css'));
    
    // Copy static assets
    await this.copyStaticAssets();
    
    // Load and process posts
    await this.loadPosts();
    
    // Generate pages
    await this.generatePostPages();
    await this.generateIndexPage();
    await this.generateArchivePage();
    
    console.log('✅ Blog built successfully!');
    console.log(`Generated ${this.posts.length} posts`);
  }

  async ensureDir(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async copyStaticAssets() {
    // Copy CSS files
    try {
      // Create the source CSS if it doesn't exist
      const cssSource = path.join('.', 'assets', 'css', 'style.css');
      const cssDestination = path.join(this.publicDir, 'css', 'style.css');
      
      try {
        await fs.access(cssSource);
        await fs.copyFile(cssSource, cssDestination);
        console.log('📄 Copied CSS from assets/css/style.css');
      } catch {
        // If assets/css/style.css doesn't exist, create the default CSS
        await this.createDefaultCSS();
        console.log('📄 Created default CSS file');
      }
    } catch (error) {
      console.error('Error copying static assets:', error.message);
    }
  }

  async createDefaultCSS() {
    const defaultCSS = `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fafafa;
}

/* Header and Navigation */
header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
    text-decoration: none;
    transition: color 0.3s ease;
}

.logo:hover {
    color: #1d4ed8;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #666;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: #2563eb;
}

/* Main content */
main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 200px);
}

/* Hero section */
.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: -2rem -2rem 3rem -2rem;
    border-radius: 0 0 2rem 2rem;
}

.hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Section headings */
h1, h2, h3 {
    color: #1f2937;
    margin-bottom: 1rem;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
}

h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
}

h3 {
    font-size: 1.5rem;
    font-weight: 600;
}

/* Post previews */
.recent-posts {
    margin-bottom: 4rem;
}

.post-preview, .archive-post {
    background: white;
    padding: 2rem;
    margin-bottom: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-preview:hover, .archive-post:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.post-preview h2 a, .archive-post h3 a {
    color: #1f2937;
    text-decoration: none;
    transition: color 0.3s ease;
}

.post-preview h2 a:hover, .archive-post h3 a:hover {
    color: #2563eb;
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
}

.tag {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
}

.excerpt {
    color: #4b5563;
    margin-bottom: 1rem;
    line-height: 1.7;
}

.read-more {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.read-more:hover {
    color: #1d4ed8;
}

/* Individual post styles */
.post {
    background: white;
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.post-header {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.post-header h1 {
    margin-bottom: 1rem;
    color: #1f2937;
}

.post-content {
    line-height: 1.8;
}

.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #1f2937;
}

.post-content p {
    margin-bottom: 1.5rem;
    color: #374151;
}

.post-content ul,
.post-content ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
}

.post-content li {
    margin-bottom: 0.5rem;
    color: #374151;
}

.post-content blockquote {
    border-left: 4px solid #2563eb;
    padding-left: 2rem;
    margin: 2rem 0;
    font-style: italic;
    color: #4b5563;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0 0.5rem 0.5rem 0;
}

.post-content code {
    background: #f1f5f9;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
    color: #dc2626;
}

.post-content pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

.post-content pre code {
    background: none;
    color: inherit;
    padding: 0;
}

.post-content img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
}

.post-content a {
    color: #2563eb;
    text-decoration: none;
}

.post-content a:hover {
    text-decoration: underline;
}

/* Archive page */
.archive {
    margin-bottom: 4rem;
}

.archive h1 {
    margin-bottom: 3rem;
    text-align: center;
}

/* Footer */
footer {
    background: #1f2937;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
}

/* Responsive design */
@media (max-width: 768px) {
    nav {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    main {
        padding: 1rem;
    }
    
    .hero {
        margin: -1rem -1rem 2rem -1rem;
        padding: 2rem 1rem;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .post {
        padding: 2rem 1.5rem;
    }
    
    .post-preview, .archive-post {
        padding: 1.5rem;
    }
    
    .post-meta {
        flex-wrap: wrap;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    body {
        background-color: #111827;
        color: #f9fafb;
    }
    
    header {
        background: #1f2937;
    }
    
    .post-preview, .archive-post, .post {
        background: #1f2937;
        color: #f9fafb;
    }
    
    .post-preview h2 a, .archive-post h3 a, .post-header h1 {
        color: #f9fafb;
    }
    
    .hero {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
}`;

    await fs.writeFile(path.join(this.publicDir, 'css', 'style.css'), defaultCSS);
  }

  async loadPosts() {
    try {
      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      this.posts = await Promise.all(
        markdownFiles.map(async (file) => {
          const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
          const parsed = fm(content);
          const html = marked(parsed.body);
          
          return {
            slug: path.basename(file, '.md'),
            filename: file,
            frontMatter: parsed.attributes,
            content: html,
            excerpt: this.generateExcerpt(parsed.body)
          };
        })
      );
      
      // Sort posts by date (newest first)
      this.posts.sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date));
    } catch (error) {
      console.error('Error loading posts:', error.message);
      this.posts = [];
    }
  }

  generateExcerpt(content) {
    const plainText = content.replace(/#{1,6}\s+/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
    return plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }

  async loadTemplate(templateName) {
    try {
      return await fs.readFile(path.join(this.templatesDir, templateName), 'utf-8');
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error.message);
      return this.getDefaultTemplate(templateName);
    }
  }
  getDefaultTemplate(templateName) {
    if (templateName === 'post.html') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Vignes.Vibe</title>
    <link rel="stylesheet" href="{{basePath}}/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="{{basePath}}/index.html" class="logo">Vignes.Vibe</a>
            <div class="nav-links">
                <a href="{{basePath}}/index.html">Home</a>
                <a href="{{basePath}}/archive.html">Archive</a>
            </div>
        </nav>
    </header>
    <main>
        <article class="post">
            <header class="post-header">
                <h1>{{title}}</h1>
                <div class="post-meta">
                    <time datetime="{{date}}">{{formattedDate}}</time>
                    {{#tags}}<span class="tag">{{.}}</span>{{/tags}}
                </div>
            </header>
            <div class="post-content">
                {{content}}
            </div>
        </article>
    </main>
    <footer>
        <p>&copy; 2025 Vignes.Vibe. All rights reserved.</p>
    </footer>
</body>
</html>`;
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vignes.Vibe</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    {{content}}
</body>
</html>`;
  }

  renderTemplate(template, data) {
    let rendered = template;
    
    // Simple template replacement
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, data[key] || '');
    });
    
    // Handle arrays (like tags)
    rendered = rendered.replace(/{{#(\w+)}}(.*?){{\/\1}}/gs, (match, key, content) => {
      const value = data[key];
      if (Array.isArray(value)) {
        return value.map(item => content.replace(/{{\.}}/g, item)).join('');
      }
      return '';
    });
    
    return rendered;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  async generatePostPages() {
    const template = await this.loadTemplate('post.html');
    
    for (const post of this.posts) {
      const html = this.renderTemplate(template, {
        title: post.frontMatter.title || 'Untitled',
        date: post.frontMatter.date,
        formattedDate: this.formatDate(post.frontMatter.date),
        tags: post.frontMatter.tags || [],
        content: post.content,
        basePath: this.basePath
      });
      
      await fs.writeFile(path.join(this.publicDir, 'posts', `${post.slug}.html`), html);
    }
  }
  async generateIndexPage() {
    const recentPosts = this.posts.slice(0, 5);
    const postsHtml = recentPosts.map(post => `
      <article class="post-preview">
        <h2><a href="${this.basePath}/posts/${post.slug}.html">${post.frontMatter.title || 'Untitled'}</a></h2>
        <div class="post-meta">
          <time datetime="${post.frontMatter.date}">${this.formatDate(post.frontMatter.date)}</time>
          ${(post.frontMatter.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p class="excerpt">${post.excerpt}</p>
        <a href="${this.basePath}/posts/${post.slug}.html" class="read-more">Read more →</a>
      </article>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vignes.Vibe - Personal Blog</title>
    <link rel="stylesheet" href="${this.basePath}/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="${this.basePath}/index.html" class="logo">Vignes.Vibe</a>
            <div class="nav-links">
                <a href="${this.basePath}/index.html">Home</a>
                <a href="${this.basePath}/archive.html">Archive</a>
            </div>
        </nav>
    </header>
    <main>
        <section class="hero">
            <h1>Welcome to Vignes.Vibe</h1>
            <p>Thoughts, ideas, and insights from my journey</p>
        </section>
        <section class="recent-posts">
            <h2>Recent Posts</h2>
            ${postsHtml || '<p>No posts yet. Create your first post in the <code>posts</code> directory!</p>'}
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Vignes.Vibe. All rights reserved.</p>
    </footer>
</body>
</html>`;

    await fs.writeFile(path.join(this.publicDir, 'index.html'), html);
  }
  async generateArchivePage() {
    const postsHtml = this.posts.map(post => `
      <article class="archive-post">
        <h3><a href="${this.basePath}/posts/${post.slug}.html">${post.frontMatter.title || 'Untitled'}</a></h3>
        <div class="post-meta">
          <time datetime="${post.frontMatter.date}">${this.formatDate(post.frontMatter.date)}</time>
          ${(post.frontMatter.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p class="excerpt">${post.excerpt}</p>
      </article>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Archive - Vignes.Vibe</title>
    <link rel="stylesheet" href="${this.basePath}/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="${this.basePath}/index.html" class="logo">Vignes.Vibe</a>
            <div class="nav-links">
                <a href="${this.basePath}/index.html">Home</a>
                <a href="${this.basePath}/archive.html">Archive</a>
            </div>
        </nav>
    </header>
    <main>
        <section class="archive">
            <h1>All Posts</h1>
            ${postsHtml || '<p>No posts yet.</p>'}
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Vignes.Vibe. All rights reserved.</p>
    </footer>
</body>
</html>`;

    await fs.writeFile(path.join(this.publicDir, 'archive.html'), html);
  }
}

// Run the build
const generator = new BlogGenerator();
generator.build().catch(console.error);
