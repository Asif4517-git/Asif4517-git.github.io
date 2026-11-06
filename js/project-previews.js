/* Passive project illustrations. No network requests, sensor access, audio,
   scanning or real transactions. All changing numbers are labelled samples. */
(() => {
  const elements = [...document.querySelectorAll('.project-card .project-visual')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController(), visible = new Set();
  let timer = 0, phase = 0;
  function sync() {
    const active = !document.hidden && !motion.matches;
    for (const el of elements) {
      el.classList.toggle('preview-active', active && visible.has(el));
      el.classList.toggle('preview-still', motion.matches);
    }
    if (active && visible.size && !timer) timer = setInterval(update, 1400);
    if ((!active || !visible.size) && timer) { clearInterval(timer); timer = 0; }
  }
  function update() {
    phase++;
    for (const el of visible) {
      const read = el.querySelector('.sample-reading');
      if (read) read.textContent = String(428 + Math.round(Math.sin(phase * .55) * 19));
      const total = el.querySelector('.pos-sum');
      if (total) {
        const stage = phase % 7;
        total.textContent = stage === 0 ? '0' : stage === 1 ? '80' : '90';
        el.querySelectorAll('.pos-row').forEach((row, i) => { row.style.opacity = stage <= i ? '0' : '1'; });
      }
    }
  }
  const observer = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
    sync();
  }, { threshold: .1 });
  elements.forEach(el => observer.observe(el));
  for (const el of elements.filter(el => el.classList.contains('photo-preview'))) {
    el.addEventListener('pointermove', e => {
      if (motion.matches || e.pointerType === 'touch') return;
      const b = el.getBoundingClientRect();
      el.style.setProperty('--photo-x', `${((e.clientX - b.left) / b.width - .5) * 5}px`);
      el.style.setProperty('--photo-y', `${((e.clientY - b.top) / b.height - .5) * 4}px`);
    }, { signal: events.signal, passive: true });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--photo-x', '0px'); el.style.setProperty('--photo-y', '0px'); }, { signal: events.signal });
  }
  motion.addEventListener('change', () => {
    if (motion.matches) {
      document.querySelectorAll('.sample-reading').forEach(el => { el.textContent = '428'; });
      document.querySelectorAll('.pos-sum').forEach(el => { el.textContent = '90'; });
      document.querySelectorAll('.pos-row').forEach(el => { el.style.opacity = ''; });
    }
    sync();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', sync, { signal: events.signal });
  addEventListener('pagehide', e => { clearInterval(timer); timer = 0; if (!e.persisted) { observer.disconnect(); events.abort(); visible.clear(); } }, { signal: events.signal });
  addEventListener('pageshow', sync, { signal: events.signal });
  sync();
})();
