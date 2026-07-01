(function () {
  const config = window.DF_CONFIG || {};

  // Removed data-href override to rely on hardcoded HTML paths

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const nav = document.querySelector("[data-nav]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastScrollY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);

    if (!prefersReduced && y > 120) {
      nav.classList.toggle("is-hidden", y > lastScrollY && y > 200);
    } else {
      nav.classList.remove("is-hidden");
    }
    lastScrollY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    window.addEventListener(
      "scroll",
      () => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
        progress.style.transform = `scaleX(${pct})`;
      },
      { passive: true }
    );
  }

  const revealTargets = document.querySelectorAll(".reveal, .reveal-child");
  if (!prefersReduced) {
    const staggerGroups = document.querySelectorAll(".reveal-stagger");
    staggerGroups.forEach((group) => {
      const children = group.querySelectorAll(".reveal-child");
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.09}s`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");

  const closeMenu = () => {
    if (!menuToggle || !menuOverlay) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    if (!menuToggle || !menuOverlay) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  menuOverlay?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((open) => {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // Schedule Card Spotlight Effect
  document.querySelectorAll(".schedule-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
  // Countdown Timer
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    // Target date: August 1, 2026
    const targetDate = new Date("August 1, 2026 23:59:59").getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        countdownEl.style.display = "none";
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      document.getElementById("cd-days").innerText = String(days).padStart(2, '0');
      document.getElementById("cd-hours").innerText = String(hours).padStart(2, '0');
      document.getElementById("cd-mins").innerText = String(minutes).padStart(2, '0');
      document.getElementById("cd-secs").innerText = String(seconds).padStart(2, '0');
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  const mobileCta = document.querySelector(".mobile-cta");
  const hero = document.querySelector(".hero");
  if (mobileCta && hero) {
    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    ctaObserver.observe(hero);
  }

  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    const blobs = document.querySelectorAll(".blur-shape");
    if (blobs.length) {
      document.body.classList.add("has-cursor-blur");
      const offsets = [
        { x: -180, y: -180 },
        { x: -120, y: -120 },
        { x: -80, y: -80 },
      ];
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      const positions = blobs.map(() => ({ x: mouseX, y: mouseY }));

      document.addEventListener(
        "mousemove",
        (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        },
        { passive: true }
      );

      const animateBlobs = () => {
        blobs.forEach((blob, i) => {
          const lag = 0.04 + i * 0.02;
          const pos = positions[i];
          pos.x += (mouseX - pos.x) * lag;
          pos.y += (mouseY - pos.y) * lag;
          const off = offsets[i] || offsets[0];
          blob.style.transform = `translate(${pos.x + off.x}px, ${pos.y + off.y}px)`;
        });
        requestAnimationFrame(animateBlobs);
      };
      animateBlobs();
    }
  }

  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();
