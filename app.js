/* Atrijo Pal — portfolio. Plain JS + canvas. No dependencies. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[(Math.random() * a.length) | 0];
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAL = [C.pink, C.mint, C.sun, C.sky, C.lilac, C.tang];
const FONT_D = "'Bagel Fat One','Arial Rounded MT Bold',system-ui,sans-serif";
const FONT_B = "'Bricolage Grotesque',system-ui,sans-serif";
const FONT_M = "'DM Mono',ui-monospace,monospace";

function fit(cv) {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}
function watchVisible(el, cb) {
  const io = new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { rootMargin: '120px' });
  io.observe(el);
}
function debounce(fn, ms = 120) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* iridescent glossy bubble used everywhere */
function gloss(ctx, x, y, r, color, alpha = 1, border = C.ink) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = color; ctx.fill();
  let g = ctx.createRadialGradient(x - r * .25, y - r * .3, r * .1, x, y, r);
  g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(23,20,59,.28)');
  ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - r * .38, y - r * .5, r * .26, r * .13, -.6, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
  ctx.lineWidth = Math.max(1.5, r * .035); ctx.strokeStyle = border; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.restore();
}
function fitText(ctx, text, maxW, size, font, weight = '') {
  ctx.font = `${weight} ${size}px ${font}`;
  const w = ctx.measureText(text).width;
  return w > maxW ? size * maxW / w : size;
}
function wrap(ctx, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur); return lines;
}

