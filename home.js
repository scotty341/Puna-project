const header = document.querySelector("header");
const sectionOne = document.querySelector(".home-intro");

const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll(".slide-in");

const sectionOneOptions = {
  rootMargin: "-200px 0px 0px 0px"
};

const sectionOneObserver = new IntersectionObserver(function(
  entries,
  sectionOneObserver
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      header.classList.add("nav-scrolled");
    } else {
      header.classList.remove("nav-scrolled");
    }
  });
},
sectionOneOptions);

sectionOneObserver.observe(sectionOne);

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -250px 0px"
};

const appearOnScroll = new IntersectionObserver(function(
  entries,
  appearOnScroll
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

sliders.forEach(slider => {
  appearOnScroll.observe(slider);
});

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

