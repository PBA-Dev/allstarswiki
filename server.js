const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Parse command line arguments
const args = process.argv.slice(2);
const hostIndex = args.indexOf('--host');
const portIndex = args.indexOf('--port');

const HOST = hostIndex !== -1 ? args[hostIndex + 1] : '0.0.0.0';
const PORT = portIndex !== -1 ? parseInt(args[portIndex + 1]) : 3000;

const app = express();

// Get environment variables with defaults
const NODE_ENV = process.env.NODE_ENV;

// Enable debugging
console.log('Starting server with configuration:');
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`HOST: ${HOST}`);
console.log(`PORT: ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// API Routes - Define these BEFORE static file serving
// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get all articles
app.get('/api/articles', async (req, res) => {
  console.log('GET /api/articles requested');
  try {
    const articles = await Article.find();
    console.log(`Found ${articles.length} articles`);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

// Get recent changes
app.get('/api/recent-changes', async (req, res) => {
  console.log('GET /api/recent-changes requested');
  try {
    const recentArticles = await Article.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .exec();
    console.log(`Found ${recentArticles.length} recent articles`);
    res.json(recentArticles);
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    res.status(500).json({ error: 'Error fetching recent changes' });
  }
});

// Get random article
app.get('/api/random-article', async (req, res) => {
  console.log('GET /api/random-article requested');
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      console.log('No articles found');
      return res.status(404).json({ error: 'No articles found' });
    }
    const random = Math.floor(Math.random() * count);
    const article = await Article.findOne().skip(random);
    console.log(`Found random article: ${article._id}`);
    res.json(article);
  } catch (error) {
    console.error('Error fetching random article:', error);
    res.status(500).json({ error: 'Error fetching random article' });
  }
});

// Get specific article
app.get('/api/articles/:id', async (req, res) => {
  console.log('GET /api/articles/:id requested for id:', req.params.id);
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      console.log('Article not found:', req.params.id);
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

// Create new article
app.post('/api/articles', async (req, res) => {
  console.log('POST /api/articles requested:', req.body);
  try {
    const article = new Article(req.body);
    await article.save();
    console.log('Created new article:', article._id);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Error creating article' });
  }
});

// Static file serving - Define AFTER API routes
// Serve JavaScript files from js directory
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res, path) => {
    res.set('Content-Type', 'application/javascript');
  }
}));

// Serve static files from root directory
app.use(express.static(__dirname, { 
  index: false,
  dotfiles: 'ignore'
}));

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/allstarswiki', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Start server with explicit binding
app.listen(PORT, HOST, () => {
  console.log('==================================');
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Host binding: ${HOST}`);
  console.log(`Port: ${PORT}`);
  console.log(`MongoDB: mongodb://mongodb:27017/allstarswiki`);
  console.log('==================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Root route handler - Define LAST
app.get('/', (req, res) => {
  console.log('Root path requested');
  res.sendFile(path.join(__dirname, 'index.html'));
});
