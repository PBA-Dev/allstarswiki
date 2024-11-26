// Function to show recent changes
async function showRecentChanges() {
    try {
        const response = await fetch('/api/recent-changes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const articles = await response.json();
        
        // Clear existing articles
        const articleGrid = document.getElementById('articleGrid');
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
        const response = await fetch('/api/random-article');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const article = await response.json();
        
        if (article) {
            // Clear existing articles and show the random one
            const articleGrid = document.getElementById('articleGrid');
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
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const article = await response.json();
        
        // Clear existing content and show the full article
        const articleGrid = document.getElementById('articleGrid');
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