/* ============ cursor ============ */
const cur = $('#cursor');
if (cur && matchMedia('(hover:hover)').matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
  (function loop() { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.transform = `translate(${cx - cur.offsetWidth / 2}px,${cy - cur.offsetHeight / 2}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => { cur.classList.toggle('big', !!e.target.closest('a,button,.filter,.chip,.repo')); });
}

/* ============ hero text ============ */
(function () {
  const cols = [[C.pink, '#ff9ad0'], [C.sun, '#ffe08a'], [C.mint, '#8ff3d6'], [C.sky, '#9fb4ff'], [C.lilac, '#ddc6ff'], [C.tang, '#ffb48c']];
  let i = 0;
  $$('#name .word').forEach(w => {
    const t = w.textContent; w.textContent = ''; w.setAttribute('aria-hidden', 'true');
    [...t].forEach(ch => {
      const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
      const c = cols[i % cols.length]; s.style.setProperty('--c1', c[0]); s.style.setProperty('--c2', c[1]);
      s.style.setProperty('--i', i); s.style.setProperty('--rot', (Math.random() * 16 - 8) + 'deg'); i++; w.appendChild(s);
    });
  });
  const roles = ['ML engineer', 'builder of LLM systems with receipts', 'full-stack @ KensaraAI', 'ECE @ IIT Guwahati', 'hackathon winner ×3', 'causal-inference nerd'];
  const el = $('#role'); let ri = 0, ci = 0, del = false;
  (function tick() {
    const full = roles[ri];
    el.innerHTML = `~/atrijo <b>$</b> ${full.slice(0, ci)}<span class="caret"></span>`;
    if (!del && ci < full.length) { ci++; setTimeout(tick, 55); }
    else if (!del) { del = true; setTimeout(tick, 1600); }
    else if (ci > 0) { ci--; setTimeout(tick, 28); }
    else { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 250); }
  })();
  const m = $('#marquee'); if (m) m.innerHTML = [...MARQUEE, ...MARQUEE].map(t => `<span>${t}</span>`).join('');
})();

/* ============ THE BUBBLE CHAMBER (hero) ============ */
(function () {
  const hero = $('#top'), cv = $('#chamber'); let { ctx, w: W, h: H } = fit(cv);
  const bubbles = [], tracks = [], rings = [], bigs = [];
  let visible = true, mouse = { x: -999, y: -999, px: 0, py: 0, t: 0 };
  const MAXB = REDUCED ? 800 : 5500;
  function mkBig(bottom) {
    const r = rand(18, 74);
    return { x: rand(0, W), y: bottom ? H + r + rand(0, 200) : rand(0, H), r, vy: rand(.25, .7) * (90 / (r + 40)) + .15, ph: rand(0, TAU), h: rand(0, 360) };
  }
  function init() { bigs.length = 0; const n = REDUCED ? 5 : clamp(Math.round(W / 85), 8, 20); for (let i = 0; i < n; i++) bigs.push(mkBig(false)); }
  init();
  addEventListener('resize', debounce(() => { ({ ctx, w: W, h: H } = fit(cv)); init(); }));
  const track = (x, y, a, s, q, col, decay) => tracks.push({ x, y, a, s, q, col, n: 0, decay });
  function burst(x, y, n = 7) {
    for (let i = 0; i < n; i++) track(x, y, rand(0, TAU), rand(4, 9), i % 2 ? 1 : -1, pick(PAL));
    rings.push({ x, y, r: 4, life: 1 });
  }
  function autoEvent() {
    const x = rand(W * .05, W * .95), y = rand(H * .05, H * .95), a = rand(0, TAU);
    track(x, y, a, rand(5, 7), 0, C.sun, rand(30, 70));
  }
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now();
    mouse.x = x; mouse.y = y;
    const dx = x - mouse.px, dy = y - mouse.py, d = Math.hypot(dx, dy);
    if (d > 10 && now - mouse.t > 28) {
      track(x, y, Math.atan2(dy, dx), 3.5 + Math.min(d, 40) * .13, Math.random() < .5 ? 1 : -1, pick(PAL));
      mouse.px = x; mouse.py = y; mouse.t = now;
    }
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  hero.addEventListener('pointerdown', e => {
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (let i = bigs.length - 1; i >= 0; i--) {
      const b = bigs[i];
      if (Math.hypot(b.x - x, b.y - y) < b.r) { burst(b.x, b.y, 9 + (b.r / 12 | 0)); bigs[i] = mkBig(true); return; }
    }
    burst(x, y, 7);
  });
  watchVisible(hero, v => visible = v);
  for (let i = 0; i < 3; i++) autoEvent();
  let last = 0, autoT = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(2, (t - last) / 16.7 || 1); last = t;
    ctx.clearRect(0, 0, W, H);
    if (!REDUCED && (autoT -= dt) < 0) { autoT = rand(40, 90); autoEvent(); }
    // physics: tracks curve in a magnetic field, losing energy -> spiral
    for (let i = tracks.length - 1; i >= 0; i--) {
      const k = tracks[i];
      for (let s = 0; s < 2; s++) {
        k.x += Math.cos(k.a) * k.s * dt * .7; k.y += Math.sin(k.a) * k.s * dt * .7;
        k.a += k.q * (0.014 + 0.06 / (k.s + .8)) * dt;
        k.s *= k.q === 0 ? 1 : 0.989; k.n++;
        if (bubbles.length < MAXB) bubbles.push({ x: k.x + rand(-.6, .6), y: k.y + rand(-.6, .6), r: .7 + k.s * .26, life: 1, d: rand(.0035, .008), c: k.col });
        if (k.decay && k.n === Math.round(k.decay)) {
          track(k.x, k.y, k.a + .5, k.s * .95, 1, C.pink); track(k.x, k.y, k.a - .5, k.s * .95, -1, C.mint);
          rings.push({ x: k.x, y: k.y, r: 3, life: 1 }); tracks.splice(i, 1); break;
        }
      }
      if (tracks[i] === k && (k.s < .35 || k.x < -40 || k.x > W + 40 || k.y < -40 || k.y > H + 40 || k.n > 700)) tracks.splice(i, 1);
    }
    // draw bubbles (little vapor beads)
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.life -= b.d * dt; if (b.life <= 0) { bubbles[i] = bubbles[bubbles.length - 1]; bubbles.pop(); continue; }
      b.r += .004 * dt;
      ctx.globalAlpha = b.life * b.life; ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // rings
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; r.r += 4 * dt; r.life -= .03 * dt; if (r.life <= 0) { rings.splice(i, 1); continue; }
      ctx.globalAlpha = r.life; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // big soap bubbles
    for (const b of bigs) {
      b.ph += .012 * dt; b.y -= b.vy * dt; b.x += Math.sin(b.ph) * .35 * dt;
      const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy), R = b.r + 90;
      if (d < R) { const f = (1 - d / R) * 2.2; b.x += dx / d * f * dt; b.y += dy / d * f * dt; }
      if (b.y < -b.r * 2) Object.assign(b, mkBig(true));
      const g = ctx.createRadialGradient(b.x - b.r * .3, b.y - b.r * .35, b.r * .05, b.x, b.y, b.r);
      g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.7, 'rgba(255,255,255,.03)'); g.addColorStop(1, 'rgba(255,255,255,.2)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
      const lg = ctx.createLinearGradient(b.x - b.r, b.y - b.r, b.x + b.r, b.y + b.r);
      lg.addColorStop(0, C.pink); lg.addColorStop(.33, C.sun); lg.addColorStop(.66, C.mint); lg.addColorStop(1, C.sky);
      ctx.globalAlpha = .75; ctx.strokeStyle = lg; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.stroke();
      ctx.globalAlpha = .9; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(b.x - b.r * .4, b.y - b.r * .5, b.r * .2, b.r * .09, -.6, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
  requestAnimationFrame(frame);
})();

/* ============ reveal, counters, nav ============ */
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.classList.contains('cmp')) e.target.classList.add('go');
    $$('[data-count]', e.target).forEach(countUp); if (e.target.hasAttribute('data-count')) countUp(e.target);
  }), { threshold: .12 });
  window.__reveal = () => $$('.rv:not(.in),.cmp:not(.go)').forEach(el => io.observe(el));
  window.__reveal();
  function countUp(el) {
    if (el.__done) return; el.__done = true;
    const to = +el.dataset.count, dec = +el.dataset.dec || 0, pre = el.dataset.prefix || '', t0 = performance.now();
    (function s(t) { const p = clamp((t - t0) / 1500, 0, 1), e = 1 - Math.pow(1 - p, 4); el.textContent = pre + (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(s); })(t0);
  }
  const links = $$('.nav a[href^="#"]'), secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => so.observe(s));
  const mail = $('#copyMail'), toast = $('#toast');
  mail?.addEventListener('click', () => {
    (navigator.clipboard?.writeText(mail.dataset.mail) || Promise.resolve()).finally(() => { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); });
  });
})();

/* ============ generic bubble physics world ============ */
class World {
  constructor(cv, nodes, o) {
    Object.assign(this, { cv, nodes, o }); this.mouse = { x: -999, y: -999 }; this.hover = null; this.drag = null; this.visible = false; this.t = 0;
    this.resize(); nodes.forEach((n, i) => { n.x = this.w * rand(.2, .8); n.y = this.h * rand(.2, .8); n.vx = n.vy = 0; n.sc = 0; n.st = 1; n.delay = i * 4; });
    addEventListener('resize', debounce(() => this.resize()));
    cv.style.touchAction = 'pan-y';
    cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top; if (this.drag && Math.hypot(this.mouse.x - this.down.x, this.mouse.y - this.down.y) > 6) this.moved = true; });
    cv.addEventListener('pointerleave', () => { this.mouse.x = this.mouse.y = -999; if (!this.drag) this.hover = null; });
    cv.addEventListener('pointerdown', e => {
      const r = cv.getBoundingClientRect(); this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top; this.findHover();
      if (this.hover) { this.drag = this.hover; this.down = { ...this.mouse }; this.moved = false; cv.setPointerCapture?.(e.pointerId); }
    });
    const up = () => { if (!this.drag) return; if (!this.moved) o.onClick?.(this.drag); this.drag = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', () => { this.drag = null; });
    watchVisible(cv, v => this.visible = v);
    requestAnimationFrame(t => this.loop(t));
  }
  resize() { const f = fit(this.cv); this.ctx = f.ctx; this.w = f.w; this.h = f.h; this.k = Math.sqrt(this.w * this.h / this.o.ref); }
  R(n) { return n.rb * this.k * n.sc; }
  findHover() {
    let best = null;
    for (const n of this.nodes) { if (n.sc < .3) continue; if (Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y) < this.R(n) && (!best || n.rb < best.rb)) best = n; }
    this.hover = best;
  }
  loop(t) {
    requestAnimationFrame(t2 => this.loop(t2));
    if (!this.visible) return;
    this.t++; const { nodes, w, h } = this, pull = this.o.pull || .0006;
    if (!this.drag) this.findHover(); else this.hover = this.drag;
    this.cv.style.cursor = this.drag ? 'grabbing' : this.hover ? 'pointer' : 'default';
    for (const n of nodes) {
      if (this.t < n.delay) continue;
      n.sc += ((n.st * (n === this.hover ? 1.07 : 1)) - n.sc) * .14;
      if (n === this.drag) { const px = n.x, py = n.y; n.x += (this.mouse.x - n.x) * .4; n.y += (this.mouse.y - n.y) * .4; n.vx = (n.x - px) * .9; n.vy = (n.y - py) * .9; continue; }
      n.vx += (w / 2 - n.x) * pull + Math.sin(this.t * .012 + n.delay) * .015; n.vy += (h / 2 - n.y) * pull + Math.cos(this.t * .011 + n.delay) * .015;
      n.vx *= .97; n.vy *= .97; n.x += n.vx; n.y += n.vy;
    }
    for (let it = 0; it < 2; it++) for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]; if (a.sc < .3 || b.sc < .3) continue;
      let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01; const m = this.R(a) + this.R(b) + 3;
      if (d < m) {
        const ov = (m - d) / 2, nx = dx / d, ny = dy / d, ad = a === this.drag, bd = b === this.drag;
        if (!ad) { a.x -= nx * ov * (bd ? 2 : 1); a.y -= ny * ov * (bd ? 2 : 1); a.vx -= nx * ov * .05; a.vy -= ny * ov * .05; }
        if (!bd) { b.x += nx * ov * (ad ? 2 : 1); b.y += ny * ov * (ad ? 2 : 1); b.vx += nx * ov * .05; b.vy += ny * ov * .05; }
      }
    }
    for (const n of nodes) { const r = this.R(n); if (n.x < r) { n.x = r; n.vx = Math.abs(n.vx) * .7; } if (n.x > w - r) { n.x = w - r; n.vx = -Math.abs(n.vx) * .7; } if (n.y < r) { n.y = r; n.vy = Math.abs(n.vy) * .7; } if (n.y > h - r) { n.y = h - r; n.vy = -Math.abs(n.vy) * .7; } }
    this.ctx.clearRect(0, 0, w, h);
    this.o.before?.(this.ctx, this);
    [...nodes].sort((a, b) => (a === this.hover) - (b === this.hover)).forEach(n => { if (n.sc > .02) this.o.draw(this.ctx, n, this, this.R(n)); });
    this.o.hoverChange?.(this.hover, this);
  }
}

/* ============ NUMBERS board ============ */
(function () {
  const cv = $('#numCanvas'), tip = $('#numTip'), board = $('#numBoard');
  const nodes = NUMBERS.map(d => ({ d, rb: d.s * .9, color: d.c }));
  let lastH = null;
  const world = new World(cv, nodes, {
    ref: 1180 * 640, pull: .0009,
    draw(ctx, n, wd, r) {
      gloss(ctx, n.x, n.y, r, n.color, 1, '#17143B');
      ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const v = n.d.v, fs = Math.min(r * .55, fitText(ctx, v, r * 1.55, r * .55, FONT_D));
      ctx.font = `${fs}px ${FONT_D}`; ctx.fillText(v, n.x, n.y - r * .08);
      if (r > 40) { ctx.font = `700 ${Math.max(9, r * .15)}px ${FONT_B}`; const ls = wrap(ctx, n.d.t, r * 1.5).slice(0, 2); ls.forEach((l, i) => ctx.fillText(l, n.x, n.y + r * .33 + i * r * .17)); }
    },
    onClick(n) { if (n.d.p) { selectProject(n.d.p, true); } },
    hoverChange(h, wd) {
      if (h) {
        if (h !== lastH) { tip.innerHTML = `<b>${h.d.v}</b><strong>${h.d.t}</strong><br>${h.d.d}${h.d.p ? '<br><em style="color:#4A4577">click → open the project</em>' : ''}`; lastH = h; }
        const tw = 280, x = clamp(wd.mouse.x + 18, 8, wd.w - tw - 8), y = clamp(wd.mouse.y + 18, 8, wd.h - 150);
        tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('show');
      } else { tip.classList.remove('show'); lastH = null; }
    }
  });
})();

/* ============ before/after bars ============ */
(function () {
  const el = $('#compare');
  el.innerHTML = COMPARES.map(c => `<div class="cmp rv"><h4>${c.h}</h4>${c.rows.map(r => `<div class="row"><span class="k">${r[0]}</span><div class="bar"><i style="--w:${(r[1] / r[2] * 100).toFixed(1)}%;background:${r[3]}">${r[4]}</i></div></div>`).join('')}<p>${c.note}</p></div>`).join('');
  window.__reveal();
})();

/* ============ PROJECTS ============ */
const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
let selected = null, clusterWorld = null, shipHL = null;
function panelHTML(p) {
  const links = [];
  if (p.live) links.push(`<a class="btn mint" href="${p.live}" target="_blank" rel="noopener">Live site ↗</a>`);
  if (p.repo) links.push(`<a class="btn ghost" href="${GH}${p.repo}" target="_blank" rel="noopener">${p.repoLabel || 'GitHub repo'} ↗</a>`);
  return `<div class="tagrow">${p.tags.map(t => `<span class="mini">${t}</span>`).join('')}</div>
  <span class="award" style="background:${p.awardColor}">${p.award}</span>
  <h3>${p.name}</h3>
  <div class="when">${[p.team, new Date(p.date).toLocaleDateString('en', { month: 'short', year: 'numeric' }) + (p.repo ? ' · repo started' : '')].filter(Boolean).join(' · ')}</div>
  <p>${p.blurb}</p>
  <ul class="facts" style="--c:${p.color}">${p.facts.map(f => `<li><span>${f}</span></li>`).join('')}</ul>
  ${p.honest ? `<div class="honest"><b>Honest note.</b> ${p.honest}</div>` : ''}
  <div class="stack-row">${p.skills.map(s => `<span class="mini">${s}</span>`).join('')}</div>
  <div class="links">${links.join('')}</div>`;
}
function selectProject(id, scroll) {
  const p = byId[id]; if (!p) return; selected = id;
  const panel = $('#panel'); panel.innerHTML = panelHTML(p); panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); panel.scrollTop = 0;
  if (scroll) $('#projects .filters').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}
window.selectProject = selectProject;

(function () {
  // filters
  const cats = ['All', ...new Set(PROJECTS.flatMap(p => p.tags))];
  const fe = $('#filters'); let active = 'All';
  fe.innerHTML = cats.map(c => `<button class="filter ${c === 'All' ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
  fe.addEventListener('click', e => {
    const b = e.target.closest('.filter'); if (!b) return; active = b.dataset.c;
    $$('.filter', fe).forEach(x => x.classList.toggle('on', x === b));
    clusterWorld.nodes.forEach(n => { n.st = (active === 'All' || n.p.tags.includes(active)) ? 1 : .42; n.dim = !(active === 'All' || n.p.tags.includes(active)); });
  });
  // cluster
  const nodes = PROJECTS.map(p => ({ p, rb: 22 + p.w * 6.2, color: p.color }));
  clusterWorld = new World($('#cluster'), nodes, {
    ref: 760 * 720, pull: .0011,
    draw(ctx, n, wd, r) {
      const p = n.p; ctx.save(); ctx.globalAlpha = n.dim ? .35 : 1;
      gloss(ctx, n.x, n.y, r, p.color, 1);
      if (selected === p.id) { ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.setLineDash([8, 7]); ctx.lineDashOffset = -wd.t * .5; ctx.beginPath(); ctx.arc(n.x, n.y, r + 8, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const lines = p.short.split('\n'); let fs = r * .3;
      lines.forEach(l => fs = Math.min(fs, fitText(ctx, l, r * 1.5, r * .3, FONT_D)));
      ctx.font = `${fs}px ${FONT_D}`;
      lines.forEach((l, i) => ctx.fillText(l, n.x, n.y + (i - (lines.length - 1) / 2) * fs * 1.05));
      ctx.restore();
    },
    onClick(n) { selectProject(n.p.id); }
  });
  selectProject('pcop');
  // repo grid
  $('#repoGrid').innerHTML = PROJECTS.filter(p => p.repo).map(p => `<a class="repo" style="--c:${p.color}" href="${GH}${p.repo}" target="_blank" rel="noopener">
    <div class="top"><span><i class="dot" style="background:${p.color}"></i>${p.lang || ''}</span><span>${p.date.slice(0, 7)}</span></div>
    <h5>${p.name}</h5><p>${p.blurb.length > 130 ? p.blurb.slice(0, 127) + '…' : p.blurb}</p></a>`).join('');
})();

/* ============ SHIPPING LOG scatter ============ */
(function () {
  const cv = $('#shipCanvas'); let { ctx, w, h } = fit(cv); let pts = [], hover = null, visible = false, grow = 0;
  const items = PROJECTS.filter(p => p.repo), d0 = new Date('2025-11-25'), d1 = new Date('2026-11-05');
  function layout() {
    ({ ctx, w, h } = fit(cv)); const L = w < 560 ? 70 : 150, T = 26, B = 40, lh = (h - T - B) / LANES.length;
    pts = items.map(p => ({ p, r: 7 + p.w * 2.4, x: L + (new Date(p.date) - d0) / (d1 - d0) * (w - L - 24), y: T + lh * (p.lane + .5) }));
    pts.sort((a, b) => a.x - b.x);
    pts.forEach((a, i) => { for (let j = 0; j < i; j++) { const b = pts[j]; if (b.p.lane !== a.p.lane) continue; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < a.r + b.r + 2) a.y += (j % 2 ? 1 : -1) * Math.min(lh * .32, a.r + b.r + 2 - d + 6); } });
    cv.__g = { L, T, B, lh };
  }
  layout(); addEventListener('resize', debounce(layout));
  cv.style.cursor = 'default';
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; hover = pts.find(q => Math.hypot(q.x - x, q.y - y) < q.r + 3) || null; cv.style.cursor = hover ? 'pointer' : 'default'; });
  cv.addEventListener('pointerleave', () => hover = null);
  cv.addEventListener('click', () => { if (hover) selectProject(hover.p.id, true); });
  watchVisible(cv, v => { visible = v; if (v && grow >= 1) grow = 0; });
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return; grow = Math.min(1, grow + .02);
    const { L, T, lh } = cv.__g; ctx.clearRect(0, 0, w, h);
    ctx.font = `12px ${FONT_M}`; ctx.textBaseline = 'middle';
    LANES.forEach((l, i) => {
      ctx.fillStyle = i % 2 ? 'rgba(23,20,59,.04)' : 'rgba(23,20,59,.0)'; ctx.fillRect(0, T + lh * i, w, lh);
      ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(w < 560 ? l.split(' ')[0] : l, 8, T + lh * (i + .5));
    });
    ctx.textAlign = 'center'; ctx.strokeStyle = 'rgba(23,20,59,.15)'; ctx.fillStyle = '#4A4577';
    for (let m = new Date('2025-12-01'); m < d1; m.setMonth(m.getMonth() + 1)) {
      const x = L + (m - d0) / (d1 - d0) * (w - L - 24); ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, h - 30); ctx.stroke();
      ctx.fillText(m.toLocaleDateString('en', { month: 'short' }) + (m.getMonth() === 0 || m.getMonth() === 11 && m.getFullYear() === 2025 ? " '" + String(m.getFullYear()).slice(2) : ''), x, h - 14);
    }
    pts.forEach((q, i) => {
      const e = clamp(grow * 1.6 - i * .05, 0, 1), r = q.r * Math.max(0, 1 - Math.pow(1 - e, 3)) * (q === hover ? 1.2 : 1);
      if (r > .5) gloss(ctx, q.x, q.y, r, q.p.color, selected === q.p.id || !selected || q === hover ? 1 : .85);
      if (selected === q.p.id && r > 1) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(q.x, q.y, r + 5, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    });
    if (hover) {
      const t = hover.p.name, d = hover.p.date; ctx.font = `700 13px ${FONT_B}`; const tw = Math.max(ctx.measureText(t).width, 90) + 24;
      let x = clamp(hover.x - tw / 2, 6, w - tw - 6), y = hover.y - hover.r - 52; if (y < 4) y = hover.y + hover.r + 10;
      ctx.fillStyle = C.paper || '#FFF5E6'; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, tw, 40, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(t, x + 12, y + 14); ctx.font = `11px ${FONT_M}`; ctx.fillStyle = '#4A4577'; ctx.fillText(d + ' · click to open', x + 12, y + 29);
    }
  })();
})();

