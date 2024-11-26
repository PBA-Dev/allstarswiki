const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection with debug logging
mongoose.set('debug', true);
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/allstarswiki';
console.log('Attempting to connect to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to MongoDB
});

// Article Schema
const articleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoints for articles
app.post('/api/articles', async (req, res) => {
  try {
    console.log('Received POST request:', req.body);
    const articleData = {
      ...req.body,
      id: `article_${Date.now()}`,
    };
    const article = new Article(articleData);
    await article.save();
    console.log('Article saved:', article);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    console.log('Fetching all articles');
    const articles = await Article.find().sort({ createdAt: -1 });
    console.log('Found articles:', articles);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article
app.get('/api/articles/:id', async (req, res) => {
  try {
    console.log('Fetching article with id:', req.params.id);
    const article = await Article.findOne({ id: req.params.id });
    if (!article) {
      console.log('Article not found:', req.params.id);
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    console.log('Updating article:', req.params.id, req.body);
    const article = await Article.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!article) {
      console.log('Article not found for update:', req.params.id);
      return res.status(404).json({ error: 'Article not found' });
    }
    console.log('Article updated:', article);
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    console.log('Deleting article:', req.params.id);
    const article = await Article.findOneAndDelete({ id: req.params.id });
    if (!article) {
      console.log('Article not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Article not found' });
    }
    console.log('Article deleted:', article);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Search articles by tag
app.get('/api/articles/search/tag/:tag', async (req, res) => {
  try {
    console.log('Searching articles by tag:', req.params.tag);
    const articles = await Article.find({ tags: req.params.tag }).sort({ createdAt: -1 });
    console.log('Found articles with tag:', articles);
    res.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
