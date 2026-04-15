/* ============================================================
   MGIMO Festival — script.js
   ============================================================ */

/* ---- Navbar scroll effect ---- */
const nav = document.getElementById('nav');
const scrollHint = document.getElementById('scrollHint');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
  if (scrollHint && window.scrollY > 200) {
    scrollHint.style.opacity = '0';
    scrollHint.style.pointerEvents = 'none';
  } else if (scrollHint) {
    scrollHint.style.opacity = '1';
    scrollHint.style.pointerEvents = '';
  }
}, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observerOptions = { rootMargin: '-30% 0px -60% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

/* ---- Mobile menu ---- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ---- Program tabs ---- */
const tabs = document.querySelectorAll('.program__tab');
const days = document.querySelectorAll('.program__day');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.day;
    tabs.forEach(t => t.classList.remove('program__tab--active'));
    days.forEach(d => d.classList.remove('program__day--active'));
    tab.classList.add('program__tab--active');
    document.querySelector(`.program__day[data-day="${day}"]`).classList.add('program__day--active');
  });
});

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__q').addEventListener('click', () => {
    const isOpen = item.classList.contains('faq__item--open');
    // Close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('faq__item--open'));
    // Open clicked if it wasn't open
    if (!isOpen) item.classList.add('faq__item--open');
  });
});

/* ---- Gallery lightbox ---- */
const galleryItems = document.querySelectorAll('.gallery__item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
const images = [];

galleryItems.forEach((item, i) => {
  const img = item.querySelector('img');
  if (img) images.push({ src: img.src, alt: img.alt });

  item.addEventListener('click', () => {
    currentIndex = i;
    openLightbox(i);
  });
});

function openLightbox(index) {
  if (!images[index]) return;
  lightboxImg.src = images[index].src;
  lightboxImg.alt = images[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox(currentIndex);
});

lightboxNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox(currentIndex);
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll(
  '.section__title, .section__tag, .about__text, .about__goals, .stat, ' +
  '.timeline__item, .doc__card, .faq__item, .gallery__item, ' +
  '.contacts__grid, .register, .about__lead, .about__body, .about__endowment, .stats'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.06}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