/* ============ SKILL ↔ PROJECT network (force graph) ============ */
(function () {
  const cv = $('#netCanvas'), info = $('#netInfo'), ctrl = $('#netCtrl');
  const famColor = { 'Languages': C.sun, 'ML / AI': C.pink, 'Backend & Systems': C.mint, 'Frontend & Core': C.sky };
  const famOf = s => Object.keys(SKILL_FAMILIES).find(f => SKILL_FAMILIES[f].includes(s)) || 'Backend & Systems';
  const skillMap = new Map(), nodes = [], edges = [];
  PROJECTS.forEach(p => { const n = { kind: 'p', p, r: 15 + p.w * 2.2, color: p.color, id: p.id, deg: 0 }; nodes.push(n); n.i = nodes.length - 1;
    p.skills.forEach(s => { let sn = skillMap.get(s); if (!sn) { sn = { kind: 's', name: s, fam: famOf(s), color: famColor[famOf(s)], deg: 0, projects: [] }; skillMap.set(s, sn); nodes.push(sn); sn.i = nodes.length - 1; } sn.deg++; sn.projects.push(p); edges.push([n.i, sn.i]); n.deg++; }); });
  nodes.forEach(n => { if (n.kind === 's') n.r = 5 + n.deg * 2.6; });
  let { ctx, w, h } = fit(cv), visible = false, active = 'All', hover = null, drag = null, alpha = 1, t = 0;
  nodes.forEach((n, i) => { const a = i / nodes.length * TAU; n.x = w / 2 + Math.cos(a) * rand(80, 260); n.y = h / 2 + Math.sin(a) * rand(60, 220); n.vx = n.vy = 0; });
  const nb = nodes.map(() => new Set()); edges.forEach(([a, b]) => { nb[a].add(b); nb[b].add(a); });
  const fams = ['All', ...Object.keys(SKILL_FAMILIES)];
  ctrl.innerHTML = fams.map(f => `<button class="filter ${f === 'All' ? 'on' : ''}" data-f="${f}">${f}</button>`).join('');
  ctrl.addEventListener('click', e => { const b = e.target.closest('.filter'); if (!b) return; active = b.dataset.f; $$('.filter', ctrl).forEach(x => x.classList.toggle('on', x === b)); alpha = .6; });
  const inFam = n => active === 'All' || (n.kind === 's' ? n.fam === active : n.p && n.p.skills.some(s => skillMap.get(s).fam === active));
  addEventListener('resize', debounce(() => ({ ctx, w, h } = fit(cv))));
  const mouse = { x: -9, y: -9 };
  const find = () => { let b = null; for (const n of nodes) if (inFam(n) && Math.hypot(n.x - mouse.x, n.y - mouse.y) < n.r + 4 && (!b || n.r < b.r)) b = n; return b; };
  cv.style.touchAction = 'pan-y';
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  cv.addEventListener('pointerleave', () => { mouse.x = mouse.y = -99; });
  let down = null;
  cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; drag = find(); down = { ...mouse }; if (drag) { cv.setPointerCapture?.(e.pointerId); alpha = .5; } });
  cv.addEventListener('pointerup', () => { if (drag && down && Math.hypot(mouse.x - down.x, mouse.y - down.y) < 6 && drag.kind === 'p') selectProject(drag.id, true); drag = null; });
  watchVisible(cv, v => visible = v);
  function setInfo() {
    if (!hover) { info.textContent = 'hover a bubble · drag to rearrange · click a project to open it'; return; }
    info.innerHTML = hover.kind === 's' ? `<b>${hover.name}</b> · ${hover.fam}<br>used in ${hover.deg} project${hover.deg > 1 ? 's' : ''}: ${hover.projects.map(p => p.short.replace('\n', ' ')).join(', ')}` : `<b>${hover.p.name}</b><br>${hover.p.award}<br>${hover.deg} skills`;
  }
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return; t++;
    hover = drag || find(); cv.style.cursor = hover ? 'pointer' : 'default'; if (t % 4 === 0) setInfo();
    if (alpha > .01) alpha *= .992; if (!drag && alpha < .06) alpha = .06;
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < nodes.length; i++) { const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j]; let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 30, d = Math.sqrt(d2), f = (a.kind === 'p' || b.kind === 'p' ? 1700 : 650) / d2; const m = a.r + b.r + 4; if (d < m) f += (m - d) * .05; dx /= d; dy /= d; a.vx -= dx * f * alpha; a.vy -= dy * f * alpha; b.vx += dx * f * alpha; b.vy += dy * f * alpha; }
      a.vx += (cx - a.x) * .0014; a.vy += (cy - a.y) * .0016; }
    for (const [i, j] of edges) { const a = nodes[i], b = nodes[j]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, f = (d - (a.r + b.r + 70)) * .006 * (alpha + .2); a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f; }
    for (const n of nodes) { if (n === drag) { n.x += (mouse.x - n.x) * .35; n.y += (mouse.y - n.y) * .35; n.vx = n.vy = 0; continue; } n.vx *= .82; n.vy *= .82; n.x = clamp(n.x + n.vx, n.r + 4, w - n.r - 4); n.y = clamp(n.y + n.vy, n.r + 4, h - n.r - 4); }
    ctx.clearRect(0, 0, w, h);
    const hl = hover ? new Set([hover.i, ...nb[hover.i]]) : null;
    for (const [i, j] of edges) { const a = nodes[i], b = nodes[j]; const on = (!hl || (hl.has(i) && hl.has(j) && (i === hover.i || j === hover.i))) && inFam(a) && inFam(b);
      ctx.strokeStyle = on ? (hl ? '#FFF5E6' : 'rgba(255,245,230,.28)') : 'rgba(255,245,230,.05)'; ctx.lineWidth = on && hl ? 2 : 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    const order = [...nodes].sort((a, b) => (a.kind === 'p') - (b.kind === 'p'));
    for (const n of order) {
      const lit = (!hl || hl.has(n.i)) && inFam(n), a = lit ? 1 : .12;
      if (n.kind === 'p') { gloss(ctx, n.x, n.y, n.r * (n === hover ? 1.12 : 1), n.color, a);
        if (lit) { ctx.globalAlpha = a; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const ls = n.p.short.split('\n'); let fs = n.r * .36; ls.forEach(l => fs = Math.min(fs, fitText(ctx, l, n.r * 1.55, n.r * .36, FONT_D))); ctx.font = `${fs}px ${FONT_D}`; ls.forEach((l, k) => ctx.fillText(l, n.x, n.y + (k - (ls.length - 1) / 2) * fs * 1.05)); ctx.globalAlpha = 1; } }
      else { ctx.globalAlpha = a; ctx.fillStyle = n.color; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (n === hover ? 1.25 : 1), 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,245,230,.8)'; ctx.lineWidth = 1.5; ctx.stroke();
        if (lit && (n.deg >= 2 || hl || active !== 'All')) { ctx.fillStyle = '#FFF5E6'; ctx.font = `500 ${n.deg >= 3 ? 12 : 11}px ${FONT_M}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(n.name, n.x, n.y - n.r - 6); } ctx.globalAlpha = 1; }
    }
  })();
  const resumeSkills = { 'Languages': ['Python', 'C++', 'C', 'Java', 'TypeScript', 'SQL'], 'ML / AI': ['PyTorch', 'XGBoost', 'CNNs', 'GNNs (PyTorch Geometric)', 'NLP', 'LangGraph', 'RAG', 'Vector DBs (Qdrant, ChromaDB)', 'LLM Tool-Calling', 'Causal Inference', 'Model Optimization (fp16, torch.compile)'], 'Backend & Systems': ['FastAPI', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Azure', 'MLflow', 'Git', 'Linux'], 'Frontend & Core': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Data Structures & Algorithms'] };
  $('#skillcols').innerHTML = Object.entries(resumeSkills).map(([k, v]) => `<div class="skillcol"><h4 style="color:${famColor[k]}">${k}</h4>${v.map(s => `<span class="mini">${s}</span>`).join('')}</div>`).join('');
})();

/* ============ timeline ============ */
$('#timeline').innerHTML = JOURNEY.map((j, i) => `<div class="tl-item rv"><div class="card"><div class="d">${j.d}</div><h4>${j.h}</h4><p>${j.p}</p></div><div class="node" style="--i:${i};background:${j.c}"></div></div>`).join('');
window.__reveal();

/* ============ GitHub live ============ */
(function () {
  const tiles = (repos, followers, since) => {
    $('#ghLive').innerHTML = [[repos, 'public repos', C.pink], [followers, 'followers', C.mint], [since, 'on GitHub since', C.sun], ['3', 'podium finishes', C.sky]].map(([v, l, c], i) => `<div class="stat rv in" style="background:${c}"><b>${v}</b><span style="color:#17143B">${l}</span></div>`).join('');
  };
  const langCol = { Python: C.sky, JavaScript: C.sun, Solidity: C.lilac, HTML: C.tang, 'Jupyter Notebook': C.mint, TypeScript: C.pink };
  const bar = counts => {
    const tot = Object.values(counts).reduce((a, b) => a + b, 0), ent = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    $('#langBar').innerHTML = ent.map(([l, n]) => `<i style="flex:${n};background:${langCol[l] || C.ink}" title="${l}"></i>`).join('');
    $('#langLeg').innerHTML = ent.map(([l, n]) => `<span style="--c:${langCol[l] || C.ink}">${l} · ${n} repo${n > 1 ? 's' : ''}</span>`).join('');
  };
  const fb = {}; PROJECTS.forEach(p => { if (p.repo) { const l = p.lang === 'Jupyter' ? 'Jupyter Notebook' : p.lang; fb[l] = (fb[l] || 0) + 1; } });
  tiles(19, 4, '2025'); bar(fb);
  Promise.all([fetch('https://api.github.com/users/atrijopal').then(r => r.json()), fetch('https://api.github.com/users/atrijopal/repos?per_page=100').then(r => r.json())]).then(([u, rs]) => {
    if (!u || !Array.isArray(rs) || u.public_repos == null) return;
    tiles(u.public_repos, u.followers, new Date(u.created_at).getFullYear());
    const c = {}; rs.forEach(r => { if (r.language) c[r.language] = (c[r.language] || 0) + 1; }); if (Object.keys(c).length) bar(c);
  }).catch(() => {});
})();

/* ============ contact: rising pop-able bubbles ============ */
(function () {
  const sec = $('#contact'), cv = $('#contactCanvas'); let { ctx, w, h } = fit(cv), visible = false; const bs = [], ps = [];
  const mk = (bottom) => ({ x: rand(0, w), y: bottom ? h + 60 : rand(0, h), r: rand(10, 46), vy: rand(.3, 1), ph: rand(0, TAU), c: pick(PAL) });
  const reset = () => { bs.length = 0; for (let i = 0; i < (REDUCED ? 6 : clamp(w / 45, 10, 34)); i++) bs.push(mk(false)); };
  reset(); addEventListener('resize', debounce(() => { ({ ctx, w, h } = fit(cv)); reset(); }));
  watchVisible(sec, v => visible = v);
  sec.addEventListener('pointerdown', e => { const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (let i = bs.length - 1; i >= 0; i--) { const b = bs[i]; if (Math.hypot(b.x - x, b.y - y) < b.r + 6) { for (let k = 0; k < 14; k++) ps.push({ x: b.x, y: b.y, a: rand(0, TAU), s: rand(2, 6), life: 1, c: b.c }); bs[i] = mk(true); return; } } });
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return; ctx.clearRect(0, 0, w, h);
    for (const b of bs) { b.ph += .02; b.y -= b.vy; b.x += Math.sin(b.ph) * .5; if (b.y < -b.r) Object.assign(b, mk(true)); ctx.globalAlpha = .85; gloss(ctx, b.x, b.y, b.r, b.c, .85, 'rgba(255,245,230,.8)'); }
    for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; p.x += Math.cos(p.a) * p.s; p.y += Math.sin(p.a) * p.s; p.s *= .94; p.life -= .03; if (p.life <= 0) { ps.splice(i, 1); continue; } ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 3 + p.life * 3, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  })();
})();
})();
