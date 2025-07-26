document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // НОВАЯ ЛОГИКА: ПЛАВНЫЕ ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ
    // =================================================================

    // Функция для плавного перехода по URL
    const smoothNavigate = (url) => {
        // Добавляем класс, который запускает анимацию затухания (см. style.css)
        document.body.classList.add('is-fading-out');

        // Ждем завершения анимации (400 мс, как в CSS) и только потом переходим
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    };

    // Находим все ссылки на странице
    const allLinks = document.querySelectorAll('a');

    allLinks.forEach(link => {
        // Проверяем, что ссылка внутренняя (а не на внешний сайт вроде pexels.com)
        // и не является "якорем" (#)
        if (link.hostname === window.location.hostname && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(event) {
                // Отменяем стандартное поведение ссылки
                event.preventDefault();
                const destination = this.href;
                smoothNavigate(destination);
            });
        }
    });


    // =================================================================
    // ИСПРАВЛЕННАЯ ЛОГИКА: ФОРМА ВЫБОРА СЕТИ (checking.html)
    // =================================================================
    
    const networkForm = document.querySelector('.network-form');
    // Проверяем, что мы на странице checking.html (по наличию формы и отсутствию класса connect-page)
    if (networkForm && !document.body.classList.contains('connect-page')) {
        networkForm.addEventListener('submit', function(event) {
            // Отменяем стандартную отправку формы, которая перезагружала страницу
            event.preventDefault();

            // Находим выбранную сеть
            const selectedNetwork = document.querySelector('input[name="network"]:checked').value;
            const destinationUrl = `connect.html?network=${selectedNetwork}`;

            // Используем нашу новую функцию для плавного перехода
            smoothNavigate(destinationUrl);
        });
    }

    // =================================================================
    // СТАРАЯ ЛОГИКА: Анимации, шапка и т.д. (остается без изменений)
    // =================================================================

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

    // Эффект свечения от мыши
    document.body.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // Логика для главной страницы (анимация хедера)
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
});