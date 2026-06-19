(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var header = document.querySelector('.site-header');
    var button = document.querySelector('.menu-toggle');
    if (!header || !button) {
      return;
    }
    button.addEventListener('click', function () {
      header.classList.toggle('menu-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('.hero-carousel');
    if (!hero) {
      return;
    }
    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('.hero-dot', hero);
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      if (!value) {
        return;
      }
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function uniqueValues(cards, attr) {
    var map = Object.create(null);
    cards.forEach(function (card) {
      var value = card.getAttribute(attr) || '';
      if (value) {
        map[value] = true;
      }
    });
    return Object.keys(map).sort(function (a, b) {
      if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
        return Number(b) - Number(a);
      }
      return a.localeCompare(b, 'zh-Hans-CN');
    });
  }

  function initFilters() {
    var inputs = selectAll('.filter-input');
    if (!inputs.length) {
      return;
    }
    var cards = selectAll('.movie-card');
    if (!cards.length) {
      return;
    }
    var yearSelects = selectAll('.filter-year');
    var regionSelects = selectAll('.filter-region');
    var typeSelects = selectAll('.filter-type');

    yearSelects.forEach(function (select) {
      fillSelect(select, uniqueValues(cards, 'data-year'));
    });
    regionSelects.forEach(function (select) {
      fillSelect(select, uniqueValues(cards, 'data-region'));
    });
    typeSelects.forEach(function (select) {
      fillSelect(select, uniqueValues(cards, 'data-type'));
    });

    function currentValue(list) {
      var found = list.find(function (item) {
        return item && item.value;
      });
      return found ? found.value : '';
    }

    function apply() {
      var keyword = currentValue(inputs).trim().toLowerCase();
      var year = currentValue(yearSelects);
      var region = currentValue(regionSelects);
      var type = currentValue(typeSelects);
      cards.forEach(function (card) {
        var text = [card.getAttribute('data-title'), card.getAttribute('data-keywords'), card.getAttribute('data-year')].join(' ').toLowerCase();
        var matched = true;
        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && card.getAttribute('data-year') !== year) {
          matched = false;
        }
        if (region && card.getAttribute('data-region') !== region) {
          matched = false;
        }
        if (type && card.getAttribute('data-type') !== type) {
          matched = false;
        }
        card.classList.toggle('is-hidden', !matched);
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        inputs.forEach(function (other) {
          if (other !== input) {
            other.value = input.value;
          }
        });
        apply();
      });
    });
    yearSelects.concat(regionSelects, typeSelects).forEach(function (select) {
      select.addEventListener('change', apply);
    });
  }

  function initPlayer() {
    selectAll('.player-box').forEach(function (box) {
      var video = box.querySelector('video');
      var overlay = box.querySelector('.player-overlay');
      if (!video || !overlay) {
        return;
      }
      var stream = video.getAttribute('data-stream');
      var loaded = false;
      var hls = null;

      function loadAndPlay() {
        if (!stream) {
          return;
        }
        if (!loaded) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false,
              backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
          } else {
            video.src = stream;
          }
          loaded = true;
        }
        box.classList.add('is-playing');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      overlay.addEventListener('click', loadAndPlay);
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          loadAndPlay();
        }
      });
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
