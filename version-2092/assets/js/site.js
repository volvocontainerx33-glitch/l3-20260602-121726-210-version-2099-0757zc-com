(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function() {
    var toggle = document.querySelector(".menu-toggle");
    var mobile = document.querySelector(".mobile-nav");
    if (toggle && mobile) {
      toggle.addEventListener("click", function() {
        var open = mobile.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    if (slides.length) {
      dots.forEach(function(dot, i) {
        dot.addEventListener("click", function() {
          showSlide(i);
        });
      });
      if (prev) {
        prev.addEventListener("click", function() {
          showSlide(current - 1);
        });
      }
      if (next) {
        next.addEventListener("click", function() {
          showSlide(current + 1);
        });
      }
      setInterval(function() {
        showSlide(current + 1);
      }, 6200);
      showSlide(0);
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll(".movie-filter"));
    inputs.forEach(function(input) {
      var target = input.getAttribute("data-target") || "body";
      var root = document.querySelector(target) || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
      var empty = root.querySelector(".empty-state");
      input.addEventListener("input", function() {
        var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var visible = 0;
        cards.forEach(function(card) {
          var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          var match = words.every(function(word) {
            return haystack.indexOf(word) !== -1;
          });
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      });
    });
  });
})();
