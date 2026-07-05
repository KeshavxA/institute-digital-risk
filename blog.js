document.addEventListener('DOMContentLoaded', () => {

    const blogCatalog = [
        {
            id: 'future-of-digital-risk',
            title: 'The Future of Digital Risk in 2026',
            excerpt: 'The landscape of digital risk is rapidly evolving. As we move deeper into 2026, organizations face an unprecedented convergence of threats from artificial intelligence...',
            category: 'Research',
            readTime: '5 min read',
            date: 'June 26, 2026'
        },
        {
            id: 'cyber-governance-report',
            title: 'Cyber Governance Report: Q3 Update',
            excerpt: 'Effective cyber governance is no longer just an IT issue; it is a critical board-level mandate. Our latest Q3 report highlights the shifting responsibilities of executives...',
            category: 'Report',
            readTime: '8 min read',
            date: 'June 10, 2026'
        }
    ];

    const blogGrid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('blog-search');
    const categoryFiltersContainer = document.getElementById('category-filters');

    if (blogGrid) {
        let activeCategory = 'All';
        let searchQuery = '';

        const categories = ['All', ...new Set(blogCatalog.map(article => article.category))];

        if (categoryFiltersContainer) {
            categoryFiltersContainer.innerHTML = '';
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = `filter-btn ${cat === 'All' ? 'active' : ''}`;
                btn.textContent = cat;
                btn.dataset.category = cat;

                btn.addEventListener('click', () => {

                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    activeCategory = cat;
                    renderBlogGrid();
                });

                categoryFiltersContainer.appendChild(btn);
            });
        }
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                renderBlogGrid();
            });
        }

        const renderBlogGrid = () => {
            blogGrid.innerHTML = '';

            // Filter catalog
            const filteredCatalog = blogCatalog.filter(article => {
                const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
                const matchesSearch = article.title.toLowerCase().includes(searchQuery) ||
                    article.excerpt.toLowerCase().includes(searchQuery);
                return matchesCategory && matchesSearch;
            });

            if (filteredCatalog.length === 0) {
                blogGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No insights found matching your criteria.</div>';
                return;
            }

            filteredCatalog.forEach(article => {
                const card = document.createElement('div');
                card.className = 'card blog-card reveal active visible';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';

                card.innerHTML = `
                    <div class="blog-meta">
                        <span class="blog-category">${article.category}</span>
                        <span>${article.readTime}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-gray);">${article.date}</div>
                    <a href="article.html?id=${article.id}" class="btn btn-secondary btn-block">Read Article</a>
                `;
                blogGrid.appendChild(card);
            });
        };

        // Initial render
        renderBlogGrid();
    }

    // Logic for article.html: Fetch and render markdown
    const articleContent = document.getElementById('article-content');
    const articleHeader = document.getElementById('article-header');

    if (articleContent) {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            articleContent.innerHTML = '<div class="text-center"><h2>Article not found.</h2><a href="blog.html" class="btn btn-primary" style="margin-top: 2rem;">Return to Insights</a></div>';
            return;
        }

        // Find metadata from catalog
        const metadata = blogCatalog.find(a => a.id === articleId);

        if (metadata && articleHeader) {
            articleHeader.innerHTML = `
                <div class="blog-meta" style="justify-content: center; gap: 2rem; margin-bottom: 1.5rem; font-size: 1rem;">
                    <span class="blog-category" style="font-size: 0.9rem;">${metadata.category}</span>
                    <span>${metadata.date}</span>
                    <span>${metadata.readTime}</span>
                </div>
                <!-- Title is handled by the markdown H1, but we could inject it here -->
            `;
        }

        // Fetch the markdown file
        fetch(`content/${articleId}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(markdown => {
                // Parse markdown using marked.js
                // Note: Ensure marked is loaded in the HTML head
                if (typeof marked !== 'undefined') {
                    articleContent.innerHTML = marked.parse(markdown);
                } else {
                    articleContent.innerHTML = '<p>Error: Markdown parser not loaded.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching markdown:', error);
                articleContent.innerHTML = '<div class="text-center"><h2>Failed to load article content.</h2><p>Please try again later.</p></div>';
            });
    }
});
