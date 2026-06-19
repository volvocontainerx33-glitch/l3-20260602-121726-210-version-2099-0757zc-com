(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                var isOpen = mobileNav.classList.toggle("is-open");
                menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
            });
        }

        document.querySelectorAll("[data-global-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                window.location.href = query ? "search.html?q=" + encodeURIComponent(query) : "search.html";
            });
        });

        setupHero();
        setupFilters();
    });

    function setupHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var yearSelect = panel.querySelector("[data-year-filter]");
            var genreSelect = panel.querySelector("[data-genre-filter]");
            var categorySelect = panel.querySelector("[data-category-filter]");
            var cards = Array.prototype.slice.call(panel.querySelectorAll(".movie-card[data-title]"));
            var empty = panel.querySelector("[data-empty-state]");

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var genre = genreSelect ? genreSelect.value : "";
                var category = categorySelect ? categorySelect.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.dataset.title || "",
                        card.dataset.year || "",
                        card.dataset.category || "",
                        card.dataset.genre || "",
                        card.dataset.tags || ""
                    ].join(" ").toLowerCase();

                    var matchesQuery = !query || haystack.indexOf(query) !== -1;
                    var matchesYear = !year || card.dataset.year === year;
                    var matchesGenre = !genre || (card.dataset.genre || "").indexOf(genre) !== -1 || (card.dataset.tags || "").indexOf(genre) !== -1;
                    var matchesCategory = !category || card.dataset.category === category;
                    var shell = card.closest(".movie-card-shell");
                    var isVisible = matchesQuery && matchesYear && matchesGenre && matchesCategory;

                    if (shell) {
                        shell.hidden = !isVisible;
                    }
                    if (isVisible) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, yearSelect, genreSelect, categorySelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q && input) {
                input.value = q;
            }
            apply();
        });
    }
}());
