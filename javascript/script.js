// =========================
// Global UI script
// - Carousel (only if present)
// - Page fade transitions
// - Fade-in on load
// =========================

// ---------- Carousel (index.html only) ----------
let currentSlide = 0;
let carouselTimer = null;

function changeSlide(direction) {
  const images = document.querySelectorAll('.carousel-images img');
  if (!images || images.length === 0) return;

  // Guard against invalid currentSlide (in case images count changes)
  if (!images[currentSlide]) currentSlide = 0;

  images[currentSlide].classList.remove('active');

  currentSlide += direction;
  if (currentSlide >= images.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = images.length - 1;

  images[currentSlide].classList.add('active');
}

function initCarousel() {
  const images = document.querySelectorAll('.carousel-images img');
  if (!images || images.length === 0) return;

  // Ensure exactly one active image
  images.forEach((img, i) => img.classList.toggle('active', i === 0));
  currentSlide = 0;

  // Auto-change slides every 3 seconds
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => changeSlide(1), 3000);
}

// ---------- Fade navigation ----------
function initFadeLinks() {
  document.querySelectorAll('.fade-link').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = this.href;
      }, 200);
    });
  });
}

// ---------- Fade in on load ----------
document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('fade-in');
  initFadeLinks();
  initCarousel();
});
