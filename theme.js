document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('idr_theme');
    const isLightMode = savedTheme === 'light';

    if (isLightMode) {
        document.documentElement.classList.add('light-mode');
    }

    // Attach logic to toggle button if it exists on the page
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Set initial icon
        themeToggle.textContent = isLightMode ? '🌙' : '☀️';

        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
            const currentlyLight = document.documentElement.classList.contains('light-mode');
            
            // Save preference
            localStorage.setItem('idr_theme', currentlyLight ? 'light' : 'dark');
            
            // Update icon
            themeToggle.textContent = currentlyLight ? '🌙' : '☀️';
            
            // Optional: rotate animation reset hack
            themeToggle.style.transform = 'rotate(-180deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }

    // Add Scroll to Top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
