document.addEventListener('DOMContentLoaded', () => {
    // Generate table of contents for articles
    const article = document.querySelector('.article-content');
    if (article) {
        const headings = article.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            const toc = document.createElement('div');
            toc.className = 'table-of-contents';
            toc.innerHTML = '<h2>Inhaltsverzeichnis</h2><ul></ul>';
            
            const tocList = toc.querySelector('ul');
            
            headings.forEach((heading, index) => {
                // Add ID to heading
                heading.id = `section-${index}`;
                
                // Create TOC entry
                const li = document.createElement('li');
                li.className = `toc-${heading.tagName.toLowerCase()}`;
                
                const link = document.createElement('a');
                link.href = `#section-${index}`;
                link.textContent = heading.textContent;
                
                li.appendChild(link);
                tocList.appendChild(li);
            });
            
            // Insert TOC after article title
            const title = article.querySelector('h1');
            if (title) {
                title.after(toc);
            } else {
                article.prepend(toc);
            }
        }
    }
});
