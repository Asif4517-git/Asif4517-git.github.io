/* Procedural Three.js hero workbench.
   Lazy-imported by main.js. No external models, images or network calls. */
import * as THREE from "./vendor/three.module.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const lerp = (a, b, t) => a + (b - a) * t;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function pcbTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 640;
  const x = c.getContext("2d");
  x.fillStyle = "#0d2a26";
  x.fillRect(0, 0, c.width, c.height);

  // subtle substrate noise
  x.globalAlpha = 0.05;
  for (let i = 0; i < 1400; i++) {
    x.fillStyle = i % 2 ? "#8affd0" : "#00110c";
    x.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2);
  }
  x.globalAlpha = 1;

  // copper traces
  const traces = [
    [[40, 80], [310, 80], [310, 190], [520, 190]],
    [[60, 560], [260, 560], [260, 450], [500, 450]],
    [[960, 120], [720, 120], [720, 240], [560, 240]],
    [[980, 520], [780, 520], [780, 400], [600, 400]],
    [[120, 320], [280, 320], [280, 260], [420, 260]],
    [[900, 320], [740, 320], [740, 350], [620, 350]]
  ];
  x.lineWidth = 3;
  x.strokeStyle = "rgba(70, 190, 150, 0.42)";
  traces.forEach((pts) => {
    x.beginPath();
    pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])));
    x.stroke();
    const end = pts[pts.length - 1];
    x.fillStyle = "rgba(220, 174, 92, 0.8)";
    x.beginPath(); x.arc(end[0], end[1], 7, 0, Math.PI * 2); x.fill();
  });

  // silkscreen
  x.strokeStyle = "rgba(220, 230, 225, 0.18)";
  x.lineWidth = 2;
  x.strokeRect(26, 26, c.width - 52, c.height - 52);
  x.fillStyle = "rgba(226, 236, 230, 0.36)";
  x.font = "600 22px monospace";
  x.fillText("ASIF // WORKBENCH", 44, 60);
  x.font = "500 16px monospace";
  x.fillText("ESP32 · WLED · AI · WEB", 44, c.height - 46);
  x.textAlign = "right";
  x.fillText("REV 0.1", c.width - 44, 60);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 2;
  return t;
}

function labelTexture(THREE, title, sub, accent) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 220;
  const x = c.getContext("2d");
  x.clearRect(0, 0, c.width, c.height);
  roundRect(x, 8, 8, c.width - 16, c.height - 16, 26);
  x.fillStyle = "rgba(14, 16, 20, 0.94)";
  x.fill();
  x.strokeStyle = accent;
  x.lineWidth = 3;
  x.stroke();

  x.fillStyle = accent;
  roundRect(x, 30, 44, 10, 118, 5); x.fill();

  x.fillStyle = "#f4f0e8";
  x.font = "700 54px Arial, sans-serif";
  x.fillText(title, 62, 108);
  x.fillStyle = "rgba(210, 205, 196, 0.72)";
  x.font = "400 27px Arial, sans-serif";
  x.fillText(sub, 64, 154);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 2;
  return t;
}

function chipTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 320;
  const x = c.getContext("2d");
  x.fillStyle = "#1a1d21"; x.fillRect(0, 0, 512, 320);
  x.strokeStyle = "rgba(255,255,255,0.12)"; x.lineWidth = 4;
  x.strokeRect(14, 14, 484, 292);
  x.fillStyle = "#e8e2d6"; x.font = "700 72px Arial, sans-serif";
  x.textAlign = "center"; x.fillText("ESP32", 256, 150);
  x.fillStyle = "rgba(255,179,71,0.85)"; x.font = "400 30px monospace";
  x.fillText("Wi-Fi + BT · DevKit", 256, 210);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function initHero3D({ canvas, workspace, onReady, onLabel }) {
  if (!canvas || !workspace) throw new Error("hero3d: missing canvas or workspace");

  const small = window.innerWidth < 760;
  // Create the context ourselves so a missing WebGL implementation fails
  // cleanly instead of letting three.js log a console error first.
  const glOpts = { alpha: true, antialias: !small, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", glOpts) || canvas.getContext("webgl", glOpts);
  if (!gl) throw new Error("WebGL unavailable on this device");
  const renderer = new THREE.WebGLRenderer({
    canvas, context: gl, alpha: true, antialias: !small, powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.12, 10.0);

  const root = new THREE.Group();
  root.scale.setScalar(small ? 0.72 : 0.86);
  scene.add(root);
  const boardGroup = new THREE.Group();
  root.add(boardGroup);

  const geometries = [];
  const materials = [];
  const textures = [];
  const g = (geo) => { geometries.push(geo); return geo; };
  const m = (mat) => { materials.push(mat); return mat; };
  const t = (tex) => { textures.push(tex); return tex; };

  /* ---------- PCB ---------- */
  const pcbMat = m(new THREE.MeshStandardMaterial({
    map: t(pcbTexture(THREE)), color: 0xffffff, metalness: 0.22, roughness: 0.68
  }));
  const pcb = new THREE.Mesh(g(new THREE.BoxGeometry(4.3, 2.7, 0.14)), pcbMat);
  boardGroup.add(pcb);

  const edges = new THREE.LineSegments(
    g(new THREE.EdgesGeometry(pcb.geometry)),
    m(new THREE.LineBasicMaterial({ color: 0x4fd3ad, transparent: true, opacity: 0.32 }))
  );
  boardGroup.add(edges);

  // Gold pin headers (instanced, one draw call)
  const pinGeo = g(new THREE.BoxGeometry(0.075, 0.34, 0.075));
  const pinMat = m(new THREE.MeshStandardMaterial({ color: 0xd8a94c, metalness: 0.85, roughness: 0.3 }));
  const PIN_COUNT = 30;
  const pins = new THREE.InstancedMesh(pinGeo, pinMat, PIN_COUNT);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < PIN_COUNT; i++) {
    const row = i < 15 ? 1 : -1;
    const col = i % 15;
    dummy.position.set(-1.85 + col * 0.265, row * 1.38, 0);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    pins.setMatrixAt(i, dummy.matrix);
  }
  pins.instanceMatrix.needsUpdate = true;
  boardGroup.add(pins);

  // ESP32 module + its printed top
  const moduleMat = m(new THREE.MeshStandardMaterial({ color: 0x20242a, metalness: 0.6, roughness: 0.45 }));
  const module = new THREE.Mesh(g(new THREE.BoxGeometry(1.62, 1.0, 0.22)), moduleMat);
  module.position.set(0.05, 0.08, 0.18);
  boardGroup.add(module);

  const chipFace = new THREE.Mesh(
    g(new THREE.PlaneGeometry(1.5, 0.9)),
    m(new THREE.MeshBasicMaterial({ map: t(chipTexture(THREE)), transparent: true }))
  );
  chipFace.position.set(0.05, 0.08, 0.296);
  boardGroup.add(chipFace);

  // USB-C connector
  const usb = new THREE.Mesh(
    g(new THREE.BoxGeometry(0.6, 0.46, 0.28)),
    m(new THREE.MeshStandardMaterial({ color: 0xa9b2b8, metalness: 0.9, roughness: 0.28 }))
  );
  usb.position.set(-2.15, 0.02, 0.16);
  boardGroup.add(usb);

  // Status LED
  const led = new THREE.Mesh(
    g(new THREE.SphereGeometry(0.075, 12, 10)),
    m(new THREE.MeshBasicMaterial({ color: 0xff8a3d }))
  );
  led.position.set(1.6, 0.9, 0.22);
  boardGroup.add(led);

  /* ---------- Glowing traces + travelling signals ---------- */
  const curves = [];
  const traceDefs = [
    [V(-1.9, -1.05, 0.1), V(-1.1, -0.7, 0.13), V(-0.5, -0.55, 0.16), V(0.05, -0.42, 0.2)],
    [V(1.95, 1.02, 0.1), V(1.2, 0.7, 0.13), V(0.7, 0.5, 0.16), V(0.25, 0.45, 0.2)],
    [V(-1.95, 0.9, 0.1), V(-1.2, 1.05, 0.13), V(-0.6, 0.75, 0.16), V(-0.15, 0.5, 0.2)],
    [V(1.9, -0.9, 0.1), V(1.15, -0.95, 0.13), V(0.6, -0.7, 0.16), V(0.2, -0.45, 0.2)]
  ];
  const traceMat = m(new THREE.LineBasicMaterial({
    color: 0x45e0b0, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  traceDefs.forEach((pts) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    curves.push(curve);
    const line = new THREE.Line(g(new THREE.BufferGeometry().setFromPoints(curve.getPoints(36))), traceMat);
    boardGroup.add(line);
  });

  const signalMat = m(new THREE.MeshBasicMaterial({
    color: 0xffd08a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  const signals = curves.map(() => {
    const s = new THREE.Mesh(g(new THREE.SphereGeometry(0.058, 10, 8)), signalMat);
    boardGroup.add(s);
    return s;
  });

  /* ---------- Floating interface panels (interactive) ---------- */
  const panelDefs = [
    {
      title: "ESP32", sub: "embedded · hardware", accent: "#ff9a4d",
      pos: V(-2.15, 1.62, 1.15), rot: 0.13,
      label: "ESP32 — the board behind the handheld console, sensor tests and WLED lighting.",
      colors: [0xff6b1a, 0x36c9e0, 0xd05cff]
    },
    {
      title: "CHEMLAB", sub: "web · education", accent: "#4bd5d4",
      pos: V(2.22, 1.05, 1.3), rot: -0.1,
      label: "ChemLab Kerala — interactive lessons, experiments and quizzes for Class 10 chemistry.",
      colors: [0x38d6c4, 0xffb347, 0x6f8cff]
    },
    {
      title: "3D / AI", sub: "creative coding", accent: "#c79bff",
      pos: V(-1.95, -1.7, 1.05), rot: -0.08,
      label: "JLN Stadium 3D + AI coding tools — procedural worlds and model-assisted development.",
      colors: [0xb46bff, 0xff6b1a, 0x4bd5d4]
    }
  ];

  const interactive = [];
  const panels = panelDefs.map((d) => {
    const grp = new THREE.Group();
    const backing = new THREE.Mesh(
      g(new THREE.PlaneGeometry(1.72, 0.8)),
      m(new THREE.MeshBasicMaterial({ color: 0x0a0c10, transparent: true, opacity: 0.82, side: THREE.DoubleSide }))
    );
    grp.add(backing);
    const face = new THREE.Mesh(
      g(new THREE.PlaneGeometry(1.66, 0.72)),
      m(new THREE.MeshBasicMaterial({ map: t(labelTexture(THREE, d.title, d.sub, d.accent)), transparent: true, side: THREE.DoubleSide }))
    );
    face.position.z = 0.006;
    grp.add(face);
    grp.position.copy(d.pos);
    grp.rotation.z = d.rot;
    grp.userData = { ...d, targetScale: 1, baseY: d.pos.y };
    root.add(grp);
    interactive.push(face);
    face.userData.panel = grp;
    return grp;
  });
  interactive.push(chipFace);
  chipFace.userData.panel = { userData: { label: "ESP32 DevKit — the little board that connects most of my hardware experiments." } };

  /* ---------- Ambient rings + particles ---------- */
  const rings = [];
  [
    { r: 3.15, c: 0xff6b1a, o: 0.11, z: -1.4 },
    { r: 3.75, c: 0x36c9e0, o: 0.07, z: -2.1 },
    { r: 4.35, c: 0xd05cff, o: 0.05, z: -2.8 }
  ].forEach((d) => {
    const ring = new THREE.Mesh(
      g(new THREE.TorusGeometry(d.r, 0.012, 6, 96)),
      m(new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: d.o, blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    ring.position.z = d.z;
    root.add(ring);
    rings.push(ring);
  });

  const count = small ? 48 : 110;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
  }
  const partGeo = g(new THREE.BufferGeometry());
  partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const partMat = m(new THREE.PointsMaterial({
    color: 0xffd9a8, size: 0.032, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  }));
  const particles = new THREE.Points(partGeo, partMat);
  root.add(particles);

  /* ---------- Lighting ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const key = new THREE.DirectionalLight(0xffe2c4, 1.15);
  key.position.set(3, 4, 6);
  scene.add(key);
  const lights = [
    new THREE.PointLight(0xff6b1a, 2.6, 14),
    new THREE.PointLight(0x36c9e0, 2.1, 14),
    new THREE.PointLight(0xd05cff, 1.5, 14)
  ];
  lights[0].position.set(-3.4, 1.4, 3.4);
  lights[1].position.set(3.4, -0.8, 3.2);
  lights[2].position.set(0, -3.2, 2.2);
  lights.forEach((l) => scene.add(l));
  let targetColors = lights.map((l) => l.color.clone());

  /* ---------- Interaction state ---------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(0, 0);
  let hoverTarget = null;
  let active = false;
  let mode = 0;
  let curRX = 0, curRY = 0, targetRX = 0, targetRY = 0;
  let dragRot = 0, dragVel = 0, dragging = false, lastX = 0;
  let running = false, raf = 0, disposed = false;
  const clock = new THREE.Clock();

  function setLabel(text) { onLabel?.(text); }
  function applyMode(i) {
    mode = (i + panelDefs.length) % panelDefs.length;
    const cols = panelDefs[mode].colors;
    targetColors = cols.map((c) => new THREE.Color(c));
    setLabel(panelDefs[mode].label);
  }

  function onPointerMove(e) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    targetRY = pointer.x * 0.24;
    targetRX = -pointer.y * 0.15;
    if (dragging) {
      dragVel += (e.clientX - lastX) * 0.0016;
      lastX = e.clientX;
    }
  }
  function onPointerLeave() {
    targetRX = 0; targetRY = 0;
    if (hoverTarget) {
      hoverTarget.userData.panel.userData.targetScale = 1;
      hoverTarget = null;
      if (active) setLabel(panelDefs[mode].label);
    }
  }
  function onPointerDown(e) {
    if (!active) return;
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  }
  function onPointerUp(e) {
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
  }
  function onClick() {
    if (!active || !hoverTarget) return;
    const grp = hoverTarget.userData.panel;
    const idx = panels.indexOf(grp);
    if (idx >= 0) applyMode(idx);
    else setLabel(grp.userData.label);
  }
  function onKeyDown(e) {
    if (!active) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { applyMode(mode + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { applyMode(mode - 1); e.preventDefault(); }
    else if (e.key === "Escape") { onLabel?.(""); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") { setLabel(panelDefs[mode].label); e.preventDefault(); }
  }

  canvas.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("click", onClick);
  workspace.addEventListener("keydown", onKeyDown);

  /* ---------- Resize ---------- */
  function resize() {
    const w = workspace.clientWidth || 480;
    const h = workspace.clientHeight || 520;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 520 ? 48 : 38;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(workspace);
  resize();

  /* ---------- Render loop (only while visible) ---------- */
  function frame() {
    if (!running || disposed) return;
    raf = requestAnimationFrame(frame);
    const time = clock.getElapsedTime();

    targetRX *= 0.995;
    curRX = lerp(curRX, targetRX, 0.055);
    curRY = lerp(curRY, targetRY + dragRot, 0.055);
    root.rotation.x = curRX + Math.sin(time * 0.32) * 0.018;
    root.rotation.y = curRY + Math.sin(time * 0.23) * 0.05;
    boardGroup.position.y = Math.sin(time * 0.7) * 0.075;
    boardGroup.rotation.z = Math.sin(time * 0.25) * 0.018;

    if (!dragging) {
      dragVel *= 0.92;
      dragRot = lerp(dragRot, dragRot + dragVel, 0.5);
      dragRot *= 0.985;
    } else {
      dragRot += dragVel * 0.6;
      dragVel *= 0.7;
    }

    // travelling circuit signals
    signals.forEach((s, i) => {
      const p = curves[i].getPointAt((time * 0.16 + i * 0.24) % 1);
      s.position.copy(p);
      s.scale.setScalar(active ? 1.25 : 0.9);
    });
    led.material.opacity = 1;
    led.scale.setScalar(0.85 + Math.sin(time * 3.4) * 0.2);

    // panel hover + floating
    panels.forEach((p, i) => {
      const target = p.userData.targetScale;
      p.scale.setScalar(lerp(p.scale.x, target, 0.1));
      p.position.y = p.userData.baseY + Math.sin(time * 0.8 + i * 1.7) * 0.09;
      p.rotation.z = panelDefs[i].rot + Math.sin(time * 0.5 + i) * 0.018;
    });

    rings.forEach((r, i) => {
      r.rotation.z = time * (0.04 + i * 0.025) * (i % 2 ? -1 : 1);
      r.material.opacity = (active ? 0.16 : 0.09) / (i + 1);
    });
    particles.rotation.y = time * 0.012;
    particles.rotation.x = Math.sin(time * 0.1) * 0.04;
    partMat.opacity = active ? 0.72 : 0.5;

    // smooth light colour transitions
    lights.forEach((l, i) => {
      l.color.lerp(targetColors[i], 0.035);
      l.intensity = (active ? 3.1 : 2.3) + Math.sin(time * 1.2 + i * 2) * 0.25;
    });

    // hover raycast only while exploring
    if (active) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactive, false)[0];
      const next = hit?.object || null;
      if (next !== hoverTarget) {
        if (hoverTarget) hoverTarget.userData.panel.userData.targetScale = 1;
        hoverTarget = next;
        if (hoverTarget) {
          hoverTarget.userData.panel.userData.targetScale = 1.1;
          setLabel(hoverTarget.userData.panel.userData.label);
          canvas.style.cursor = "pointer";
        } else {
          setLabel(panelDefs[mode].label);
          canvas.style.cursor = "";
        }
      }
    }

    renderer.render(scene, camera);
  }

  function start() {
    if (running || disposed || document.hidden) return;
    running = true;
    clock.getDelta();
    frame();
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const visIO = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) start(); else stop();
  }, { rootMargin: "80px" });
  visIO.observe(workspace);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  start();
  onReady?.();

  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    visIO.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("click", onClick);
    workspace.removeEventListener("keydown", onKeyDown);
    geometries.forEach((x) => x.dispose());
    materials.forEach((x) => x.dispose());
    textures.forEach((x) => x.dispose());
    renderer.dispose();
    renderer.forceContextLoss?.();
  }
  window.addEventListener("pagehide", dispose, { once: true });

  return {
    setActive(value) {
      active = Boolean(value);
      if (active) {
        workspace.tabIndex = 0;
        applyMode(mode);
        start();
      } else {
        workspace.removeAttribute("tabindex");
        if (hoverTarget) { hoverTarget.userData.panel.userData.targetScale = 1; hoverTarget = null; }
        setLabel("");
        canvas.style.cursor = "";
      }
    },
    focus() { if (active) workspace.focus({ preventScroll: true }); },
    announce() { applyMode(mode); },
    dispose
  };
}
