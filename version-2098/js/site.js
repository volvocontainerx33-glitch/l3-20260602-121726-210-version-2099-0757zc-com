(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var links = document.querySelector('[data-nav-links]');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            links.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
        if (!slides.length) {
            return;
        }

        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === index);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === index);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(index + 1);
        }, 5200);
    }

    if (slides.length) {
        showSlide(0);
        startHero();
    }

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(index - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(index + 1);
            startHero();
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
            startHero();
        });
    });

    var search = document.querySelector('[data-role="search"]');
    var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        var query = normalize(search ? search.value : '');
        var active = {};

        filters.forEach(function (filter) {
            active[filter.getAttribute('data-filter')] = filter.value;
        });

        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-region'));
            var year = parseInt(card.getAttribute('data-year') || '0', 10);
            var match = true;

            if (query && text.indexOf(query) === -1) {
                match = false;
            }

            if (active.category && card.getAttribute('data-category') !== active.category) {
                match = false;
            }

            if (active.type && card.getAttribute('data-type') !== active.type) {
                match = false;
            }

            if (active['year-mode'] && year < parseInt(active['year-mode'], 10)) {
                match = false;
            }

            card.style.display = match ? '' : 'none';

            if (match) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    if (search) {
        search.addEventListener('input', applyFilters);
    }

    filters.forEach(function (filter) {
        filter.addEventListener('change', applyFilters);
    });
})();
