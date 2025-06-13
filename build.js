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
