document.addEventListener('DOMContentLoaded', () => {

    // Mock Data for the Innovation Portfolio
    const projects = [
        {
            id: 'p1',
            title: 'Aegis Sentinel',
            category: 'AI Security',
            icon: '🛡️',
            founded: '2024',
            status: 'Series A',
            lead: 'Dr. Alan Turing',
            excerpt: 'An AI-driven threat detection system that anticipates zero-day vulnerabilities before they are exploited.',
            description: '<p>Aegis Sentinel was born out of the IDR incubator in late 2024. The core premise was to shift threat detection from a reactive to a predictive model using advanced machine learning.</p><p>By analyzing petabytes of global network traffic data, Aegis can identify the subtle behavioral anomalies that precede a zero-day exploit. The project recently secured Series A funding and is currently deployed in beta across three major financial institutions.</p>'
        },
        {
            id: 'p2',
            title: 'ComplianceChain',
            category: 'RegTech',
            icon: '🔗',
            founded: '2025',
            status: 'Seed Funded',
            lead: 'Sarah Jenkins',
            excerpt: 'A blockchain-based audit trail designed to automate compliance reporting for the EU AI Act.',
            description: '<p>ComplianceChain tackles the massive administrative overhead introduced by recent global regulations, specifically the EU AI Act and GDPR updates.</p><p>It provides an immutable ledger where every data processing decision made by an AI model is cryptographically logged. This allows regulators to conduct instant, automated audits, saving organizations millions in compliance costs.</p>'
        },
        {
            id: 'p3',
            title: 'Whisper Vault',
            category: 'Data Privacy',
            icon: '🤫',
            founded: '2025',
            status: 'Incubating',
            lead: 'Marcus Thorne',
            excerpt: 'Next-generation differential privacy tools for training Large Language Models on sensitive healthcare data.',
            description: '<p>Training LLMs on medical data traditionally poses severe privacy risks. Whisper Vault introduces a novel mathematical approach to differential privacy that guarantees patient anonymity without sacrificing model accuracy.</p><p>Currently in the incubation phase, the team is partnering with the National Health Service (NHS) to run initial pilot programs.</p>'
        },
        {
            id: 'p4',
            title: 'Q-Shield',
            category: 'Quantum Defenses',
            icon: '⚛️',
            founded: '2026',
            status: 'Research Phase',
            lead: 'Dr. Wei Chen',
            excerpt: 'Post-quantum cryptographic algorithms designed for legacy banking infrastructure.',
            description: '<p>As quantum computing nears the point of breaking traditional RSA encryption, Q-Shield provides a bridge for legacy systems. It offers a suite of post-quantum cryptographic algorithms that can be retrofitted into existing banking mainframes.</p><p>The project is currently in the applied research phase, working closely with academic partners to peer-review the mathematical proofs.</p>'
        },
        {
            id: 'p5',
            title: 'TrustScore API',
            category: 'RegTech',
            icon: '⚖️',
            founded: '2024',
            status: 'Acquired',
            lead: 'Elena Rostova',
            excerpt: 'A real-time vendor risk assessment API that analyzes digital supply chain vulnerabilities.',
            description: '<p>TrustScore API revolutionized how enterprises assess third-party risk. Instead of static annual questionnaires, TrustScore continuously monitors vendors for security misconfigurations and data leaks.</p><p>The project was successfully acquired by a major cybersecurity firm in early 2026, marking one of IDR\'s most successful exits to date.</p>'
        },
        {
            id: 'p6',
            title: 'NeuroGuard',
            category: 'AI Security',
            icon: '🧠',
            founded: '2026',
            status: 'Incubating',
            lead: 'James Foster',
            excerpt: 'Defending neural networks against adversarial attacks and model poisoning.',
            description: '<p>NeuroGuard focuses specifically on the integrity of the AI models themselves. By injecting controlled "noise" during the training phase, NeuroGuard immunizes models against adversarial examples—inputs designed to trick the AI into making incorrect classifications.</p><p>The framework is open-source and rapidly gaining traction in the autonomous vehicle sector.</p>'
        }
    ];

    const gridContainer = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Render Grid
    const renderProjects = (filterCategory = 'All') => {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        const filtered = filterCategory === 'All' 
            ? projects 
            : projects.filter(p => p.category === filterCategory);

        if (filtered.length === 0) {
            gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-gray);">No projects found in this category.</div>';
            return;
        }

        filtered.forEach((project, index) => {
            // Determine CSS class based on category for color coding
            let catClass = '';
            if (project.category === 'AI Security') catClass = 'cat-ai-security';
            if (project.category === 'RegTech') catClass = 'cat-regtech';
            if (project.category === 'Data Privacy') catClass = 'cat-data-privacy';
            if (project.category === 'Quantum Defenses') catClass = 'cat-quantum';

            const delay = index * 0.1;

            const card = document.createElement('div');
            card.className = 'portfolio-card fade-in';
            card.style.animationDelay = `${delay}s`;
            card.setAttribute('data-id', project.id);
            
            card.innerHTML = `
                <div class="card-visual">
                    ${project.icon}
                </div>
                <div class="card-content">
                    <span class="project-category ${catClass}">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p>${project.excerpt}</p>
                </div>
            `;
            
            gridContainer.appendChild(card);
        });
    };

    // Initialize
    renderProjects();

    // Filter Logic
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProjects(btn.getAttribute('data-filter'));
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById('project-modal');
    
    if (gridContainer && modal) {
        gridContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (!card) return;

            const projectId = card.getAttribute('data-id');
            const project = projects.find(p => p.id === projectId);

            if (project) {
                // Populate Modal Data
                document.getElementById('modal-icon').textContent = project.icon;
                document.getElementById('modal-title').textContent = project.title;
                
                const catEl = document.getElementById('modal-category');
                catEl.textContent = project.category;
                catEl.className = 'project-category'; // Reset classes
                if (project.category === 'AI Security') catEl.classList.add('cat-ai-security');
                if (project.category === 'RegTech') catEl.classList.add('cat-regtech');
                if (project.category === 'Data Privacy') catEl.classList.add('cat-data-privacy');
                if (project.category === 'Quantum Defenses') catEl.classList.add('cat-quantum');

                document.getElementById('modal-founded').textContent = project.founded;
                document.getElementById('modal-status').textContent = project.status;
                document.getElementById('modal-lead').textContent = project.lead;
                
                document.getElementById('modal-description').innerHTML = project.description;

                // Show Modal
                modal.classList.remove('hidden');
            }
        });

        // Close logic
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
        
        // Mock visit button
        const visitBtn = document.getElementById('btn-visit-project');
        if (visitBtn) {
            visitBtn.addEventListener('click', () => {
                alert('In a production environment, this would navigate to the project\'s external website.');
            });
        }
    }
});
