---
title: "Building Your Own Static Blog Generator from Scratch"
date: "2025-06-13"
tags: ["javascript", "nodejs", "tutorial", "static-sites", "markdown", "web-development"]
---

# Building Your Own Static Blog Generator from Scratch

Have you ever wanted to create your own blog but felt overwhelmed by complex CMS systems or frustrated by the limitations of existing platforms? Today, I'll walk you through building a complete static blog generator from scratch using Node.js. By the end of this tutorial, you'll have a fully functional blog system that converts Markdown files to beautiful HTML pages.

## Why Build Your Own?

Before diving into the code, let's understand why you might want to build your own static blog generator:

### **Complete Control**
- Customize every aspect of your blog's appearance and functionality
- No vendor lock-in or platform limitations
- Own your content and hosting decisions

### **Performance Benefits**
- Static HTML files load instantly
- No database queries or server-side processing
- Perfect for CDN distribution

### **Learning Experience**
- Understand how static site generators work under the hood
- Practice modern JavaScript and Node.js development
- Build something you'll actually use

## Project Overview

Our blog generator will have these key features:

- **Markdown to HTML conversion** with YAML front matter support
- **Beautiful, responsive design** with dark mode support
- **Tag system** for organizing posts
- **Automatic archive page** generation
- **Development workflow** with file watching and local server
- **GitHub integration** with automatic deployment

## Setting Up the Foundation

### Project Structure

First, let's create our project structure:

```
vignes-vibe-blog/
├── posts/                 # Markdown blog posts
├── templates/             # HTML templates (optional)
├── public/                # Generated static files
│   ├── css/              # Stylesheets
│   └── posts/            # Generated post HTML files
├── build.js              # Main build script
├── watch.js              # Development file watcher
└── package.json          # Dependencies and scripts
```

### Dependencies

Our `package.json` includes these essential dependencies:

```json
{
  "dependencies": {
    "marked": "^12.0.0",        // Markdown to HTML conversion
    "front-matter": "^4.0.2",   // YAML front matter parsing
    "chokidar": "^3.6.0",       // File watching for development
    "http-server": "^14.1.1"    // Local development server
  }
}
```

## The Heart: Build Script

The main build script (`build.js`) is where the magic happens. Let's break it down:

### Core Blog Generator Class

```javascript
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
  }
  
  async build() {
    console.log('🚀 Building blog...');
    
    // Ensure directories exist
    await this.ensureDir(this.publicDir);
    await this.ensureDir(path.join(this.publicDir, 'posts'));
    
    // Process content
    await this.loadPosts();
    await this.generatePostPages();
    await this.generateIndexPage();
    await this.generateArchivePage();
    
    console.log('✅ Blog built successfully!');
  }
}
```

### Loading and Processing Posts

The most crucial part is loading Markdown files and converting them:

```javascript
async loadPosts() {
  try {
    const files = await fs.readdir(this.postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    this.posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const content = await fs.readFile(path.join(this.postsDir, file), 'utf-8');
        const parsed = fm(content);  // Parse YAML front matter
        const html = marked(parsed.body);  // Convert Markdown to HTML
        
        return {
          slug: path.basename(file, '.md'),
          filename: file,
          frontMatter: parsed.attributes,
          content: html,
          excerpt: this.generateExcerpt(parsed.body)
        };
      })
    );
    
    // Sort by date (newest first)
    this.posts.sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date));
  } catch (error) {
    console.error('Error loading posts:', error.message);
    this.posts = [];
  }
}
```

### Template System

Instead of complex templating engines, we use simple string replacement:

```javascript
renderTemplate(template, data) {
  let rendered = template;
  
  // Replace simple variables: {{title}}, {{content}}, etc.
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, data[key] || '');
  });
  
  // Handle arrays like tags: {{#tags}}{{.}}{{/tags}}
  rendered = rendered.replace(/{{#(\w+)}}(.*?){{\/\1}}/gs, (match, key, content) => {
    const value = data[key];
    if (Array.isArray(value)) {
      return value.map(item => content.replace(/{{\.}}/g, item)).join('');
    }
    return '';
  });
  
  return rendered;
}
```

## Modern CSS Design

The visual appeal comes from a carefully crafted CSS file (`public/css/style.css`). Key design principles:

### Modern Typography
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}
```

### Responsive Layout
```css
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #111827;
    color: #f9fafb;
  }
}
```

## Development Workflow

### File Watching System

The `watch.js` script provides an excellent development experience:

```javascript
import chokidar from 'chokidar';
import { exec } from 'child_process';

