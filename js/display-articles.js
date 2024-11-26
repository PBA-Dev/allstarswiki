document.addEventListener('DOMContentLoaded', async function() {
    const articleGrid = document.getElementById('articleGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let articles = [];
    let filteredArticles = [];
    
    async function loadArticles() {
        try {
            // Get articles using ArticleStorage
            articles = await ArticleStorage.getAllArticles();
            filteredArticles = [...articles];
            displayArticles();
        } catch (error) {
            console.error('Error loading articles:', error);
            articleGrid.innerHTML = '<div class="error">Fehler beim Laden der Artikel</div>';
        }
    }
    
    function getFirstImage(content) {
        const div = document.createElement('div');
        div.innerHTML = content;
        const img = div.querySelector('img');
        return img ? img.src : null;
    }
    
    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    
    function createArticlePreview(article) {
        const previewText = stripHtml(article.content).substring(0, 150) + '...';
        const imageSrc = getFirstImage(article.content);
        
        const articleElement = document.createElement('article');
        articleElement.className = 'featured-article';
        
        let imageHtml = '';
        if (imageSrc) {
            imageHtml = `<img src="${imageSrc}" alt="" class="article-preview-image">`;
        }
        
        articleElement.innerHTML = `
            ${imageHtml}
            <h3>${article.title}</h3>
            <p>${previewText}</p>
            <div class="article-meta">
                <span>Kategorie: ${article.category}</span>
                <span>${new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <a href="#" class="read-more" onclick="viewArticle('${article.id}'); return false;">Weiterlesen →</a>
        `;
        
        return articleElement;
    }
    
    function displayArticles() {
        articleGrid.innerHTML = '';
        
        if (filteredArticles.length === 0) {
            articleGrid.innerHTML = '<div class="no-results">Keine Artikel gefunden</div>';
            return;
        }
        
        filteredArticles.forEach((article) => {
            const articleElement = createArticlePreview(article);
            articleGrid.appendChild(articleElement);
        });
    }
    
    async function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        
        try {
            filteredArticles = await ArticleStorage.searchArticles(searchTerm, selectedCategory);
            displayArticles();
        } catch (error) {
            console.error('Error filtering articles:', error);
            articleGrid.innerHTML = '<div class="error">Fehler beim Filtern der Artikel</div>';
        }
    }
    
    window.viewArticle = async function(articleId) {
        try {
            const article = await ArticleStorage.getArticle(articleId);
            if (article) {
                localStorage.setItem('currentArticle', JSON.stringify(article));
                window.location.href = 'view-article.html';
            }
        } catch (error) {
            console.error('Error viewing article:', error);
            alert('Fehler beim Laden des Artikels');
        }
    };
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterArticles);
    }
    
    // Initial load
    loadArticles();
});
