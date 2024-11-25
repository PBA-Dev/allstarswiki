document.addEventListener('DOMContentLoaded', function() {
    const articleGrid = document.getElementById('articleGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    let articles = [];
    let filteredArticles = [];
    
    function loadArticles() {
        // Get articles from localStorage
        articles = JSON.parse(localStorage.getItem('wikiArticles') || '[]');
        filteredArticles = [...articles];
        displayArticles();
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
    
    function createArticlePreview(article, index) {
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
            <a href="#" class="read-more" onclick="viewArticle(${index}); return false;">Weiterlesen →</a>
        `;
        
        return articleElement;
    }
    
    function displayArticles() {
        articleGrid.innerHTML = '';
        
        if (filteredArticles.length === 0) {
            articleGrid.innerHTML = '<div class="no-results">Keine Artikel gefunden</div>';
            return;
        }
        
        filteredArticles.forEach((article, index) => {
            const articleElement = createArticlePreview(article, index);
            articleGrid.appendChild(articleElement);
        });
    }
    
    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        
        filteredArticles = articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                                stripHtml(article.content).toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || article.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        displayArticles();
    }
    
    window.viewArticle = function(index) {
        localStorage.setItem('currentArticle', JSON.stringify(filteredArticles[index]));
        window.location.href = 'view-article.html';
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
