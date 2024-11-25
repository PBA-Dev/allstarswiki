document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // Search index - would be populated with all article content
    const searchIndex = [
        {
            title: 'Grundpflege',
            content: 'Grundlegende Pflegemaßnahmen zur Unterstützung bei den Aktivitäten des täglichen Lebens.',
            url: 'articles/grundpflege.html'
        },
        {
            title: 'Behandlungspflege',
            content: 'Medizinische Pflegemaßnahmen nach ärztlicher Verordnung.',
            url: 'articles/behandlungspflege.html'
        },
        {
            title: 'Pflegedokumentation',
            content: 'Systematische Erfassung und Dokumentation von Pflegemaßnahmen.',
            url: 'articles/pflegedokumentation.html'
        }
    ];

    function performSearch(query) {
        query = query.toLowerCase();
        return searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query)
        );
    }

    function displayResults(results) {
        const mainContent = document.querySelector('.wiki-content');
        mainContent.innerHTML = `
            <h2>Suchergebnisse</h2>
            ${results.length === 0 ? '<p>Keine Ergebnisse gefunden.</p>' : ''}
            <div class="search-results">
                ${results.map(result => `
                    <article class="search-result">
                        <h3><a href="${result.url}">${result.title}</a></h3>
                        <p>${result.content}</p>
                    </article>
                `).join('')}
            </div>
        `;
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const results = performSearch(query);
            displayResults(results);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const results = performSearch(query);
                displayResults(results);
            }
        }
    });
});
