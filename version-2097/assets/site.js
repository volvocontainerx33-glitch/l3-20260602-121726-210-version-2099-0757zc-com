(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = qs('.menu-toggle');
  var nav = qs('.main-nav');
  var topSearch = qs('.top-search');

  if (menuButton && nav && topSearch) {
    menuButton.addEventListener('click', function () {
      var opened = nav.classList.toggle('open');
      topSearch.classList.toggle('open', opened);
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slides = qsa('.hero-slide');
  var dots = qsa('.hero-dot');
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterRoot = qs('[data-filter-root]');
  if (filterRoot) {
    var keyword = qs('[data-filter-keyword]', filterRoot);
    var year = qs('[data-filter-year]', filterRoot);
    var genre = qs('[data-filter-genre]', filterRoot);
    var reset = qs('[data-filter-reset]', filterRoot);
    var cards = qsa('.movie-card', filterRoot);

    function applyFilter() {
      var k = keyword ? keyword.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var g = genre ? genre.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-category') || ''
        ].join(' ').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardGenre = card.getAttribute('data-genre') || '';
        var matched = true;

        if (k && text.indexOf(k) === -1) {
          matched = false;
        }
        if (y && cardYear !== y) {
          matched = false;
        }
        if (g && cardGenre.indexOf(g) === -1) {
          matched = false;
        }
        card.classList.toggle('hidden-by-filter', !matched);
      });
    }

    [keyword, year, genre].forEach(function (item) {
      if (item) {
        item.addEventListener('input', applyFilter);
        item.addEventListener('change', applyFilter);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        if (keyword) {
          keyword.value = '';
        }
        if (year) {
          year.value = '';
        }
        if (genre) {
          genre.value = '';
        }
        applyFilter();
      });
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && keyword) {
      keyword.value = query;
      applyFilter();
    }
  }
})();
