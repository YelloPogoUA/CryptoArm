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

    // --- ИЗМЕНЕНИЕ: Добавлен эффект свечения от мыши ---
    // Этот код отслеживает движение курсора по экрану и обновляет
    // CSS-переменные '--mouse-x' и '--mouse-y' в реальном времени.
    // CSS использует эти переменные для позиционирования фонового градиента.
    document.body.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });
    // --- КОНЕЦ ИЗМЕНЕНИЯ ---

    // Изменение хедера при скролле
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

});