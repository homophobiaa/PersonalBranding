let currentSlide = 0;

function changeSlide(direction) {
    const images = document.querySelectorAll('.carousel-images img');
    images[currentSlide].classList.remove('active'); // Hide current image

    currentSlide += direction; // Move to the next or previous slide

    // Loop back to the beginning or end
    if (currentSlide >= images.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = images.length - 1;
    }

    images[currentSlide].classList.add('active'); // Show new current image
}

// Optional: Auto-change slides every 3 seconds
setInterval(() => changeSlide(1), 3000);

document.querySelectorAll('.fade-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = this.href;
      }, 200); // Adjust time to match animation duration
    });
  });

