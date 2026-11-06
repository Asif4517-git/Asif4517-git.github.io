/* Heading text is rasterised into particle targets, never drawn as text on the visible
   canvas. One bounded spring simulation; no Three.js context or dependency. */
(() => {
  function initParticleText(host) {
  const canvas = host.querySelector('canvas');
  const text = host.dataset.particleText;
  const light = host.dataset.particleTone === 'light';
  if (!host || !canvas) return;
  let ctx;
  try { ctx = canvas.getContext('2d'); } catch { return; }
  if (!ctx) return; // normal, accessible name stays visible
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let particles = [], width = 0, height = 0, raf = 0, last = 0, visible = false, disposed = false;
  let pointer = { x: -1000, y: -1000, active: false, energy: 0, touchUntil: 0 };
  const sprites = (light ? ['#fff0d2', '#ffb347'] : ['#ffb347', '#fff0d2']).map(color => {
    const sprite = document.createElement('canvas'); sprite.width = sprite.height = 16;
    const c = sprite.getContext('2d');
    const g = c.createRadialGradient(8, 8, 0, 8, 8, 8);
    g.addColorStop(0, color); g.addColorStop(.23, color); g.addColorStop(.45, color + '65'); g.addColorStop(1, color + '00');
    c.fillStyle = g; c.fillRect(0, 0, 16, 16); return sprite;
  });
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) ctx.drawImage(sprites[p.color], p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
  }
  function build() {
    if (disposed) return;
    const bounds = host.getBoundingClientRect();
    width = Math.round(bounds.width); height = Math.round(bounds.height);
    if (width < 1 || height < 1) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mask = document.createElement('canvas'); mask.width = width; mask.height = height;
    const c = mask.getContext('2d');
    let size = Math.min(parseFloat(getComputedStyle(host).fontSize) * .96, height * .96);
    const centered = host.classList.contains('particle-contact');
    let lines;
    function layout() {
      c.font = `800 ${size}px Syne, sans-serif`;
      lines = [''];
      for (const word of text.split(' ')) {
        const n = lines.length - 1, candidate = lines[n] ? lines[n] + ' ' + word : word;
        if (c.measureText(candidate).width > width - 8 && lines[n]) lines.push(word);
        else lines[n] = candidate;
      }
    }
    layout();
    while ((lines.length * size * 1.05 > height || lines.some(line => c.measureText(line).width > width - 8)) && size > 12) { size *= .96; layout(); }
    c.fillStyle = '#fff';
    const lineHeight = size * 1.05;
    lines.forEach((line, i) => {
      const metrics = c.measureText(line);
      const baseline = (height - lineHeight * lines.length) / 2 + i * lineHeight + (lineHeight + (metrics.actualBoundingBoxAscent || size * .75) - (metrics.actualBoundingBoxDescent || 0)) / 2;
      c.fillText(line, centered ? (width - metrics.width) / 2 : 3, baseline);
    });
    const pixels = c.getImageData(0, 0, width, height).data;
    const step = Math.max(width < 350 ? 2.4 : 3, Math.sqrt(width * height / 7000));
    particles = [];
    for (let y = 1; y < height; y += step) for (let x = 1; x < width; x += step) {
      if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] < 130) continue;
      particles.push({ x, y, tx: x, ty: y, vx: 0, vy: 0, color: Math.random() < .2 ? 1 : 0, r: width < 350 ? 3.1 : 3.8, phase: Math.random() * Math.PI * 2 });
    }
    draw(); host.classList.add('particles-ready');
    schedule();
  }
  function tick(time) {
    raf = 0;
    if (!visible || document.hidden || disposed || motion.matches) return;
    const dt = Math.min((time - (last || time)) / 16.667, 2); last = time;
    if (pointer.touchUntil && time > pointer.touchUntil) { pointer.active = false; pointer.touchUntil = 0; }
    const radius = Math.min(65, height * .65);
    let unsettled = false;
    for (const p of particles) {
      const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy);
      let ax = (p.tx - p.x) * .045, ay = (p.ty - p.y) * .045;
      if (pointer.active && dist < radius) {
        const force = Math.pow(1 - dist / radius, 2) * (1.8 + pointer.energy * 1.5);
        ax += dx / (dist || 1) * force; ay += dy / (dist || 1) * force;
      }
      const idle = Math.sin(time * .0012 + p.phase) * .012;
      p.vx = (p.vx + (ax + idle) * dt) * Math.pow(.82, dt);
      p.vy = (p.vy + (ay + idle * .6) * dt) * Math.pow(.82, dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      // The force field displaces locally while letters stay recognisable.
      const offset = Math.hypot(p.x - p.tx, p.y - p.ty);
      if (offset > 24) { p.x = p.tx + (p.x - p.tx) / offset * 24; p.y = p.ty + (p.y - p.ty) / offset * 24; }
      unsettled ||= offset > .5;
    }
    pointer.energy *= .94; draw();
    // Idle loop is capped at ~30fps. Interaction/settling runs at display rate.
    raf = requestAnimationFrame(pointer.active || unsettled ? tick : idleFrame);
  }
  function idleFrame(t) { raf = 0; if (t - last >= 32) tick(t); else if (visible && !document.hidden && !motion.matches && !disposed) raf = requestAnimationFrame(idleFrame); }
  function schedule() { if (!raf && visible && !document.hidden && !motion.matches && !disposed) { last = 0; raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }
  function move(e) {
    const b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    pointer.energy = pointer.active ? Math.min(1, Math.hypot(x - pointer.x, y - pointer.y) / 25) : .3;
    pointer.x = x; pointer.y = y; pointer.active = true; pointer.touchUntil = e.pointerType === 'touch' ? performance.now() + 500 : 0; schedule();
  }
  canvas.addEventListener('pointermove', move, { signal: events.signal, passive: true });
  canvas.addEventListener('pointerdown', move, { signal: events.signal, passive: true });
  canvas.addEventListener('pointerup', e => { if (e.pointerType !== 'touch') pointer.active = false; }, { signal: events.signal });
  canvas.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') pointer.active = false; }, { signal: events.signal });
  canvas.addEventListener('pointercancel', () => { pointer.active = false; pointer.touchUntil = 0; }, { signal: events.signal });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) schedule(); else { pointer.active = false; stop(); } });
  observer.observe(host);
  const resize = new ResizeObserver(build); resize.observe(host);
  document.fonts?.ready.then(build).catch(() => {});
  const preference = () => { stop(); pointer.active = false; particles.forEach(p => { p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; }); draw(); schedule(); };
  motion.addEventListener('change', preference, { signal: events.signal });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : schedule(), { signal: events.signal });
  // BFCache pages resume normally; only permanently leaving disposes resources.
  addEventListener('pagehide', e => { if (e.persisted) { stop(); return; } disposed = true; stop(); observer.disconnect(); resize.disconnect(); events.abort(); particles = []; }, { signal: events.signal });
  addEventListener('pageshow', () => schedule(), { signal: events.signal });
  build();
  }
  document.querySelectorAll("[data-particle-text]").forEach(initParticleText);
})();
