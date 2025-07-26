document.addEventListener("DOMContentLoaded", function() {
    
    // Intersection Observer для анимации при скролле
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => observer.observe(el));

    // --- Эффект свечения от мыши ---
    document.body.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // --- Логика для главной страницы (анимация хедера) ---
    if (document.body.classList.contains('home-page')) {
        const header = document.querySelector('.main-header');
        if (header) { 
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    }

    // --- Логика для страницы выбора сети (checking.html) ---
    const networkForm = document.querySelector('.network-form');
    if (networkForm && window.location.pathname.includes('checking.html')) {
        networkForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const selectedNetwork = document.querySelector('input[name="network"]:checked').value;
            window.location.href = `connect.html?network=${selectedNetwork}`;
        });
    }
});