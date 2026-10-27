(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const motionOK = () => !reduced.matches;

  const loader = $("#loader");
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const progress = $(".scroll-progress");
  const cursor = $(".cursor");
  const ring = $(".cursor-ring");
  const dot = $(".cursor-dot");
  const toast = $("#toast");
  const workspace = $("#workspace");
  const sceneToggle = $("#sceneToggle");
  const sceneLabel = $("#sceneLabel");
  const dialog = $("#projectDialog");
  const dialogContent = $("#dialogContent");
  const dialogClose = $("#dialogClose");

  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

  /* ---------------------------------------------------------------
     1. Loader + coordinated hero entrance
     --------------------------------------------------------------- */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    loader?.classList.add("done");
    $$(".hero .reveal").forEach((el) => el.classList.add("in"));
    setTimeout(() => loader?.remove(), 900);
  }
  if (motionOK()) {
    window.addEventListener("load", () => setTimeout(startHero, 450), { once: true });
    setTimeout(startHero, 1400); // never trap the page behind the loader
  } else {
    startHero();
  }

  /* ---------------------------------------------------------------
     2. Scroll reveals with staggered groups
     --------------------------------------------------------------- */
  const staggerGroups = [
    ".bento", ".project-grid", ".lab-grid", ".tools-grid", ".beyond-grid",
    ".rig-grid", ".skill-cols", ".process", ".goals", ".stats", ".stats",
    ".filter-bar", ".social-row"
  ];
  staggerGroups.forEach((sel) => {
    const group = $(sel);
    if (!group) return;
    $$(".reveal", group).forEach((el, i) => {
      el.style.setProperty("--rd", (Math.min(i, 7) * 0.065).toFixed(3) + "s");
    });
  });

  const revealIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );
  $$(".reveal").filter((el) => !el.closest(".hero")).forEach((el) => revealIO.observe(el));
  if (!motionOK()) $$(".reveal").forEach((el) => el.classList.add("in"));

  /* ---------------------------------------------------------------
     3. Counters
     --------------------------------------------------------------- */
  const counters = $$("[data-count]");
  const counterIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = "1";
        const node = entry.target;
        const end = Number(node.dataset.count);
        if (!motionOK()) { node.textContent = String(end); obs.unobserve(node); return; }
        const start = performance.now();
        const dur = 1100;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          node.textContent = String(Math.round(end * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(node);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterIO.observe(c));

  /* ---------------------------------------------------------------
     4. Active section indicator
     --------------------------------------------------------------- */
  const navAnchors = $$('.nav-links a[href^="#"]');
  const sectionIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          const active = a.getAttribute("href") === "#" + id;
          a.classList.toggle("active", active);
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  $$("main > section[id]").forEach((s) => sectionIO.observe(s));

  /* ---------------------------------------------------------------
     5. Mobile menu
     --------------------------------------------------------------- */
  function closeMenu(returnFocus = false) {
    toggle?.classList.remove("open");
    links?.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open menu");
    if (returnFocus) toggle?.focus();
  }
  toggle?.addEventListener("click", () => {
    const open = !links.classList.contains("open");
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) links.querySelector("a")?.focus();
  });
  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links?.classList.contains("open")) closeMenu(true);
  });

  /* ---------------------------------------------------------------
     6. Smooth anchor scrolling
     --------------------------------------------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const dest = document.querySelector(id);
      if (!dest) return;
      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: motionOK() ? "smooth" : "auto" });
      closeMenu();
    });
  });

  /* ---------------------------------------------------------------
     7. Single rAF loop: cursor, tilt, scroll effects
     --------------------------------------------------------------- */
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let portraitHot = false;
  let portraitRect = null;
  let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
  let scrollDirty = true;
  const portrait = $("[data-tilt]");
  const orbs = $$(".orb");

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    cursor?.classList.add("seen");
    if (portraitHot) {
      const r = portraitRect || portrait.getBoundingClientRect();
      const px = (mx - (r.left + r.width / 2)) / (r.width / 2);
      const py = (my - (r.top + r.height / 2)) / (r.height / 2);
      targetY = Math.max(-1, Math.min(1, px)) * 6;
      targetX = Math.max(-1, Math.min(1, -py)) * 5;
    }
  }, { passive: true });

  if (portrait) {
    portrait.addEventListener("pointerenter", () => {
      portraitHot = true;
      portraitRect = portrait.getBoundingClientRect();
    });
    portrait.addEventListener("pointerleave", () => {
      portraitHot = false;
      targetX = 0; targetY = 0;
    });
  }

  // Delegated cursor hover state (also covers dynamically created cards).
  const hoverSelector = "a, button, .card, .project-card, .stat, .goals li, .spec, .social, .lab-card, .tool-card, .interest";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest?.(hoverSelector)) cursor?.classList.add("hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest?.(hoverSelector) && !e.relatedTarget?.closest?.(hoverSelector)) {
      cursor?.classList.remove("hover");
    }
  });

  function onScrollFrame() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    nav?.classList.toggle("solid", y > 40);
    if (motionOK() && y < window.innerHeight * 1.6) {
      orbs.forEach((o, i) => { o.style.translate = `0 ${(y * (0.06 + i * 0.03)).toFixed(1)}px`; });
    }
    if (portraitHot) portraitRect = portrait.getBoundingClientRect();
  }
  window.addEventListener("scroll", () => { scrollDirty = true; }, { passive: true });
  window.addEventListener("resize", () => { scrollDirty = true; portraitRect = null; }, { passive: true });

  let visible = !document.hidden;
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; });
  let rafId = 0;
  function loop() {
    rafId = requestAnimationFrame(loop);
    if (!visible) return;

    if (scrollDirty) { scrollDirty = false; onScrollFrame(); }

    if (finePointer.matches && motionOK()) {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }

      if (portrait) {
        tiltX += (targetX - tiltX) * 0.12;
        tiltY += (targetY - tiltY) * 0.12;
        if (Math.abs(tiltX) < 0.02 && Math.abs(tiltY) < 0.02 && !portraitHot) {
          if (portrait.style.transform) portrait.style.transform = "";
        } else {
          portrait.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        }
      }
    }
  }
  rafId = requestAnimationFrame(loop);
  window.addEventListener("pagehide", () => cancelAnimationFrame(rafId), { once: true });

  /* ---------------------------------------------------------------
     8. Copy email + toast
     --------------------------------------------------------------- */
  const copyBtn = $("#copyMail");
  let toastTimer;
  copyBtn?.addEventListener("click", async () => {
    const mail = copyBtn.dataset.mail || "asifsrk4517@gmail.com";
    try {
      await navigator.clipboard.writeText(mail);
    } catch {
      const t = document.createElement("textarea");
      t.value = mail; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch { /* clipboard unavailable */ }
      t.remove();
    }
    if (toast) {
      toast.textContent = "Copied " + mail;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
    }
  });

  /* ---------------------------------------------------------------
     9. Project filtering (animated, no layout jumps)
     --------------------------------------------------------------- */
  const grid = $("#projectGrid");
  const cards = grid ? $$(".project-card", grid) : [];
  const filterButtons = $$(".filter");
  const filterStatus = $("#filterStatus");
  const FILTER_NAMES = {
    all: "all", embedded: "ESP32 & Embedded", web: "Web & EdTech",
    sim: "3D & Simulations", rgb: "PC & RGB", early: "Early builds"
  };
  let filtering = false;

  function applyFilter(cat) {
    if (!grid || filtering) return;
    const show = (c) => cat === "all" || c.dataset.category === cat;
    const count = cards.filter(show).length;

    filterButtons.forEach((b) => {
      const active = b.dataset.filter === cat;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    if (filterStatus) filterStatus.textContent = `Showing ${count} ${cat === "all" ? "projects" : FILTER_NAMES[cat] + " project" + (count === 1 ? "" : "s")}`;

    if (!motionOK() || !("animate" in Element.prototype)) {
      cards.forEach((c) => { c.hidden = !show(c); });
      return;
    }

    filtering = true;
    const outgoing = cards.filter((c) => !c.hidden && !show(c));
    const anims = outgoing.map((c) => c.animate(
      [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.96)" }],
      { duration: 190, easing: "ease-in", fill: "forwards" }
    ));
    Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
      const first = new Map();
      cards.forEach((c) => { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });
      outgoing.forEach((c) => { c.getAnimations().forEach((a) => a.cancel()); c.hidden = true; });
      cards.filter(show).forEach((c) => {
        const wasHidden = c.hidden;
        c.hidden = false;
        if (wasHidden || !first.has(c)) {
          c.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
            { duration: 380, easing: EASE, delay: Math.min(cards.indexOf(c), 6) * 25 });
        }
      });
      // FLIP for cards that stayed visible
      cards.filter((c) => !c.hidden && first.has(c)).forEach((c) => {
        const a = first.get(c), b = c.getBoundingClientRect();
        const dx = a.left - b.left, dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        c.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: 420, easing: EASE }
        );
      });
      filtering = false;
    });
  }
  filterButtons.forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));

  /* ---------------------------------------------------------------
     10. Project detail dialog
     --------------------------------------------------------------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let lastFocused = null;

  function buildDetail(d) {
    const shots = d.shots?.length
      ? `<h3>Screenshots</h3><div class="dgallery">${d.shots.map((s) =>
          `<figure><img src="${esc(s.src)}" alt="${esc(s.cap)}" loading="lazy" decoding="async" /><figcaption>${esc(s.cap)}</figcaption></figure>`
        ).join("")}</div>`
      : "";
    const links = d.links?.length
      ? `<div class="dlinks">${d.links.map((l) =>
          `<a class="btn ${l.primary ? "btn-fill" : "btn-ghost"}" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`
        ).join("")}</div>`
      : `<p class="dnote">No public repository or live link for this build yet.</p>`;
    return `
      <p class="dkicker">${esc(d.kicker)}</p>
      <h2 id="dialogTitle">${esc(d.title)}</h2>
      <div class="dialog-meta"><span class="status status-${esc(d.statusType || "built")}">${esc(d.status)}</span><span>Case study · Asif Shahrukh Khan</span></div>
      <p class="dsummary">${esc(d.summary)}</p>
      ${shots}
      <h3>What I built</h3>
      <ul class="dbuilt">${(d.built || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>Hardware &amp; software</h3>
      <ul class="chips">${(d.stack || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>What I learned</h3>
      <p class="dlearn">${esc(d.learned)}</p>
      ${d.note ? `<p class="dnote">${esc(d.note)}</p>` : ""}
      ${links}
    `;
  }

  function openDetail(id) {
    const data = window.PROJECT_DETAILS?.[id];
    if (!data || !dialog) return;
    lastFocused = document.activeElement;
    dialogContent.innerHTML = buildDetail(data);
    dialog.showModal();
    document.body.classList.add("menu-open");
    dialogClose?.focus();
    $(".dialog-inner")?.scrollTo({ top: 0 });
  }
  function closeDetail() {
    if (!dialog?.open) return;
    dialog.close();
  }
  grid?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    openDetail(btn.dataset.open);
  });
  dialogClose?.addEventListener("click", closeDetail);
  dialog?.addEventListener("click", (e) => { if (e.target === dialog) closeDetail(); });
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("menu-open");
    lastFocused?.focus?.();
    setTimeout(() => { if (!dialog.open) dialogContent.innerHTML = ""; }, 200);
  });

  /* ---------------------------------------------------------------
     11. Lazy-loaded Three.js workbench
     --------------------------------------------------------------- */
  let sceneAPI = null;
  let sceneLoading = false;

  function supportsWebGL() {
    // Cheap feature check only — creating a probe context here is expensive on
    // software renderers. The module itself throws if WebGL really is missing.
    return typeof window.WebGLRenderingContext !== "undefined";
  }

  function sceneUnavailable(reason) {
    workspace?.classList.remove("ready");
    if (sceneToggle) {
      sceneToggle.disabled = true;
      sceneToggle.textContent = reason === "reduced" ? "3D off · reduced motion" : "Static preview";
    }
    if (sceneLabel) sceneLabel.textContent = "Illustrated board preview · 3D disabled on this device";
  }

  async function loadScene() {
    if (sceneLoading || sceneAPI) return;
    if (!motionOK()) { sceneUnavailable("reduced"); return; }
    if (!supportsWebGL()) { sceneUnavailable("webgl"); return; }
    if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 3)) {
      sceneUnavailable("save"); return;
    }
    sceneLoading = true;
    if (sceneToggle) sceneToggle.textContent = "Loading 3D…";
    const timeout = setTimeout(() => { if (!sceneAPI) sceneUnavailable("timeout"); }, 9000);
    try {
      const mod = await import("./hero3d.js");
      sceneAPI = await mod.initHero3D({
        canvas: $("#heroCanvas"),
        workspace,
        onReady: () => {
          workspace?.classList.add("ready");
          if (sceneToggle) { sceneToggle.disabled = false; sceneToggle.textContent = "Explore 3D"; }
        },
        onLabel: (text) => {
          if (!sceneLabel) return;
          sceneLabel.textContent = text || "";
          sceneLabel.classList.toggle("show", Boolean(text));
        }
      });
    } catch (err) {
      console.warn("[hero3d] unavailable:", err);
      sceneUnavailable("error");
    } finally {
      clearTimeout(timeout);
      sceneLoading = false;
    }
  }

  if (workspace) {
    const heroIO = new IntersectionObserver((entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 240));
      idle(() => loadScene(), { timeout: 1500 });
    }, { rootMargin: "120px" });
    heroIO.observe(workspace);
  }

  sceneToggle?.addEventListener("click", () => {
    if (!sceneAPI) return;
    const next = !workspace.classList.contains("explore");
    workspace.classList.toggle("explore", next);
    sceneToggle.setAttribute("aria-pressed", String(next));
    sceneToggle.textContent = next ? "Back to portrait" : "Explore 3D";
    sceneAPI.setActive?.(next);
    if (next) {
      sceneAPI.focus?.();
      if (!sceneLabel.textContent) sceneAPI.announce?.();
    }
  });

  reduced.addEventListener?.("change", () => {
    if (reduced.matches) {
      workspace?.classList.remove("explore", "ready");
      sceneAPI?.dispose?.();
      sceneAPI = null;
      sceneUnavailable("reduced");
    }
  });
})();
