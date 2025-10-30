// scriptTemplete/botaoModoEscuro.js
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (darkModeToggle) darkModeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            if (darkModeToggle) darkModeToggle.textContent = '🌙';
        }
    }

    function toggleDarkMode() {
        if (body.classList.contains('dark-mode')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    // Aplica o tema salvo ou detecta o padrão do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    // Só adiciona o evento se o botão existir (ou seja, no dashboard)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
});
