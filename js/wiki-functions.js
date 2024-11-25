function showRecentChanges() {
    const articles = JSON.parse(localStorage.getItem('wikiArticles') || '[]');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentArticles = articles.filter(article => {
        const articleDate = new Date(article.lastModified || article.createdAt);
        return articleDate >= thirtyDaysAgo;
    }).sort((a, b) => {
        const dateA = new Date(a.lastModified || a.createdAt);
        const dateB = new Date(b.lastModified || b.createdAt);
        return dateB - dateA;
    });

    if (recentArticles.length === 0) {
        alert('Keine Änderungen in den letzten 30 Tagen gefunden.');
        return;
    }

    // Store recent articles and redirect to news page
    localStorage.setItem('recentArticles', JSON.stringify(recentArticles));
    window.location.href = 'news.html';
}

function openRandomArticle() {
    const articles = JSON.parse(localStorage.getItem('wikiArticles') || '[]');
    
    if (articles.length === 0) {
        alert('Keine Artikel verfügbar.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * articles.length);
    const randomArticle = articles[randomIndex];

    // Store selected article and redirect to view page
    localStorage.setItem('currentArticle', JSON.stringify(randomArticle));
    window.location.href = 'view-article.html';
}
