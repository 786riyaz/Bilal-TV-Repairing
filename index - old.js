// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  disable: window.innerWidth < 768, // Disable animations on mobile for better performance
});

// Header scroll effect
window.addEventListener("scroll", function () {
  const header = document.querySelector(".main-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Mobile menu functionality
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");
const mobileBackdrop = document.getElementById("mobileBackdrop");

function openMobileMenu() {
  mobileMenu.classList.add("active");
  mobileBackdrop.classList.add("active");
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  mobileBackdrop.classList.remove("active");
  document.body.style.overflow = "auto";
  document.body.style.position = "static";
}

mobileToggle.addEventListener("click", openMobileMenu);
mobileClose.addEventListener("click", closeMobileMenu);
mobileBackdrop.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close mobile menu when pressing Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

// Form submission handler
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = this.querySelector('input[type="text"]').value;
  const phone = this.querySelector('input[type="tel"]').value;

  // Simple validation
  if (!name || !phone) {
    alert("Please fill in all required fields");
    return;
  }

  // Show success message
  alert(
    `Thank you ${name}! Your repair request has been submitted. We will call you at ${phone} within 30 minutes to schedule your appointment.`,
  );

  // Reset form
  this.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Close mobile menu if open
      closeMobileMenu();

      // Calculate header height for offset
      const headerHeight = document.querySelector(".main-header").offsetHeight;

      window.scrollTo({
        top: targetElement.offsetTop - headerHeight - 20,
        behavior: "smooth",
      });

      // Update active nav link in mobile menu
      document.querySelectorAll(".mobile-nav-link").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === targetId) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Search functionality
const searchButtons = document.querySelectorAll(
  ".search-button, .mobile-search-button",
);
searchButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const searchInput = this.parentElement.querySelector('input[type="text"]');
    if (searchInput.value.trim()) {
      alert(`Searching for: ${searchInput.value}`);
      // In a real implementation, you would submit the search form here
    } else {
      alert("Please enter a search term");
    }
  });
});

// Category dropdown functionality
const categoryToggle = document.querySelector(".search-category");
if (categoryToggle) {
  const categoryDropdown = document.querySelector(".category-dropdown");
  const categoryItems = document.querySelectorAll(".category-item");

  categoryToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    categoryDropdown.style.display =
      categoryDropdown.style.display === "block" ? "none" : "block";
  });

  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const selectedText = this.textContent;
      categoryToggle.querySelector("span").textContent = selectedText;
      categoryDropdown.style.display = "none";
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    categoryDropdown.style.display = "none";
  });
}

// CTA button functionality
const ctaButtons = document.querySelectorAll(".cta-button");
ctaButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Scroll to contact form
    const contactSection = document.getElementById("contact");
    const headerHeight = document.querySelector(".main-header").offsetHeight;

    window.scrollTo({
      top: contactSection.offsetTop - headerHeight - 20,
      behavior: "smooth",
    });

    // Close mobile menu if open
    closeMobileMenu();

    // Focus on first form input
    setTimeout(() => {
      document.querySelector("#contactForm input").focus();
    }, 500);
  });
});

// Handle window resize
let resizeTimer;
window.addEventListener("resize", function () {
  // Clear the previous timer
  clearTimeout(resizeTimer);

  // Set a new timer to run after resize is complete
  resizeTimer = setTimeout(function () {
    if (window.innerWidth > 992) {
      closeMobileMenu();
    }

    // Reinitialize AOS on resize
    AOS.refresh();
  }, 250);
});

// Add loading animation to service cards on page load
document.addEventListener("DOMContentLoaded", function () {
  // Set initial state for animations
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    // Animate in after a delay
    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 300);
  });

  // Initialize tooltips if needed
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Fix for iOS viewport height issue
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setVH();
window.addEventListener("resize", setVH);

// Simple filter functionality
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", function () {
    // Remove active class from all buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-primary");
    });

    // Add active class to clicked button
    this.classList.add("active");
    this.classList.remove("btn-outline-primary");
    this.classList.add("btn-primary");

    const filter = this.getAttribute("data-filter");
    const brandItems = document.querySelectorAll(".brand-item");

    brandItems.forEach((item) => {
      if (
        filter === "all" ||
        item.getAttribute("data-category").includes(filter)
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});
