document.addEventListener("DOMContentLoaded", function() {

    // =================================================================
    // ЛОГИКА ПЕРЕКЛЮЧАТЕЛЯ ТЕМ (НОВЫЙ БЛОК)
    // =================================================================
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = themeSwitcher ? themeSwitcher.querySelector('i') : null;

    // Функция для применения темы и сохранения выбора
    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
        if(themeIcon) {
            themeIcon.className = `fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`;
        }
        localStorage.setItem('theme', theme);
    };

    // Проверяем сохраненную тему при загрузке
    const savedTheme = localStorage.getItem('theme') || 'dark'; // 'dark' - тема по умолчанию
    applyTheme(savedTheme);

    // Добавляем обработчик на кнопку
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.dataset.theme;
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // =================================================================
    // ЛОГИКА ПЛАВНЫХ ПЕРЕХОДОВ МЕЖДУ СТРАНИЦАМИ
    // =================================================================
    const smoothNavigate = (url) => {
        document.body.classList.add('is-fading-out');
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    };

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && link.hostname === window.location.hostname && !href.startsWith('#') && link.target !== '_blank') {
            link.addEventListener('click', function(event) {
                if (link.classList.contains('is-active')) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                smoothNavigate(this.href);
            });
        }
    });
    
    // =================================================================
    // ЛОГИКА ПОДСВЕТКИ АКТИВНОЙ ССЫЛКИ
    // =================================================================
    const setActiveLink = () => {
        let currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('.nav-links a, .mega-menu a, .main-footer a').forEach(link => {
            link.classList.remove('is-active'); 
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('is-active');
                const parentDropdown = link.closest('.nav-item-dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('a').classList.add('is-active');
                }
            }
        });
    };
    setActiveLink();

    // =================================================================
    // ЛОГИКА ВЫПАДАЮЩЕГО МЕНЮ "PRODUCTS"
    // =================================================================
    const dropdownItem = document.querySelector('.nav-item-dropdown');
    if (dropdownItem) {
        const megaMenu = dropdownItem.querySelector('.mega-menu');
        dropdownItem.addEventListener('mouseenter', () => { if (megaMenu) megaMenu.classList.add('is-visible'); });
        dropdownItem.addEventListener('mouseleave', () => { if (megaMenu) megaMenu.classList.remove('is-visible'); });
    }

    // =================================================================
    // ЛОГИКА ФОРМЫ ВЫБОРА СЕТИ (checking.html)
    // =================================================================
    const networkForm = document.querySelector('.network-form');
    if (networkForm && !document.body.classList.contains('connect-page')) {
        networkForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedNetwork = document.querySelector('input[name="network"]:checked').value;
            const destinationUrl = `connect.html?network=${selectedNetwork}`;
            smoothNavigate(destinationUrl);
        });
    }

    // =================================================================
    // АНИМАЦИИ И ЭФФЕКТЫ
    // =================================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    document.body.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    if (document.body.classList.contains('home-page')) {
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', function() {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
            });
        }
    }
});