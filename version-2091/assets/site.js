(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = qs('[data-menu-toggle]');
        var nav = qs('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var next = qs('[data-hero-next]', hero);
        var prev = qs('[data-hero-prev]', hero);
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }
        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function textIncludes(source, keyword) {
        return source.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    }

    function initFilters() {
        var forms = qsa('[data-filter-form]');
        forms.forEach(function (form) {
            var keywordInput = qs('[data-filter-keyword]', form);
            var yearSelect = qs('[data-filter-year]', form);
            var regionSelect = qs('[data-filter-region]', form);
            var typeSelect = qs('[data-filter-type]', form);
            var cards = qsa('.movie-card');
            var empty = qs('[data-empty-state]');

            function apply() {
                var keyword = keywordInput ? keywordInput.value.trim() : '';
                var year = yearSelect ? yearSelect.value : '';
                var region = regionSelect ? regionSelect.value : '';
                var type = typeSelect ? typeSelect.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var title = card.getAttribute('data-title') || '';
                    var genre = card.getAttribute('data-genre') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var cardRegion = card.getAttribute('data-region') || '';
                    var cardType = card.getAttribute('data-type') || '';
                    var ok = true;

                    if (keyword && !textIncludes(title + ' ' + genre + ' ' + cardRegion + ' ' + cardType, keyword)) {
                        ok = false;
                    }
                    if (year && cardYear !== year) {
                        ok = false;
                    }
                    if (region && cardRegion !== region) {
                        ok = false;
                    }
                    if (type && cardType !== type) {
                        ok = false;
                    }

                    card.classList.toggle('hidden-card', !ok);
                    if (ok) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                apply();
            });
            [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            if (keywordInput && params.get('q')) {
                keywordInput.value = params.get('q');
            }
            apply();
        });
    }

    function initHomeSearch() {
        var form = qs('[data-home-search]');
        if (!form) {
            return;
        }
        var input = qs('input', form);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var keyword = input ? input.value.trim() : '';
            var target = form.getAttribute('data-target') || 'search.html';
            window.location.href = keyword ? target + '?q=' + encodeURIComponent(keyword) : target;
        });
    }

    function initPlayer() {
        var shell = qs('[data-player-shell]');
        if (!shell) {
            return;
        }
        var video = qs('video', shell);
        var cover = qs('[data-player-cover]', shell);
        var button = qs('[data-play-button]', shell);
        if (!video) {
            return;
        }
        var playlist = video.getAttribute('data-playlist');
        var attached = false;
        var hls = null;

        function attach() {
            if (attached || !playlist) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playlist;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(playlist);
                hls.attachMedia(video);
            } else {
                video.src = playlist;
            }
            attached = true;
        }

        function playVideo() {
            attach();
            shell.classList.add('is-playing');
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }
        if (cover) {
            cover.addEventListener('click', playVideo);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initHomeSearch();
        initFilters();
        initPlayer();
    });
})();