const watcher = chokidar.watch(['posts/**/*.md', 'templates/**/*.html', 'build.js']);

watcher.on('change', async (path) => {
  console.log(`📝 File changed: ${path}`);
  console.log('🔨 Rebuilding...');
  
  try {
    await execAsync('npm run build');
    console.log('✅ Rebuild complete');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
  }
});
```

### npm Scripts

The `package.json` includes convenient scripts:

```json
{
  "scripts": {
    "build": "node build.js",
    "dev": "npm run build && npm run serve",
    "serve": "npx http-server public -p 3000 -o",
    "watch": "node watch.js"
  }
}
```

## Writing Blog Posts

Posts are written in Markdown with YAML front matter:

```markdown
---
title: "My Blog Post Title"
date: "2025-06-13"
tags: ["javascript", "tutorial", "web-development"]
---

# My Blog Post Title

Your content goes here in **Markdown format**.

## Subheadings Work Great

- Lists are supported
- Code blocks too:

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> Blockquotes for emphasis

The system automatically converts this to beautiful HTML!
```

## GitHub Integration

### Automatic Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) handles automatic deployment:

```yaml
name: Build and Deploy Blog

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    - run: npm run build
      
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
```

### Git Workflow

The complete workflow is streamlined:

1. **Write**: Create a new `.md` file in `posts/`
2. **Test**: Run `npm run watch` to see changes locally
3. **Deploy**: Commit and push to GitHub

```bash
git add .
git commit -m "Add new blog post: Building a Static Blog Generator"
git push
```

## Advanced Features You Can Add

Once you have the basic system working, consider these enhancements:

### RSS Feed Generation
```javascript
generateRSSFeed() {
  const rssItems = this.posts.map(post => `
    <item>
      <title>${post.frontMatter.title}</title>
      <link>https://yourdomain.com/posts/${post.slug}.html</link>
      <description>${post.excerpt}</description>
      <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
    </item>
  `).join('');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Your Blog</title>
        <description>Your blog description</description>
        <link>https://yourdomain.com</link>
        ${rssItems}
      </channel>
    </rss>`;
    
  return rss;
}
```

### Search Functionality
```javascript
generateSearchIndex() {
  const searchIndex = this.posts.map(post => ({
    title: post.frontMatter.title,
    content: post.content.replace(/<[^>]*>/g, ''), // Strip HTML
    url: `/posts/${post.slug}.html`,
    date: post.frontMatter.date,
    tags: post.frontMatter.tags
  }));
  
  return JSON.stringify(searchIndex);
}
```

### Pagination
```javascript
generatePaginatedIndex(postsPerPage = 5) {
  const totalPages = Math.ceil(this.posts.length / postsPerPage);
  
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * postsPerPage;
    const pagePosts = this.posts.slice(startIndex, startIndex + postsPerPage);
    
    // Generate page HTML with pagePosts
    // Save as index.html (page 1) or page-2.html, page-3.html, etc.
  }
}
```

## Performance Optimizations

### Image Optimization
```javascript
async optimizeImages() {
  // Use sharp or similar library to compress images
  // Generate multiple sizes for responsive images
  // Convert to modern formats like WebP
}
```

### CSS Minification
```javascript
async minifyCSS() {
  const css = await fs.readFile('public/css/style.css', 'utf-8');
  const minified = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
  
  await fs.writeFile('public/css/style.min.css', minified);
}
```

## Deployment Options

Your static blog can be deployed anywhere:

### GitHub Pages (Free)
- Automatic with our GitHub Actions workflow
- Custom domains supported
- SSL certificate included

### Netlify
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "public"
```

### Vercel
```bash
# vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "public" }
    }
  ]
}
```

## Conclusion

Building your own static blog generator is incredibly rewarding. You end up with:

- **Complete control** over your content and presentation
- **Deep understanding** of how static site generators work
- **Custom features** tailored to your specific needs
- **Fast, secure** website with minimal maintenance

The system we've built is:
- ✅ Simple but powerful
- ✅ Easy to extend and customize
- ✅ Production-ready with automatic deployment
- ✅ Performant and SEO-friendly

## What's Next?

Now that you understand how to build a static blog generator, you can:

1. **Customize the design** to match your personal style
2. **Add new features** like comments, search, or analytics
3. **Optimize performance** with image compression and CSS minification
4. **Experiment with different content types** beyond blog posts

The beauty of building your own tools is that you can evolve them exactly as your needs change. Start simple, then add complexity only where it adds real value.

Happy blogging! 🚀

---

*This blog post was written using the very system it describes - meta-blogging at its finest!*
