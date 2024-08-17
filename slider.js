document.addEventListener('DOMContentLoaded', function () {
    const transitionLayers = document.querySelectorAll('.transition-layer');
    const links = document.querySelectorAll('.nav__link');
    let direction = 'forward'; // Default direction
  
    function startTransition(url) {
      document.body.classList.add('transition-active');
      document.body.classList.remove('transition-reverse');
  
      setTimeout(() => {
        window.location.href = url;
      }, 1000); // Match the transition duration
    }
  
    function startReverseTransition() {
      document.body.classList.add('transition-reverse');
      document.body.classList.remove('transition-active');
  
      setTimeout(() => {
        window.location.reload(); // Reload to handle reverse transition on the same page
      }, 1000); // Match the transition duration
    }
  
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default action
  
        if (direction === 'forward') {
          startTransition(this.href);
        } else {
          startReverseTransition();
        }
      });
    });
  
    window.addEventListener('popstate', function (e) {
      direction = 'reverse'; // When going back, set direction to reverse
      startReverseTransition();
    });
  
    window.addEventListener('load', () => {
      document.body.classList.remove('transition-active', 'transition-reverse');
      direction = 'forward'; // Reset direction after page load
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    const pageContent = document.querySelector('.page-content');
  
    // Add class to trigger animation
    pageContent.classList.add('scale-up-animation');
  
    // Remove the class after animation completes to allow it to play again
    pageContent.addEventListener('animationend', function () {
      pageContent.classList.remove('scale-up-animation');
    });
  });

  // Test Below This Point
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach((slider) => {
    const cards = slider.querySelector('.cards');
  
    if (slider && cards) {
      slider.addEventListener('mousemove', (e) => {
        let scrollWidth = e.pageX / slider.clientWidth * (slider.clientWidth - cards.clientWidth);
        cards.style.left = `${scrollWidth.toFixed(1)}px`;
      });
    } else {
      console.error('Slider or cards element not found.');
    }
  });
  