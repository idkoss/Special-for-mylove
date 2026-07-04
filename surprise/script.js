/*
  Script for Surprise Birthday Mira
  Mudah diubah:
  - Nama: Mira (di HTML)
  - Musik: assets/music/song.mp3 (di HTML audio source)
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----------------------------
  // Loading screen
  // ----------------------------
  const loadingEl = $('#loading');
  window.addEventListener('load', () => {
    if (!loadingEl) return;
    loadingEl.style.transition = 'opacity 260ms ease';
    loadingEl.style.opacity = '0';
    setTimeout(() => {
      loadingEl.remove();
    }, 260);
  });

  // ----------------------------
  // Smooth reveal on scroll
  // ----------------------------
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }
      },
      { threshold: 0.16 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ----------------------------
  // Back to top
  // ----------------------------
  const backToTop = $('#backToTop');
  const onScroll = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 350);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ----------------------------
  // Hero modal (Open Surprise)
  // ----------------------------
  const surpriseModal = $('#surpriseModal');
  const openBtn = $('#openSurprise');
  const modalCloseEls = $$('[data-close], [data-close-open], .modal [data-close]');

  const openModal = () => {
    if (!surpriseModal) return;
    surpriseModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (!surpriseModal) return;
    surpriseModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (surpriseModal) {
    // click outside
    const backdrop = $('.modal-backdrop', surpriseModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // close buttons
    modalCloseEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && surpriseModal.classList.contains('open')) closeModal();
    });
  }

  // ----------------------------
  // Fullscreen photo modal
  // ----------------------------
  const imageModal = $('#imageModal');
  const modalImg = $('#modalImg');
  const modalCloseModalEls = $$('[data-close-modal]');
  const openPhotoButtons = $$('.photo[data-full]');

  const openImage = (src) => {
    if (!imageModal || !modalImg) return;
    modalImg.src = src;
    imageModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    if (!imageModal) return;
    imageModal.classList.remove('open');
    document.body.style.overflow = '';
    if (modalImg) modalImg.src = '';
  };

  openPhotoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-full');
      openImage(src);
    });
  });

  if (imageModal) {
    const backdrop = $('.img-modal-backdrop', imageModal);
    if (backdrop) backdrop.addEventListener('click', closeImage);

    modalCloseModalEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeImage();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('open')) closeImage();
    });
  }

  // ----------------------------
  // Wishes typing animation
  // ----------------------------
  const typingEl = $('#typingText');
  if (typingEl) {
    const phrase = "Happy Birthday, Mira";
    const speed = 55;
    let i = 0;

    const tick = () => {
      if (i <= phrase.length) {
        typingEl.textContent = phrase.slice(0, i);
        i++;
        setTimeout(tick, speed);
      }
    };
    tick();
  }

  // ----------------------------
  // Music controls
  // ----------------------------
  const audio = $('#bgMusic');
  const playMusicBtn = $('#playMusic');
  const pauseMusicBtn = $('#pauseMusic');

  if (audio) {
    const safePlay = async () => {
      try {
        await audio.play();
      } catch {
        // Autoplay restrictions — user gesture required
      }
    };

    if (playMusicBtn) playMusicBtn.addEventListener('click', safePlay);
    if (pauseMusicBtn) pauseMusicBtn.addEventListener('click', () => audio.pause());
  }

  // ----------------------------
  // Background particles (canvas)
  // ----------------------------
  const canvas = $('#bgParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let w = 0;
    let h = 0;
    let particles = [];

    const rand = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 32000); // subtle
      particles = Array.from({ length: Math.max(18, Math.min(58, count)) }).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.7, 1.8),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.10, 0.16),
        a: rand(0.18, 0.42),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // soft wash
      const g = ctx.createRadialGradient(w * 0.2, h * 0.1, 0, w * 0.2, h * 0.1, Math.max(w, h) * 0.9);
      g.addColorStop(0, 'rgba(255,214,231,0.20)');
      g.addColorStop(1, 'rgba(255,214,231,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(214,77,138,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    requestAnimationFrame(draw);
  }

  // ----------------------------
  // Floating hearts (occasional)
  // ----------------------------
  const heartsWrap = $('#floatingHearts');
  if (heartsWrap) {
    const spawnHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'heart-float';
      heart.textContent = ['❤', '💗', '💕', '💘'][Math.floor(Math.random() * 4)];

      const x = Math.random() * 100;
      const y = 100 + Math.random() * 30;
      heart.style.setProperty('--x', `${x}vw`);
      heart.style.setProperty('--y', `${y}vh`);

      heart.style.left = `calc(${x}vw - 7px)`;
      heartsWrap.appendChild(heart);

      setTimeout(() => heart.remove(), 4200);
    };

    // spawn slowly
    setInterval(() => {
      if (Math.random() < 0.45) spawnHeart();
    }, 2600);
  }
})();

