document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    const headerTitle = document.getElementById('dashboard-header-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding tab content
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            
            // Update header title
            headerTitle.textContent = link.textContent.trim();
        });
    });

    // Mock download functionality
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Downloading...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Downloaded ✓';
                btn.style.color = '#28a745';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.color = '';
                }, 2000);
            }, 1000);
        });
    });

    // --- Forum Logic ---
    const forumThreads = [
        { id: 1, title: 'How is everyone preparing for the new EU AI Act?', author: 'Sarah Jenkins', category: 'Cyber Trends', replies: 14, lastActive: '2h ago', icon: '🇪🇺' },
        { id: 2, title: 'Looking for a Senior Risk Analyst (Remote, UK)', author: 'Marcus Thorne', category: 'Job Board', replies: 3, lastActive: '5h ago', icon: '💼' },
        { id: 3, title: 'Hello from Singapore! New member introduction.', author: 'Wei Chen', category: 'Introductions', replies: 8, lastActive: '1d ago', icon: '👋' },
        { id: 4, title: 'The impact of quantum computing on current encryption standards', author: 'Dr. Alan Turing', category: 'Cyber Trends', replies: 42, lastActive: '2d ago', icon: '⚛️' }
    ];

    const threadsContainer = document.getElementById('forum-threads-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const renderThreads = (filterCategory = 'All') => {
        if (!threadsContainer) return;
        threadsContainer.innerHTML = '';
        
        const filtered = filterCategory === 'All' 
            ? forumThreads 
            : forumThreads.filter(t => t.category === filterCategory);
            
        if (filtered.length === 0) {
            threadsContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-gray);">No topics found in this category.</div>';
            return;
        }

        filtered.forEach(thread => {
            const catClass = 'cat-' + thread.category.toLowerCase().replace(' ', '-');
            const threadEl = document.createElement('div');
            threadEl.className = 'forum-thread fade-in';
            threadEl.innerHTML = `
                <div class="thread-icon">${thread.icon}</div>
                <div class="f-col-main thread-info">
                    <div class="thread-title">${thread.title}</div>
                    <div class="thread-meta">
                        <span class="thread-category ${catClass}">${thread.category}</span>
                        Started by ${thread.author}
                    </div>
                </div>
                <div class="f-col-stat hide-mobile thread-replies">${thread.replies}</div>
                <div class="f-col-stat hide-mobile thread-activity">${thread.lastActive}</div>
            `;
            threadsContainer.appendChild(threadEl);
        });
    };

    // Initialize forum
    renderThreads();

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderThreads(btn.getAttribute('data-category'));
        });
    });

    // Modal Logic
    const newTopicModal = document.getElementById('new-topic-modal');
    const btnNewTopic = document.getElementById('btn-new-topic');
    const newTopicForm = document.getElementById('new-topic-form');

    if (btnNewTopic && newTopicModal) {
        btnNewTopic.addEventListener('click', () => {
            newTopicModal.classList.remove('hidden');
        });
        
        // Close modal logic is shared, but we can add it here explicitly if needed
        const closeBtn = newTopicModal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            newTopicModal.classList.add('hidden');
        });
        
        newTopicModal.addEventListener('click', (e) => {
            if (e.target === newTopicModal) newTopicModal.classList.add('hidden');
        });
    }

    if (newTopicForm) {
        newTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('topic-title').value;
            const category = document.getElementById('topic-category').value;
            
            // Generate mock post
            const newPost = {
                id: Date.now(),
                title: title,
                author: 'John Doe (You)',
                category: category,
                replies: 0,
                lastActive: 'Just now',
                icon: '💬'
            };
            
            forumThreads.unshift(newPost);
            
            // Reset filters to All
            filterBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-category="All"]').classList.add('active');
            
            // Re-render
            renderThreads();
            
            // Close and reset
            newTopicForm.reset();
            newTopicModal.classList.add('hidden');
            
            // Highlight the new post
            const newEl = threadsContainer.firstElementChild;
            newEl.style.backgroundColor = 'rgba(255, 107, 0, 0.2)';
            setTimeout(() => {
                newEl.style.backgroundColor = '';
            }, 2000);
        });
    }
});
