(() => {
  const loader = document.getElementById("loader");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const progress = document.querySelector(".scroll-progress");
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  const dot = document.querySelector(".cursor-dot");
  const toast = document.getElementById("toast");

  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("done"), 1500);
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("in"));
  });

  toggle?.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links?.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });
  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle?.classList.remove("open");
      links.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = "1";
        const end = Number(e.target.dataset.count);
        const start = performance.now();
        const dur = 1100;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          e.target.textContent = Math.round(end * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => cio.observe(c));

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  const hoverables = "a, button, .card, .project, .stat, .goals li, .spec, .social";
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor?.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor?.classList.remove("hover"));
  });

  const portrait = document.querySelector("[data-tilt]");
  const finePointer = window.matchMedia("(pointer:fine)");
  let portraitHot = false;
  let tiltX = 0;
  let tiltY = 0;
  let targetX = 0;
  let targetY = 0;

  if (portrait) {
    portrait.addEventListener("mouseenter", () => {
      portraitHot = true;
    });
    portrait.addEventListener("mouseleave", () => {
      portraitHot = false;
      targetX = 0;
      targetY = 0;
    });
  }

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (dot) {
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    }
    if (ring) {
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
    }

    if (portrait && finePointer.matches) {
      if (portraitHot) {
        const r = portrait.getBoundingClientRect();
        const px = (mx - (r.left + r.width / 2)) / (r.width / 2);
        const py = (my - (r.top + r.height / 2)) / (r.height / 2);
        targetY = Math.max(-1, Math.min(1, px)) * 6;
        targetX = Math.max(-1, Math.min(1, -py)) * 5;
      }
      tiltX += (targetX - tiltX) * 0.12;
      tiltY += (targetY - tiltY) * 0.12;
      if (Math.abs(tiltX) < 0.02 && Math.abs(tiltY) < 0.02 && !portraitHot) {
        tiltX = 0;
        tiltY = 0;
        portrait.style.transform = "";
      } else {
        portrait.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? y / max : 0;
    if (progress) progress.style.width = p * 100 + "%";
    nav?.classList.toggle("solid", y > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const dest = document.querySelector(id);
      if (!dest) return;
      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  const orbs = document.querySelectorAll(".orb");
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      orbs.forEach((o, i) => {
        o.style.translate = `0 ${y * (0.08 + i * 0.04)}px`;
      });
    },
    { passive: true }
  );

  const copyBtn = document.getElementById("copyMail");
  copyBtn?.addEventListener("click", async () => {
    const mail = copyBtn.dataset.mail || "asifsrk4517@gmail.com";
    try {
      await navigator.clipboard.writeText(mail);
    } catch {
      const t = document.createElement("textarea");
      t.value = mail;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    if (toast) {
      toast.textContent = "Copied " + mail;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    }
  });
})();
