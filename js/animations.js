/**
 * animations.js — Createam Static v2
 * Reproduces EXACTLY the GSAP animations from the original React bundle.
 * Variable `ie` = gsap in the minified bundle.
 * All animation parameters are extracted verbatim from index-TwHEgtyP.js.
 */

(function () {
  'use strict';

  // Wait for GSAP + ScrollTrigger to be available
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ─── MARQUEE (continuous scroll) ───────────────────────────────────────────
    const marqueeInner = document.querySelector('.marquee-inner');
    if (marqueeInner) {
      // Duplicate content for seamless loop
      if (!marqueeInner.querySelector('.marquee-clone')) {
        const clone = marqueeInner.innerHTML;
        marqueeInner.innerHTML += clone;
        // Mark clones
        marqueeInner.querySelectorAll(':scope > *:nth-child(n+' + (marqueeInner.children.length / 2 + 1) + ')').forEach(el => el.classList.add('marquee-clone'));
      }
      gsap.to(marqueeInner, {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    }

    // ─── HERO SECTION ──────────────────────────────────────────────────────────
    const heroSection = document.querySelector('section.grid-pattern');
    if (heroSection) {
      const h1 = heroSection.querySelector('h1');
      const words = heroSection.querySelectorAll('.word');
      const heroContent = heroSection.querySelector('.max-w-2xl');

      // Restore perspective on h1 for 3D word animation
      if (h1) gsap.set(h1, { perspective: 1000 });

      // Only run entry animations if user is at/near the top of the page.
      // If the page loaded scrolled down (browser cached scroll position despite
      // history.scrollRestoration = 'manual'), skip straight to end state so
      // the hero never appears broken when scrolling back up.
      const heroVisible = window.scrollY < 200;

      if (words.length) {
        if (heroVisible) {
          gsap.fromTo(words,
            { y: 100, opacity: 0, rotateX: -90 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15, ease: 'power4.out', delay: 0.3 }
          );
        } else {
          // Already scrolled past hero — set final state immediately, no animation
          gsap.set(words, { y: 0, opacity: 1, rotateX: 0 });
        }
      }

      if (heroContent) {
        if (heroVisible) {
          gsap.fromTo(heroContent.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.8 }
          );
        } else {
          gsap.set(Array.from(heroContent.children), { y: 0, opacity: 1 });
        }
      }

      // Hero illustration entrance (slides from left)
      const heroIllustration = heroSection.querySelector('.hero-illustration');
      if (heroIllustration) {
        if (heroVisible) {
          gsap.fromTo(heroIllustration,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.5 }
          );
          // Subtle floating loop on the SVG (±10px)
          gsap.fromTo(heroIllustration,
            { y: 0 },
            { y: -10, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 }
          );
        } else {
          gsap.set(heroIllustration, { x: 0, opacity: 1 });
        }
      }

      if (h1) {
        // Parallax scrub: invalidateOnRefresh ensures correct position on any
        // scroll state at init time.
        gsap.to(h1, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }

    // After all ScrollTriggers are registered, do a clean refresh so every
    // trigger calculates its bounds from the actual current scroll position.
    ScrollTrigger.refresh();

    // ─── TECH MARQUEE SECTION ──────────────────────────────────────────────────
    const techSection = document.querySelector('section.border-y-4');
    if (techSection) {
      // Original: fromTo → {opacity:0,y:30} → {opacity:1,y:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger,start:"top 90%",toggleActions:"play none none reverse"}}
      gsap.fromTo(techSection,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: techSection, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      );
    }

    // ─── GENERIC: section-header (used in all sections) ────────────────────────
    // All sections share this pattern for .section-header children
    function animateSectionHeaders(section) {
      const headers = section.querySelectorAll('.section-header');
      if (!headers.length) return;
      gsap.fromTo(headers,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }

    // ─── SERVICES SECTION (#servicios) ─────────────────────────────────────────
    const servicesSection = document.getElementById('servicios') || document.querySelector('section#servicios');
    if (servicesSection) {
      animateSectionHeaders(servicesSection);
      const cards = servicesSection.querySelectorAll('.service-card');
      // Original: cards alternate x:-80/80 + rotateY:15/-15
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0, rotateY: i % 2 === 0 ? 15 : -15 },
          {
            x: 0, opacity: 1, rotateY: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── SAAS SECTION (#saas) ──────────────────────────────────────────────────
    const saasSection = document.getElementById('saas');
    if (saasSection) {
      animateSectionHeaders(saasSection);
      const cards = saasSection.querySelectorAll('.saas-card');
      // Original: {y:80,opacity:0,scale:.95} → {y:0,opacity:1,scale:1,duration:.7,delay:i*.1}
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── WORK / PROJECTS SECTION (#proyectos) ──────────────────────────────────
    const workSection = document.getElementById('proyectos');
    if (workSection) {
      animateSectionHeaders(workSection);
      const items = workSection.querySelectorAll('.project-item');
      // Original: clipPath animation from bottom
      items.forEach((item) => {
        gsap.fromTo(item,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0 },
          {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', opacity: 1,
            duration: 1, ease: 'power3.inOut',
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── PROCESS SECTION (#proceso) ────────────────────────────────────────────
    const processSection = document.getElementById('proceso');
    if (processSection) {
      animateSectionHeaders(processSection);

      // SVG path stroke animation (original: strokeDashoffset scrub)
      const svgPath = processSection.querySelector('path[d^="M8"]');
      if (svgPath) {
        const len = svgPath.getTotalLength ? svgPath.getTotalLength() : 800;
        gsap.set(svgPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(svgPath, {
          strokeDashoffset: 0, duration: 2, ease: 'none',
          scrollTrigger: { trigger: processSection, start: 'top 60%', end: 'bottom 40%', scrub: 1 },
        });
      }

      // Process step cards — bg-[#0d1f0d] border-4 inside process section
      const steps = processSection.querySelectorAll('[class*="p-8"][class*="bg-\\[#0d1f0d\\]"], [class*="bg-\\[#0d1f0d\\]"][class*="border-4"]');
      if (!steps.length) {
        // Fallback: target direct lg:col-span children
        const cols = processSection.querySelectorAll('[class*="lg:col-span"]');
        cols.forEach((col) => {
          gsap.fromTo(col,
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: col, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        });
      } else {
        steps.forEach((step) => {
          gsap.fromTo(step,
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        });
      }
    }

    // ─── TESTIMONIALS SECTION ──────────────────────────────────────────────────
    const testimonialsSection = document.querySelector('section:has(.testimonial-card)');
    if (testimonialsSection) {
      animateSectionHeaders(testimonialsSection);
      const cards = testimonialsSection.querySelectorAll('.testimonial-card');
      // Original: {y:80,opacity:0,rotateY:alternate} → {y:0,opacity:1,rotateY:0}
      cards.forEach((card, i) => {
        const ry = i === 1 ? 0 : i === 0 ? -20 : 20;
        gsap.fromTo(card,
          { y: 80, opacity: 0, rotateY: ry },
          {
            y: 0, opacity: 1, rotateY: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── METRICS SECTION ───────────────────────────────────────────────────────
    const metricsSection = document.querySelector('section:has(.metric-card)');
    if (metricsSection) {
      animateSectionHeaders(metricsSection);
      const cards = metricsSection.querySelectorAll('.metric-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── PRICING SECTION ───────────────────────────────────────────────────────
    const pricingSection = document.querySelector('section:has(.pricing-card)');
    if (pricingSection) {
      animateSectionHeaders(pricingSection);
      const cards = pricingSection.querySelectorAll('.pricing-card');
      // Original: {y:60/80/60,opacity:0} with delay offsets
      const yVals = [60, 80, 60];
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: yVals[i] || 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── CONTACT SECTION (#contacto) ───────────────────────────────────────────
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      animateSectionHeaders(contactSection);
      // Form + contact items
      const form = contactSection.querySelector('form');
      const contactInfo = contactSection.querySelector('[class*="contact-"]');
      [form, contactInfo].forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    // ─── FOOTER ────────────────────────────────────────────────────────────────
    const footer = document.querySelector('footer');
    if (footer) {
      const footerInner = footer.querySelectorAll('.animate-in, [class*="grid"] > div, [class*="grid"] > nav');
      if (footerInner.length) {
        gsap.fromTo(footerInner,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: footer, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      }
    }

    // ─── NAVBAR scroll effect ──────────────────────────────────────────────────
    const nav = document.querySelector('nav');
    if (nav) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          if (self.progress > 0) {
            nav.style.background = 'rgba(8,18,8,0.97)';
            nav.style.backdropFilter = 'blur(12px)';
          } else {
            nav.style.background = '';
            nav.style.backdropFilter = '';
          }
        },
      });
    }

    // ─── COUNTER ANIMATION (metrics numbers) ───────────────────────────────────
    document.querySelectorAll('[class*="text-"][class*="font-black"]').forEach((el) => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)([+%]?)$/);
      if (!match) return;
      const target = parseInt(match[1]);
      const suffix = match[2] || '';
      if (target < 2) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();
          function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        },
      });
    });

    // ─── BACK TO TOP BUTTON ─────────────────────────────────────────────────────
    const backTop = document.getElementById('back-to-top');
    if (backTop) {
      ScrollTrigger.create({
        start: 'top -300',
        onUpdate: (self) => {
          backTop.style.opacity = self.progress > 0 ? '1' : '0';
          backTop.style.pointerEvents = self.progress > 0 ? 'auto' : 'none';
        },
      });
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  // Load GSAP + ScrollTrigger from CDN then init
  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  ready(function () {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initAnimations();
    } else {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', function () {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', function () {
          initAnimations();
        });
      });
    }
  });
})();
