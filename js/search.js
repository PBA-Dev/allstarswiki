document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchContainer = document.querySelector('.search-container');
    
    // Search index with categories
    const searchIndex = [
        {
            title: 'Grundpflege',
            content: 'Grundlegende Pflegemaßnahmen zur Unterstützung bei den Aktivitäten des täglichen Lebens. Körperpflege, Ernährung, Mobilität und weitere wichtige Aspekte der täglichen Pflege.',
            url: 'articles/grundpflege.html',
            category: 'Pflegepraxis'
        },
        {
            title: 'Behandlungspflege',
            content: 'Medizinische Pflegemaßnahmen nach ärztlicher Verordnung. Medikamentengabe, Wundversorgung, Injektionen und weitere medizinische Pflegeleistungen.',
            url: 'articles/behandlungspflege.html',
            category: 'Pflegepraxis'
        },
        {
            title: 'Pflegedokumentation',
            content: 'Systematische Erfassung und Dokumentation von Pflegemaßnahmen. Pflegeplanung, Dokumentationssysteme und rechtliche Grundlagen.',
            url: 'articles/pflegedokumentation.html',
            category: 'Pflegedokumentation'
        },
        {
            title: 'Pflegegrade',
            content: 'Die fünf Pflegegrade, Einstufungskriterien, Begutachtung und Leistungsansprüche in der Pflegeversicherung.',
            url: 'articles/pflegegrade.html',
            category: 'Pflegeberatung'
        },
        {
            title: 'Sozialrecht',
            content: 'Rechtliche Grundlagen der Pflege, Pflegeversicherungsrecht, Leistungsarten und Antragsverfahren.',
            url: 'articles/sozialrecht.html',
            category: 'Pflegetheorie'
        },
        {
            title: 'Hilfsmittel',
            content: 'Pflegehilfsmittel, technische Hilfen, Mobilitätshilfen und deren Kostenübernahme durch Kranken- und Pflegekassen.',
            url: 'articles/hilfsmittel.html',
            category: 'Pflegepraxis'
        }
    ];

    // Get unique categories
    const categories = [...new Set(searchIndex.map(item => item.category))];

    // Create category filter
    const categoryFilter = document.createElement('div');
    categoryFilter.className = 'category-filter';
    categoryFilter.innerHTML = `
        <select id="categorySelect">
            <option value="">Alle Kategorien</option>
            ${categories.map(category => `
                <option value="${category}">${category}</option>
            `).join('')}
        </select>
    `;
    searchContainer.appendChild(categoryFilter);

    // Recent searches
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    function addToRecentSearches(query) {
        recentSearches = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        updateSearchSuggestions();
    }

    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.display = 'none';
    searchContainer.appendChild(suggestionsContainer);

    function updateSearchSuggestions() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const suggestions = [
            ...recentSearches.filter(item => item.toLowerCase().includes(query)),
            ...searchIndex
                .filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.content.toLowerCase().includes(query))
                .map(item => item.title)
        ].slice(0, 5);

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item">${suggestion}</div>
            `).join('');
            suggestionsContainer.style.display = 'block';

            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    suggestionsContainer.style.display = 'none';
                    performSearch();
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function calculateRelevance(item, query) {
        let score = 0;
        const lQuery = query.toLowerCase();
        
        // Title match (highest weight)
        if (item.title.toLowerCase().includes(lQuery)) {
            score += 10;
            // Exact title match
            if (item.title.toLowerCase() === lQuery) {
                score += 5;
            }
        }
        
        // Content match
        if (item.content.toLowerCase().includes(lQuery)) {
            score += 5;
            // Multiple occurrences
            score += (item.content.toLowerCase().match(new RegExp(lQuery, 'g')) || []).length;
        }
        
        return score;
    }

    function performSearch() {
        const query = searchInput.value.trim();
        const selectedCategory = document.getElementById('categorySelect').value;

        if (query) {
            addToRecentSearches(query);
            
            let results = searchIndex.filter(item => {
                const matchesQuery = 
                    item.title.toLowerCase().includes(query.toLowerCase()) || 
                    item.content.toLowerCase().includes(query.toLowerCase());
                const matchesCategory = !selectedCategory || item.category === selectedCategory;
                return matchesQuery && matchesCategory;
            });

            // Sort by relevance
            results.sort((a, b) => calculateRelevance(b, query) - calculateRelevance(a, query));
            
            displayResults(results, query);
        }
    }

    function displayResults(results, query) {
        const mainContent = document.querySelector('.wiki-content');
        mainContent.innerHTML = `
            <h2>Suchergebnisse</h2>
            <p>${results.length} Ergebnisse gefunden${query ? ` für "${query}"` : ''}</p>
            ${results.length === 0 ? '<p>Keine Ergebnisse gefunden.</p>' : ''}
            <div class="search-results">
                ${results.map(result => `
                    <article class="search-result">
                        <h3><a href="${result.url}">${highlightText(result.title, query)}</a></h3>
                        <span class="category-badge">${result.category}</span>
                        <p>${highlightText(result.content, query)}</p>
                    </article>
                `).join('')}
            </div>
        `;
    }

    // Event Listeners
    searchInput.addEventListener('input', updateSearchSuggestions);
    searchInput.addEventListener('blur', () => {
        // Delay hiding suggestions to allow click events
        setTimeout(() => {
            suggestionsContainer.style.display = 'none';
        }, 200);
    });

    searchButton.addEventListener('click', performSearch);
    document.getElementById('categorySelect').addEventListener('change', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
