const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('is-open');
  });
}

const searchInput = document.querySelector('[data-search-input]');
const searchGrid = document.querySelector('[data-search-grid]');

if (searchInput && searchGrid) {
  const items = Array.from(searchGrid.querySelectorAll('[data-search]'));
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    items.forEach((item) => {
      const text = item.getAttribute('data-search') || '';
      item.hidden = keyword.length > 0 && !text.includes(keyword);
    });
  });
}

const carousel = document.querySelector('[data-hero-carousel]');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  let activeIndex = 0;

  const activateSlide = (nextIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === nextIndex);
      slide.querySelectorAll('.dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === nextIndex);
      });
    });
    activeIndex = nextIndex;
  };

  if (slides.length > 1) {
    window.setInterval(() => {
      activateSlide((activeIndex + 1) % slides.length);
    }, 5200);
  }
}
