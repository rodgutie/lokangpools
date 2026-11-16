(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const progressOf = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const menuBtn = $('.nav__menu');
  const menu = $('#mobile-menu');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    menuBtn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }));

  /* ---------- hero: aerial → arena → lanes → underwater ---------- */
  const dive = $('.dive');
  const s1 = $('.dive__s1'), s2 = $('.dive__s2'), s3 = $('.dive__s3');
  const under = $('.dive__under');
  const surface = $('.dive__surface');
  const copyA = $('.dive__copy--a'), copyM = $('.dive__copy--m'), copyB = $('.dive__copy--b');
  const dot = $('.dive__track i');
  const depthTxt = $('.dive__depth');
  const cue = $('.dive__cue');
  let diveP = 0;

  const cc = $('.dive__caustics');
  const cx = cc.getContext('2d');
  const CW = 160, CH = 90;
  cc.width = CW; cc.height = CH;
  const cImg = cx.createImageData(CW, CH);
  function drawCaustics(t) {
    const d = cImg.data;
    for (let y = 0; y < CH; y++) {
      for (let x = 0; x < CW; x++) {
        const u = x / CW * 9, v = y / CH * 6;
        const s = Math.sin(u + t * 0.9) + Math.sin(v * 1.3 - t * 0.7) + Math.sin((u + v) * 0.8 + t * 0.5) + Math.sin(Math.hypot(u - 4, v - 3) * 1.6 - t * 1.1);
        const b = Math.pow(1 - Math.abs(s) / 4, 6) * 255;
        const i = (y * CW + x) * 4;
        d[i] = b * 0.8; d[i + 1] = b; d[i + 2] = b; d[i + 3] = 255;
      }
    }
    cx.putImageData(cImg, 0, 0);
  }

  const bc = $('.dive__bubbles');
  const bx = bc.getContext('2d');
  let bubbles = [];
  function sizeBubbles() { bc.width = innerWidth * devicePixelRatio; bc.height = innerHeight * devicePixelRatio; }
  sizeBubbles(); addEventListener('resize', sizeBubbles);
  function drawBubbles(intensity) {
    const W = bc.width, H = bc.height, r0 = devicePixelRatio;
    if (bubbles.length < 160 * intensity) {
      for (let k = 0; k < 4; k++) bubbles.push({ x: Math.random() * W, y: H + Math.random() * 40, r: (1 + Math.random() * 5) * r0, s: (1.5 + Math.random() * 4) * r0, w: Math.random() * 6.28 });
    }
    bx.clearRect(0, 0, W, H);
    bx.strokeStyle = 'rgba(255,255,255,.75)';
    bx.fillStyle = 'rgba(255,255,255,.12)';
    bx.lineWidth = r0;
    bubbles = bubbles.filter((b) => {
      b.y -= b.s; b.w += 0.08; b.x += Math.sin(b.w) * 0.6 * r0;
      bx.beginPath(); bx.arc(b.x, b.y, b.r, 0, 6.283); bx.fill(); bx.stroke();
      return b.y > -20;
    });
  }

  function show(el, o) {
    el.style.opacity = o;
    el.style.visibility = o < 0.02 ? 'hidden' : 'visible';
    el.setAttribute('aria-hidden', o < 0.5 ? 'true' : 'false');
  }

  function updateDive() {
    const r = dive.getBoundingClientRect();
    diveP = clamp(-r.top / (r.height - innerHeight));
    const p = diveP;
    // stage 1: aerial, fly in
    s1.style.transform = `scale(${1 + smooth(0, 0.34, p) * 0.7})`;
    s1.style.opacity = 1 - smooth(0.24, 0.34, p);
    // stage 2: inside the arena
    s2.style.opacity = smooth(0.24, 0.34, p) * (1 - smooth(0.5, 0.58, p));
    s2.style.transform = `scale(${1.12 + smooth(0.24, 0.58, p) * 0.45})`;
    // stage 3: down the lanes, then under
    s3.style.opacity = smooth(0.5, 0.58, p);
    s3.style.transform = `scale(${1.08 + smooth(0.5, 1, p) * 0.7})`;
    const sub = smooth(0.66, 0.8, p);
    s3.style.filter = `blur(${sub * 3 + smooth(0.6, 0.68, p) * 4 * (1 - sub)}px) saturate(${1 + sub * 0.3})`;
    under.style.opacity = sub;
    surface.style.transform = `translateY(${-smooth(0.6, 0.76, p) * 165}vh)`;
    // copy
    show(copyA, 1 - smooth(0.06, 0.2, p));
    copyA.style.transform = `translateY(${-smooth(0.06, 0.2, p) * 60}px)`;
    show(copyM, smooth(0.36, 0.42, p) * (1 - smooth(0.54, 0.6, p)));
    const b = smooth(0.82, 0.92, p);
    show(copyB, b);
    copyB.style.transform = `translateY(${(1 - b) * 40}px)`;
    cue.style.opacity = 1 - smooth(0.02, 0.08, p);
    dot.style.top = (p * 100) + '%';
    depthTxt.textContent = (smooth(0.66, 1, p) * 3).toFixed(2) + ' m';
    nav.classList.toggle('is-solid', r.bottom < 80 || !menu.hidden);
  }

  /* ---------- steel pinned steps ---------- */
  const steelPin = $('.steel__pin');
  const steps = $$('.steel__step');
  const steelPhoto = $('.steel__photo');
  function updateSteel() {
    if (innerWidth <= 900) return;
    const idx = Math.min(2, Math.floor(progressOf(steelPin) * 3));
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    steelPhoto.style.setProperty('--zoom', (1.05 + idx * 0.14).toFixed(2));
    steelPhoto.style.setProperty('--mark', idx >= 1 ? 1 : 0);
  }

  /* ---------- structure: parallax + water filling the section drawing ---------- */
  const structure = $('.structure');
  const sPhoto = $('.structure__photo img');
  const draw = $('.section-draw');
  function updateStructure() {
    const r = structure.getBoundingClientRect();
    const t = clamp((innerHeight - r.top) / (innerHeight + r.height));
    sPhoto.style.setProperty('--py', `${-t * 16}%`);
    const d = draw.getBoundingClientRect();
    draw.style.setProperty('--fill', smooth(0.15, 0.75, (innerHeight - d.top) / (innerHeight + d.height)).toFixed(3));
  }

  /* ---------- build horizontal ---------- */
  const buildPin = $('.build__pin');
  const track = $('.build__track');
  const prog = $('.build__progress');
  function updateBuild() {
    if (innerWidth <= 760) { track.style.transform = ''; return; }
    const p = progressOf(buildPin);
    track.style.transform = `translate3d(${-(track.scrollWidth - innerWidth) * p}px,0,0)`;
    prog.style.setProperty('--p', p.toFixed(3));
  }

  let ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; updateDive(); updateSteel(); updateStructure(); updateBuild(); }); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  if (!reduce) {
    const loop = (ms) => {
      const t = ms / 1000;
      if (diveP > 0.62 && diveP < 1) {
        drawCaustics(t);
        drawBubbles(smooth(0.62, 0.74, diveP) * (1 - smooth(0.9, 1, diveP) * 0.7));
      } else if (bubbles.length) { bubbles = []; bx.clearRect(0, 0, bc.width, bc.height); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  } else {
    drawCaustics(0);
  }

  /* ---------- salt-spray lab (real test photos) ---------- */
  const lab = {
    zam:   { 100: 'clean', 1000: 'clean', 4000: 'clean' },
    zn:    { 100: 'ok', 1000: 'rust', 4000: 'stopped' },
    alzn:  { 100: 'ok', 1000: 'rust', 4000: 'stopped' },
    zn5al: { 100: 'ok', 1000: 'ok', 4000: 'rust' },
  };
  const tags = { clean: 'No red rust', ok: '', rust: 'Red rust', stopped: 'Rusted out · test ended' };
  function setLab(t) {
    $$('.lab__t').forEach((b) => { const on = b.dataset.t === t; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    $$('.lab__row').forEach((row) => {
      const key = row.dataset.row, state = lab[key][t];
      const cell = $('.lab__cell', row), img = $('img', cell), tag = $('.lab__tag', cell);
      const src = state === 'stopped' ? `salt-${key}-1000.jpg` : `salt-${key}-${t}.jpg`;
      if (img.getAttribute('src') !== src) img.src = src;
      cell.classList.toggle('is-stopped', state === 'stopped');
      tag.textContent = tags[state];
      tag.className = 'lab__tag mono' + (state === 'rust' || state === 'stopped' ? ' is-rust' : state === 'clean' ? ' is-clean' : '');
    });
  }
  $$('.lab__t').forEach((b) => b.addEventListener('click', () => setLab(b.dataset.t)));
  setLab('4000');
  // walk through the hours once when the lab first scrolls into view
  const labEl = $('#lab');
  const lio = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    lio.disconnect();
    if (reduce) return;
    setLab('100');
    setTimeout(() => setLab('1000'), 1400);
    setTimeout(() => setLab('4000'), 3000);
  }, { threshold: 0.45 });
  lio.observe(labEl);

  /* ---------- projects: tap to step inside ---------- */
  $$('.project').forEach((p) => p.addEventListener('click', () => p.setAttribute('aria-pressed', String(p.getAttribute('aria-pressed') !== 'true'))));

  /* ---------- safety vitals ---------- */
  if (!reduce) {
    const hrs = $$('[data-hr]');
    setInterval(() => hrs.forEach((h) => { h.textContent = +h.dataset.hr + Math.round(Math.random() * 6 - 3); }), 1200);
  }

  /* ---------- reveals & counters ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, n = +el.dataset.count;
      if (reduce || n === 0) return;
      const t0 = performance.now();
      const step = (t) => { const k = clamp((t - t0) / 1600); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('.proof__num').forEach((n) => cio.observe(n));

  /* ---------- form ---------- */
  const form = $('.quote__form');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = $('#f-name'), email = $('#f-email'), err = $('.form__error', form);
    const okName = name.value.trim().length > 1;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.setAttribute('aria-invalid', String(!okName));
    email.setAttribute('aria-invalid', String(!okEmail));
    if (!okName || !okEmail) { err.hidden = false; (okName ? email : name).focus(); return; }
    err.hidden = true;
    $$('.field, button[type=submit]', form).forEach((el) => { el.hidden = true; });
    const done = $('.form__done', form); done.hidden = false; done.setAttribute('tabindex', '-1'); done.focus();
  });
})();
