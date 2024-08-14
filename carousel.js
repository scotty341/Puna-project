document.addEventListener("DOMContentLoaded", function () {
    const mainPosts = document.querySelectorAll(".main-post");
    const posts = document.querySelectorAll(".post");
    
    let progressInterval;
    let postIndex = 0; // Current post index
    let i = 0; // Progress percentage
  
    // Start the automatic progress interval
    startProgress();
  
    function startProgress() {
      progressInterval = setInterval(progress, 100);
    }
  
    function progress() {
      if (i >= 100) {
        i = -5; // Reset progress
        moveToNextPost();
      } else {
        i++;
        updateProgressBars(i);
      }
    }
  
    function moveToNextPost() {
      resetCurrentPost();
  
      postIndex = (postIndex + 1) % posts.length; // Loop to the start
      updateActivePost(postIndex);
    }
  
    function resetCurrentPost() {
      const currentPost = posts[postIndex];
      const currentMainPost = mainPosts[postIndex];
  
      currentPost.classList.remove("post--active");
      currentMainPost.classList.remove("main-post--active");
      currentMainPost.classList.add("main-post--not-active");
  
      currentPost.querySelector(".progress-bar__fill").style.width = "0";
    }
  
    function updateProgressBars(percentage) {
      const currentPost = posts[postIndex];
      const currentMainPost = mainPosts[postIndex];
  
      currentPost.querySelector(".progress-bar__fill").style.width = `${percentage}%`;
      document.querySelector(".progress-bar--primary .progress-bar__fill").style.width = `${percentage}%`;
      
      currentPost.classList.add("post--active");
      currentMainPost.classList.add("main-post--active");
      currentMainPost.classList.remove("main-post--not-active");
    }
  
    function updateActivePost(index) {
      const currentPost = posts[index];
      const currentMainPost = mainPosts[index];
  
      currentPost.classList.add("post--active");
      currentMainPost.classList.add("main-post--active");
      currentMainPost.classList.remove("main-post--not-active");
  
      i = 0; // Reset progress for the new post
      updateProgressBars(i);
    }
  
    // Add click events to switch to the clicked post
    posts.forEach((post, index) => {
      post.addEventListener("click", () => {
        if (!post.classList.contains("post--active")) {
          clearInterval(progressInterval); // Stop automatic progress
          resetCurrentPost(); // Reset the current post
          postIndex = index; // Update to clicked post index
          updateActivePost(postIndex); // Switch to clicked post
          startProgress(); // Restart interval
        }
      });
    });
  
    // Restart the carousel on page load
    window.onload = startProgress;
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
  
  