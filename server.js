const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const host = '0.0.0.0';  // Always bind to all interfaces
const port = process.env.PORT || 3000;

// Enable debugging
console.log('Starting server...');
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);

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

// Test route to verify server is responding
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.get('/api/articles', async (req, res) => {
  console.log('GET /api/articles requested');
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

app.post('/api/articles', async (req, res) => {
  console.log('POST /api/articles requested:', req.body);
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Error creating article' });
  }
});

// Get specific article endpoint
app.get('/api/articles/:id', async (req, res) => {
  console.log('GET /api/articles/:id requested for id:', req.params.id);
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

// Recent changes endpoint
app.get('/api/recent-changes', async (req, res) => {
  console.log('GET /api/recent-changes requested');
  try {
    const recentArticles = await Article.find()
      .sort({ updatedAt: -1 })
      .limit(10);
    res.json(recentArticles);
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    res.status(500).json({ error: 'Error fetching recent changes' });
  }
});

// Random article endpoint
app.get('/api/random-article', async (req, res) => {
  console.log('GET /api/random-article requested');
  try {
    const count = await Article.countDocuments();
    const random = Math.floor(Math.random() * count);
    const article = await Article.findOne().skip(random);
    res.json(article);
  } catch (error) {
    console.error('Error fetching random article:', error);
    res.status(500).json({ error: 'Error fetching random article' });
  }
});

// Serve static files
console.log('Static files directory:', __dirname);
app.use(express.static(__dirname, { 
  index: false,
  dotfiles: 'ignore',
  extensions: ['html', 'htm']
}));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/allstarswiki';
console.log('MongoDB URI:', mongoURI);

const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Initial connection attempt
connectWithRetry();

// Root route handler (before catch-all)
app.get('/', (req, res) => {
  console.log('Root path requested');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve index.html for all other routes (must be last)
app.get('*', (req, res) => {
  console.log('Serving index.html for path:', req.path);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const server = app.listen(port, host, () => {
  console.log('==================================');
  console.log(`Server running at http://${host}:${port}`);
  console.log(`Current directory: ${__dirname}`);
  console.log(`MongoDB URI: ${mongoURI}`);
  console.log('==================================');
});
