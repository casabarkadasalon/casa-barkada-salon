"use strict";

/* ==========================================
   CASA BARKADA SALON
   MAIN JAVASCRIPT
========================================== */

const header = document.querySelector("#header");
const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const preloader = document.querySelector("#preloader");

/* ==========================================
   STICKY HEADER
========================================== */

function updateHeaderState() {
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 50);
}

updateHeaderState();

window.addEventListener("scroll", updateHeaderState, {
  passive: true,
});

/* ==========================================
   MOBILE MENU
========================================== */

function openMenu() {
  navMenu.classList.add("active");
  navToggle.classList.add("active");

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
  if (navMenu.classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

/* ==========================================
   ACTIVE NAVIGATION
========================================== */

const sections = document.querySelectorAll("section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    });
  },
  {
    threshold: 0.5,
  },
);

sections.forEach((section) => observer.observe(section));

/* ==========================================
   PRELOADER
========================================== */

function hidePreloader() {
  if (!preloader) return;

  preloader.classList.add("hidden");

  setTimeout(() => {
    preloader.remove();
  }, 500);
}

if (document.readyState === "complete") {
  hidePreloader();
} else {
  window.addEventListener("load", hidePreloader);
}

setTimeout(hidePreloader, 3000);

/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("show");

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
  },
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});
/* ==========================================
   SCROLL TO TOP
========================================== */

const scrollTopButton = document.querySelector("#scroll-top");

function toggleScrollButton() {
  if (!scrollTopButton) return;

  scrollTopButton.classList.toggle("show", window.scrollY > 400);
}

window.addEventListener("scroll", toggleScrollButton, { passive: true });

toggleScrollButton();

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================================================
   UNIVERSAL GTM / GA4 EVENT TRACKING
========================================================= */

function sendGA4Event(eventName, eventParameters = {}) {
  if (!eventName) return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...eventParameters,
  });

  console.log("GTM event pushed:", eventName, eventParameters);
}

document.addEventListener("click", (event) => {
  const trackedElement = event.target.closest("[data-ga-event]");

  if (!trackedElement) return;

  const eventName = trackedElement.dataset.gaEvent;

  sendGA4Event(eventName, {
    item_name: trackedElement.dataset.gaName || "",
    item_category: trackedElement.dataset.gaCategory || "",
    button_location: trackedElement.dataset.gaLocation || "unknown",
    button_text: trackedElement.textContent.trim() || "unknown",
    link_url: trackedElement.getAttribute("href") || "",
    page_location: window.location.href,
    page_title: document.title,
  });
});

console.log("main.js loaded");
