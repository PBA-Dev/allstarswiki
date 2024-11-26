const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000;

// Create data directories if they don't exist
const dataDir = path.join(__dirname, 'data');
const articlesDir = path.join(dataDir, 'articles');

async function ensureDirectories() {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir(articlesDir, { recursive: true });
    } catch (error) {
        console.error('Error creating directories:', error);
    }
}

ensureDirectories();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoints for articles
app.post('/api/articles', async (req, res) => {
    try {
        const article = req.body;
        article.id = `article_${new Date().getTime()}`;
        article.createdAt = new Date().toISOString();
        article.updatedAt = new Date().toISOString();

        const filePath = path.join(articlesDir, `${article.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(article, null, 2));

        res.status(201).json(article);
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const files = await fs.readdir(articlesDir);
        const articles = await Promise.all(
            files
                .filter(file => file.endsWith('.json'))
                .map(async file => {
                    const content = await fs.readFile(path.join(articlesDir, file), 'utf-8');
                    return JSON.parse(content);
                })
        );
        res.json(articles);
    } catch (error) {
        console.error('Error getting articles:', error);
        res.status(500).json({ error: 'Failed to get articles' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    try {
        const filePath = path.join(articlesDir, `${req.params.id}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error('Error getting article:', error);
        res.status(404).json({ error: 'Article not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
