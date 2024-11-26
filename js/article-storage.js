// Article storage management using backend API
class ArticleStorage {
    static API_BASE_URL = '/api';

    static async saveArticle(article) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article)
            });

            if (!response.ok) {
                throw new Error('Failed to save article');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving article:', error);
            throw error;
        }
    }

    static async getArticle(articleId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/articles/${articleId}`);
            if (!response.ok) {
                throw new Error('Article not found');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting article:', error);
            throw error;
        }
    }

    static async getAllArticles() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/articles`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting all articles:', error);
            return [];
        }
    }

    static async searchArticles(query, category = null) {
        try {
            const articles = await this.getAllArticles();
            return articles.filter(article => {
                const matchesQuery = !query || 
                    article.title.toLowerCase().includes(query.toLowerCase()) ||
                    article.content.toLowerCase().includes(query.toLowerCase());
                
                const matchesCategory = !category || article.category === category;
                
                return matchesQuery && matchesCategory;
            });
        } catch (error) {
            console.error('Error searching articles:', error);
            return [];
        }
    }

    static async deleteArticle(articleId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/articles/${articleId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete article');
            }
            return true;
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    }
}
