# Vignes.Vibe Blog

A beautiful, fast, and simple static blog generator built with Node.js. Write your posts in Markdown and generate beautiful HTML pages automatically.

## Features

- 📝 **Markdown Support**: Write posts in Markdown with YAML front matter
- 🎨 **Beautiful Design**: Modern, responsive, and mobile-friendly
- ⚡ **Fast**: Static HTML files load instantly
- 🔍 **SEO Friendly**: Clean URLs and proper meta tags
- 🏷️ **Tags Support**: Organize posts with tags
- 📱 **Responsive**: Looks great on all devices
- 🌓 **Dark Mode**: Automatic dark mode support
- 🔧 **Easy to Use**: Simple commands to build and serve
- 👀 **Watch Mode**: Automatic rebuilding during development

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Your First Post

Create a new `.md` file in the `posts` directory:

```markdown
---
title: "My First Post"
date: "2025-06-13"
tags: ["hello", "world"]
---

# My First Post

Welcome to my blog! This is my first post written in Markdown.

## What I'll Write About

- Technology
- Life experiences
- Creative projects

*Thanks for reading!*
```

### 3. Build Your Blog

```bash
npm run build
```

### 4. Serve Locally

```bash
npm run serve
```

Your blog will be available at `http://localhost:3000`

## Development Workflow

### Watch Mode (Recommended for Development)

```bash
npm run watch
```

This will:
- Build your blog initially
- Watch for changes in posts, templates, and build script
- Automatically rebuild when files change
- Start a local server at `http://localhost:3000`

### Available Scripts

- `npm run build` - Build the static site
- `npm run serve` - Serve the built site locally
- `npm run dev` - Build and serve (one-time)
- `npm run watch` - Watch for changes and rebuild automatically

## Writing Posts

### Post Structure

All posts go in the `posts/` directory and must have the `.md` extension.

Each post should start with YAML front matter:

```yaml
---
title: "Your Post Title"
date: "2025-06-13"
tags: ["tag1", "tag2", "tag3"]
---
```

### Supported Front Matter Fields

- `title` (required): The post title
- `date` (required): Publication date in YYYY-MM-DD format
- `tags` (optional): Array of tags for the post

### Markdown Features

The blog supports all standard Markdown features:

- **Headings**: `# H1`, `## H2`, `### H3`, etc.
- **Emphasis**: `**bold**`, `*italic*`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code**: `` `inline code` `` and ```code blocks```
- **Lists**: Ordered and unordered
- **Blockquotes**: `> quote text`
- **Tables**: Markdown table syntax

## Customization

### Styling

Edit `public/css/style.css` to customize the appearance of your blog.

### Templates

Custom templates can be added to the `templates/` directory:

- `post.html` - Individual post template
- `index.html` - Homepage template (optional)
- `archive.html` - Archive page template (optional)

### Template Variables

Available variables in templates:

- `{{title}}` - Post title
- `{{content}}` - Rendered HTML content
- `{{date}}` - ISO date string
- `{{formattedDate}}` - Human-readable date
- `{{#tags}}{{.}}{{/tags}}` - Loop through tags

## File Structure

```
vignes-vibe-blog/
├── posts/                 # Your blog posts (.md files)
├── templates/             # HTML templates (optional)
├── public/                # Generated static files
│   ├── css/              # Stylesheets
│   ├── posts/            # Generated post HTML files
│   ├── index.html        # Homepage
│   └── archive.html      # Archive page
├── build.js              # Build script
├── watch.js              # Development watch script
└── package.json          # Dependencies and scripts
```

## Deployment

The built site is in the `public/` directory. You can deploy it to any static hosting service:

- **Netlify**: Drag and drop the `public` folder
- **Vercel**: Connect your repo and set build command to `npm run build`
- **GitHub Pages**: Push the `public` folder to a `gh-pages` branch
- **Traditional hosting**: Upload the `public` folder contents via FTP

## Tips

1. **Consistent naming**: Use kebab-case for post filenames (e.g., `my-awesome-post.md`)
2. **Image optimization**: Compress images before adding them to posts
3. **SEO**: Use descriptive titles and include relevant tags
4. **Content organization**: Use tags consistently to help readers find related posts
5. **Regular posting**: The `date` field helps keep your content organized chronologically

## Troubleshooting

### Build fails
- Check that all posts have valid YAML front matter
- Ensure required fields (`title`, `date`) are present
- Verify Markdown syntax is correct

### Posts not showing
- Confirm files have `.md` extension
- Check that front matter is properly formatted
- Ensure posts are in the `posts/` directory

### Styles not loading
- Run `npm run build` to regenerate files
- Check that `public/css/style.css` exists
- Verify file paths in HTML templates

---

Happy blogging! 🎉
