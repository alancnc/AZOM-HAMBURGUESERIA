import { animate, inView, scroll } from './assets/motion.min.mjs';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Scroll reveal (motion: inView + animate) ----------
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  revealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    inView(el, () => {
      animate(el, { opacity: 1, y: 0 }, { duration: 0.8, delay, easing: 'ease-out' });
    }, { amount: 0.15, margin: '0px 0px -60px 0px' });
  });
}

// ---------- Hero scroll-scrub video + parallax (motion: scroll) ----------
const heroVideo = document.querySelector('.hero-bg-video');
const heroSection = document.querySelector('#hero');
const heroContent = document.querySelector('.hero-content');
const heroGlow = document.querySelector('.hero .glow-cyan');
const scrubHint = document.querySelector('.scrub-hint');

if (heroVideo) heroVideo.load();

if (heroSection) {
  scroll((progress) => {
    if (heroVideo && !Number.isNaN(heroVideo.duration) && heroVideo.duration > 0) {
      const target = progress * heroVideo.duration;
      if (Math.abs(heroVideo.currentTime - target) > 0.04) {
        heroVideo.currentTime = target;
      }
    }

    if (heroContent) {
      const fadeStart = 0.68;
      const fadeProgress = Math.max(0, Math.min(1, (progress - fadeStart) / (1 - fadeStart)));
      heroContent.style.opacity = String(1 - fadeProgress);
      heroContent.style.transform = `translate3d(0, ${fadeProgress * -50}px, 0)`;
    }

    if (heroGlow) {
      heroGlow.style.transform = `translate3d(${progress * 40}px, ${progress * 80}px, 0)`;
    }

    if (scrubHint) {
      scrubHint.style.opacity = String(1 - Math.min(1, progress / 0.15));
    }
  }, { target: heroSection, offset: ['start start', 'end end'] });
}

// ---------- Historia image parallax (motion: scroll) ----------
const storyImg = document.querySelector('.story-img');
if (storyImg) {
  scroll((progress) => {
    storyImg.style.transform = `translate3d(0, ${(progress - 0.5) * -70}px, 0)`;
  }, { target: storyImg.parentElement, offset: ['start end', 'end start'] });
}

// ---------- 3D tilt on menu cards ----------
if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const img = card.querySelector('.tilt-img');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${py * -12}deg) rotateY(${px * 14}deg) translateY(-4px)`;
      card.style.boxShadow = '0 30px 60px rgba(0,0,0,0.45)';
      if (img) img.style.transform = `scale(1.1) translate(${px * -12}px, ${py * -12}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
      if (img) img.style.transform = 'scale(1) translate(0,0)';
    });
  });

  // ---------- Magnet floating burger ----------
  const magnetZone = document.querySelector('#magnet-zone');
  const magnetEl = document.querySelector('.magnet-el');

  if (magnetZone && magnetEl) {
    const PADDING = 200;
    const STRENGTH = 5;

    document.addEventListener('mousemove', (e) => {
      const rect = magnetZone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const withinX = e.clientX > rect.left - PADDING && e.clientX < rect.right + PADDING;
      const withinY = e.clientY > rect.top - PADDING && e.clientY < rect.bottom + PADDING;

      if (withinX && withinY) {
        const dx = (e.clientX - cx) / STRENGTH;
        const dy = (e.clientY - cy) / STRENGTH;
        const rot = Math.max(-8, Math.min(8, dx * 0.12));
        magnetEl.style.transition = 'transform 0.3s ease-out';
        magnetEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;
      } else {
        magnetEl.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)';
        magnetEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      }
    });
  }
}
