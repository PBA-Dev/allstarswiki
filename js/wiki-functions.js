// Function to show recent changes
async function showRecentChanges() {
    try {
        console.log('Fetching recent changes...');
        const response = await fetch('/api/recent-changes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const articles = await response.json();
        console.log('Recent changes received:', articles.length, 'articles');
        
        // Clear existing articles
        const articleGrid = document.getElementById('articleGrid');
        if (!articleGrid) {
            console.error('Article grid element not found!');
            return;
        }
        
        articleGrid.innerHTML = '<h2>Aktuelle Änderungen</h2>';
        
        // Display recent articles
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            const date = new Date(article.updatedAt).toLocaleDateString('de-DE');
            
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p class="article-meta">Zuletzt aktualisiert: ${date}</p>
                <p class="article-preview">${article.content.substring(0, 150)}...</p>
                <button onclick="viewArticle('${article._id}')" class="btn-secondary">Artikel lesen</button>
            `;
            articleGrid.appendChild(articleCard);
        });
    } catch (error) {
        console.error('Error fetching recent changes:', error);
        alert('Fehler beim Laden der aktuellen Änderungen');
    }
}

// Function to open a random article
async function openRandomArticle() {
    try {
        console.log('Fetching random article...');
        const response = await fetch('/api/random-article');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const article = await response.json();
        console.log('Random article received:', article._id);
        
        if (article) {
            const articleGrid = document.getElementById('articleGrid');
            if (!articleGrid) {
                console.error('Article grid element not found!');
                return;
            }
            
            articleGrid.innerHTML = '<h2>Zufälliger Artikel</h2>';
            
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            const date = new Date(article.updatedAt).toLocaleDateString('de-DE');
            
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p class="article-meta">Zuletzt aktualisiert: ${date}</p>
                <p class="article-preview">${article.content.substring(0, 150)}...</p>
                <button onclick="viewArticle('${article._id}')" class="btn-secondary">Artikel lesen</button>
            `;
            articleGrid.appendChild(articleCard);
        } else {
            alert('Keine Artikel verfügbar');
        }
    } catch (error) {
        console.error('Error fetching random article:', error);
        alert('Fehler beim Laden eines zufälligen Artikels');
    }
}

// Function to view a specific article
async function viewArticle(articleId) {
    try {
        console.log('Fetching article:', articleId);
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const article = await response.json();
        console.log('Article received:', article._id);
        
        const articleGrid = document.getElementById('articleGrid');
        if (!articleGrid) {
            console.error('Article grid element not found!');
            return;
        }
        
        articleGrid.innerHTML = '';
        
        const articleView = document.createElement('div');
        articleView.className = 'article-full';
        const date = new Date(article.updatedAt).toLocaleDateString('de-DE');
        
        articleView.innerHTML = `
            <h2>${article.title}</h2>
            <p class="article-meta">Zuletzt aktualisiert: ${date}</p>
            <div class="article-content">${article.content}</div>
            <button onclick="loadAllArticles()" class="btn-secondary">Zurück zur Übersicht</button>
        `;
        articleGrid.appendChild(articleView);
    } catch (error) {
        console.error('Error viewing article:', error);
        alert('Fehler beim Laden des Artikels');
    }
}

// Function to load all articles
async function loadAllArticles() {
    try {
        console.log('Loading all articles...');
        const response = await fetch('/api/articles');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const articles = await response.json();
        console.log('All articles received:', articles.length, 'articles');
        
        const articleGrid = document.getElementById('articleGrid');
        if (!articleGrid) {
            console.error('Article grid element not found!');
            return;
        }
        
        articleGrid.innerHTML = '<h2>Alle Artikel</h2>';
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            const date = new Date(article.updatedAt).toLocaleDateString('de-DE');
            
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p class="article-meta">Zuletzt aktualisiert: ${date}</p>
                <p class="article-preview">${article.content.substring(0, 150)}...</p>
                <button onclick="viewArticle('${article._id}')" class="btn-secondary">Artikel lesen</button>
            `;
            articleGrid.appendChild(articleCard);
        });
    } catch (error) {
        console.error('Error loading articles:', error);
        alert('Fehler beim Laden der Artikel');
    }
}

// Load articles when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    loadAllArticles();
});
