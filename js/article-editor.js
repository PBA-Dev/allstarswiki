document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE
    tinymce.init({
        selector: '#articleContent',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        images_upload_url: 'upload.php', // You'll need to implement this endpoint
        automatic_uploads: true,
        images_reuse_filename: true,
        height: 500,
        menubar: true,
        // Add a custom button for local image upload
        setup: function(editor) {
            editor.ui.registry.addButton('localimage', {
                text: 'Upload Local Image',
                onAction: function() {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    
                    input.onchange = function() {
                        const file = this.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const base64 = e.target.result;
                                editor.insertContent(`<img src="${base64}" alt="Uploaded Image">`);
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    
                    input.click();
                }
            });
        },
        toolbar_mode: 'sliding',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 16px; line-height: 1.6; }'
    });

    const articleForm = document.getElementById('articleForm');

    articleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('articleTitle').value;
        const category = document.getElementById('articleCategory').value;
        const content = tinymce.activeEditor.getContent(); // Get content from TinyMCE

        // Basic validation
        if (!title.trim() || !category || !content.trim()) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        // Create article object
        const article = {
            title: title,
            category: category,
            content: content,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        // Store article in localStorage
        let articles = JSON.parse(localStorage.getItem('wikiArticles') || '[]');
        articles.push(article);
        localStorage.setItem('wikiArticles', JSON.stringify(articles));

        // Redirect to homepage after saving
        alert('Artikel wurde erfolgreich gespeichert!');
        window.location.href = 'index.html';
    });
});
