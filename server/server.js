const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ARTICLES_FILE = path.join(__dirname, 'data', 'articles.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// Ensure data directory and articles file exist
async function initializeDataDirectory() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        try {
            await fs.access(ARTICLES_FILE);
        } catch {
            await fs.writeFile(ARTICLES_FILE, '[]');
        }
    } catch (error) {
        console.error('Error initializing data directory:', error);
    }
}

// Initialize data directory when server starts
initializeDataDirectory();

// Read articles
async function readArticles() {
    try {
        const data = await fs.readFile(ARTICLES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading articles:', error);
        return [];
    }
}

// Write articles
async function writeArticles(articles) {
    try {
        await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    } catch (error) {
        console.error('Error writing articles:', error);
        throw error;
    }
}

// API Routes
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await readArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get articles' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    try {
        const articles = await readArticles();
        const article = articles.find(a => a.id === req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get article' });
    }
});

app.post('/api/articles', async (req, res) => {
    try {
        const articles = await readArticles();
        const article = req.body;
        
        if (!article.id) {
            article.id = Date.now().toString();
        }
        article.lastModified = new Date().toISOString();

        const existingIndex = articles.findIndex(a => a.id === article.id);
        if (existingIndex >= 0) {
            articles[existingIndex] = article;
        } else {
            articles.push(article);
        }

        await writeArticles(articles);
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.delete('/api/articles/:id', async (req, res) => {
    try {
        const articles = await readArticles();
        const filteredArticles = articles.filter(a => a.id !== req.params.id);
        await writeArticles(filteredArticles);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
