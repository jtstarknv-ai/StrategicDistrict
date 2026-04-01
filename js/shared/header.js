/**
 * STRATEGICDISTRICT.COM , Header Navigation
 * Handles hamburger menu toggle and responsive navigation
 */

document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var header = document.querySelector('header');

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      toggleMobileNav();
    });
  }

  // Close mobile nav when a link is clicked
  if (mobileNav) {
    var navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        closeMobileNav();
      });
    });
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (hamburger && mobileNav) {
      var isClickInsideHeader = header.contains(e.target);
      if (!isClickInsideHeader && mobileNav.classList.contains('active')) {
        closeMobileNav();
      }
    }
  });

  // Handle header shadow on scroll
  var lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollTop = scrollTop;
  });

  // Handle window resize - close mobile nav on larger screens
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024 && mobileNav && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Set active nav link based on current page
  setActiveNavLink();
});

/**
 * Toggle mobile navigation visibility
 */
function toggleMobileNav() {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
  }
}

/**
 * Close mobile navigation
 */
function closeMobileNav() {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
  }
}

/**
 * Set active nav link based on current page URL
 */
function setActiveNavLink() {
  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');

  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    
    // Handle exact match or parent directory match
    if (href === currentPath || currentPath.startsWith(href + '/') || 
        (href === '/' && currentPath === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Scroll to section (for smooth navigation)
 * Usage: <a href="#section-id" onclick="scrollToSection(event)">Link</a>
 */
function scrollToSection(event) {
  event.preventDefault();
  var targetId = event.target.getAttribute('href');
  var targetSection = document.querySelector(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Close mobile nav if open
  closeMobileNav();
}

/**
 * Utility: Add keyboard support for hamburger menu
 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileNav();
  }
});
