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
});
