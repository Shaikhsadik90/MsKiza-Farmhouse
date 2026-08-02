/* ============================================================
   MSKIZA FARM – Main JavaScript
   Features:
     - Sticky navbar with scroll effect
     - Mobile menu toggle
     - Smooth scrolling
     - Scroll-triggered fade-in animations
     - Active navbar link highlighting
     - Contact form validation
   ============================================================ */

   'use strict';

   /* ---- DOM References ---- */
   const navbar     = document.getElementById('navbar');
   const hamburger  = document.getElementById('hamburger');
   const navLinks   = document.getElementById('navLinks');
   const navItems   = document.querySelectorAll('.nav-link');
   const sections   = document.querySelectorAll('section[id]');
   const fadeEls    = document.querySelectorAll('.fade-in');
   const contactForm = document.getElementById('contactForm');
   
   /* ============================================================
      1. STICKY NAVBAR – adds .scrolled class when scrolled
      ============================================================ */
   function handleNavbarScroll() {
     if (window.scrollY > 60) {
       navbar.classList.add('scrolled');
     } else {
       navbar.classList.remove('scrolled');
     }
   }
   
   window.addEventListener('scroll', handleNavbarScroll, { passive: true });
   handleNavbarScroll(); // run on load
   
   /* ============================================================
      2. MOBILE MENU TOGGLE
      ============================================================ */
   function toggleMenu(open) {
     const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('open');
     hamburger.classList.toggle('open', isOpen);
     navLinks.classList.toggle('open', isOpen);
     document.body.style.overflow = isOpen ? 'hidden' : '';
     hamburger.setAttribute('aria-expanded', String(isOpen));
   }
   
   hamburger.addEventListener('click', () => toggleMenu());
   
   // Close menu when a nav link is clicked
   navLinks.querySelectorAll('.nav-link').forEach(link => {
     link.addEventListener('click', () => toggleMenu(false));
   });
   
   // Close menu on Escape key
   document.addEventListener('keydown', e => {
     if (e.key === 'Escape') toggleMenu(false);
   });
   
   /* ============================================================
      3. SMOOTH SCROLLING
         Native CSS scroll-behavior handles the basics;
         this adds offset compensation for the sticky nav.
      ============================================================ */
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function (e) {
       const target = document.querySelector(this.getAttribute('href'));
       if (!target) return;
   
       e.preventDefault();
   
       const navHeight = navbar.offsetHeight;
       const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
   
       window.scrollTo({ top, behavior: 'smooth' });
     });
   });
   
   /* ============================================================
      4. ACTIVE NAVBAR LINK ON SCROLL
      ============================================================ */
   function updateActiveLink() {
     const scrollMid = window.scrollY + window.innerHeight / 3;
   
     sections.forEach(section => {
       const sectionTop    = section.offsetTop;
       const sectionHeight = section.offsetHeight;
       const sectionId     = section.getAttribute('id');
   
       if (scrollMid >= sectionTop && scrollMid < sectionTop + sectionHeight) {
         navItems.forEach(link => {
           link.classList.remove('active');
           if (link.getAttribute('href') === `#${sectionId}`) {
             link.classList.add('active');
           }
         });
       }
     });
   }
   
   window.addEventListener('scroll', updateActiveLink, { passive: true });
   updateActiveLink();
   
   /* ============================================================
      5. FADE-IN ANIMATIONS ON SCROLL (IntersectionObserver)
      ============================================================ */
   const observerOptions = {
     root: null,
     rootMargin: '0px 0px -60px 0px',
     threshold: 0.1,
   };
   
   const fadeObserver = new IntersectionObserver((entries) => {
     entries.forEach((entry, i) => {
       if (entry.isIntersecting) {
         // Staggered delay for grid items
         const delay = (entry.target.closest('.services-grid, .gallery-grid, .why-grid'))
           ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
           : 0;
   
         setTimeout(() => {
           entry.target.classList.add('visible');
         }, delay);
   
         fadeObserver.unobserve(entry.target);
       }
     });
   }, observerOptions);
   
   fadeEls.forEach(el => fadeObserver.observe(el));
   
   // Trigger hero fade-in immediately
   const heroContent = document.querySelector('.hero-content');
   if (heroContent) {
     setTimeout(() => heroContent.classList.add('visible'), 100);
   }
   
   /* ============================================================
      6. CONTACT FORM VALIDATION
      ============================================================ */
   function getField(id) { return document.getElementById(id); }
   function getError(id) { return document.getElementById(id + 'Error'); }
   
   function showError(id, msg) {
     getField(id).classList.add('error');
     getError(id).textContent = msg;
   }
   
   function clearError(id) {
     getField(id).classList.remove('error');
     getError(id).textContent = '';
   }
   
   function validateName() {
     const val = getField('name').value.trim();
     if (!val) { showError('name', 'Please enter your full name.'); return false; }
     if (val.length < 2) { showError('name', 'Name must be at least 2 characters.'); return false; }
     clearError('name');
     return true;
   }
   
   function validatePhone() {
     const val = getField('phone').value.trim().replace(/\s/g, '');
     const phoneRegex = /^[+]?[\d]{7,15}$/;
     if (!val) { showError('phone', 'Please enter your phone number.'); return false; }
     if (!phoneRegex.test(val)) { showError('phone', 'Please enter a valid phone number.'); return false; }
     clearError('phone');
     return true;
   }
   
   function validateMessage() {
     const val = getField('message').value.trim();
     if (!val) { showError('message', 'Please enter a message.'); return false; }
     if (val.length < 10) { showError('message', 'Message must be at least 10 characters.'); return false; }
     clearError('message');
     return true;
   }
   
   // Live validation
   ['name', 'phone', 'message'].forEach(id => {
     const el = getField(id);
     el.addEventListener('blur', () => {
       if (id === 'name') validateName();
       else if (id === 'phone') validatePhone();
       else validateMessage();
     });
     el.addEventListener('input', () => {
       if (el.classList.contains('error')) {
         if (id === 'name') validateName();
         else if (id === 'phone') validatePhone();
         else validateMessage();
       }
     });
   });
   
   contactForm.addEventListener('submit', function (e) {
     e.preventDefault();
   
     const nameOk    = validateName();
     const phoneOk   = validatePhone();
     const messageOk = validateMessage();
   
     if (!nameOk || !phoneOk || !messageOk) return;
   
     // Simulate sending
     const btnText    = this.querySelector('.btn-text');
     const btnSending = this.querySelector('.btn-sending');
     const submitBtn  = this.querySelector('[type="submit"]');
     const successMsg = document.getElementById('formSuccess');
   
     btnText.style.display    = 'none';
     btnSending.style.display = 'inline';
     submitBtn.disabled       = true;
   
     setTimeout(() => {
       btnText.style.display    = 'inline';
       btnSending.style.display = 'none';
       submitBtn.disabled       = false;
   
       successMsg.style.display = 'block';
       contactForm.reset();
   
       // Hide success after 6s
       setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
     }, 1500);
   });
   