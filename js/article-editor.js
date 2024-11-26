document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Schreiben Sie hier Ihren Artikel...',
        theme: 'snow'
    });

    // Handle image upload
    quill.getModule('toolbar').addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
    });

    // Handle form submission
    document.getElementById('articleForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const title = document.getElementById('articleTitle').value;
        const category = document.getElementById('articleCategory').value;
        const content = quill.root.innerHTML;

        // Basic validation
        if (!title.trim() || !category || !content.trim()) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        try {
            // Create article object
            const article = {
                title: title,
                category: category,
                content: content,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            // Save article using ArticleStorage
            await ArticleStorage.saveArticle(article);
            
            // Show success message and redirect
            alert('Artikel erfolgreich gespeichert!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Fehler beim Speichern des Artikels. Bitte versuchen Sie es erneut.');
        }
    });
});
