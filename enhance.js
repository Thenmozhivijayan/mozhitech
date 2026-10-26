/* MozhiTech Solutions: animations + mobile polish
   Add this line just before </body> in index.html:
   <script src="enhance.js"></script>
   No other changes to your HTML are needed. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- CSS ---------- */
  var css = `
html{scroll-padding-top:78px;-webkit-tap-highlight-color:transparent}
.btn:active{transform:scale(.97)}
input,select,textarea{font-size:16px}

/* scroll reveal */
.mt-rv{opacity:0;transform:translate3d(0,26px,0);transition:opacity .7s ease var(--d,0s),transform .8s cubic-bezier(.2,.7,.2,1) var(--d,0s),border-color .3s,box-shadow .3s}
.mt-rv.mt-in{opacity:1;transform:none}

/* progress bar + nav */
.mt-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,var(--gold),var(--gold2));pointer-events:none}
nav{transition:box-shadow .3s,background .35s}
nav .wrap{transition:height .3s}
nav.mt-scrolled{box-shadow:0 8px 30px rgba(0,0,0,.25)}
nav.mt-scrolled .wrap{height:60px}
.nav-links a{transition:color .2s}
.nav-links a.active{color:var(--gold)}

/* hover + ambient motion */
.ico{transition:transform .35s cubic-bezier(.3,1.5,.5,1)}
.card:hover .ico,.plan:hover .ico{transform:scale(1.1) rotate(-6deg)}
.mock{transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.project:hover .mock{transform:translateY(-8px)}
.step{transition:border-color .3s}
.step:hover{border-color:var(--gold2)}
.marquee:hover .marquee-track{animation-play-state:paused}
.hero .gold-text{background-size:200% 100%;animation:mtShine 4s ease-in-out infinite alternate}
@keyframes mtShine{to{background-position:100% 0}}
.bg-glow{animation:mtDrift 16s ease-in-out infinite alternate;will-change:transform}
@keyframes mtDrift{to{transform:translate3d(-2%,2%,0) scale(1.06)}}
.wa-float{bottom:calc(18px + env(safe-area-inset-bottom,0px));right:calc(18px + env(safe-area-inset-right,0px));animation:mtRing 2.6s ease-out infinite}
@keyframes mtRing{0%{box-shadow:0 10px 26px rgba(0,0,0,.35),0 0 0 0 rgba(37,211,102,.5)}70%,100%{box-shadow:0 10px 26px rgba(0,0,0,.35),0 0 0 16px rgba(37,211,102,0)}}
.mt-theme *{transition:background-color .4s,color .4s,border-color .4s!important}

/* mobile menu */
.mt-burger{display:none;width:42px;height:42px;border-radius:12px;border:1px solid var(--line);background:var(--surface-solid);cursor:pointer;flex:none;place-content:center;gap:5px;padding:0}
.mt-burger span{display:block;width:18px;height:2px;border-radius:2px;background:var(--ink);transition:transform .3s,opacity .2s}
.mt-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.mt-burger.open span:nth-child(2){opacity:0}
.mt-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mt-menu{position:absolute;left:0;right:0;top:100%;display:grid;gap:4px;padding:10px 16px 18px;background:color-mix(in srgb,var(--bg) 96%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .25s,transform .25s,visibility .25s}
.mt-menu.open{opacity:1;visibility:visible;transform:none}
.mt-menu a{padding:14px 12px;border-radius:12px;font-weight:600;color:var(--muted)}
.mt-menu.open a{animation:mtIn .35s both}
@keyframes mtIn{from{opacity:0;transform:translateY(-6px)}}
.mt-menu a.active,.mt-menu a:hover{color:var(--gold);background:var(--gold-soft)}
.mt-menu .mt-menu-cta{background:linear-gradient(120deg,var(--gold),var(--gold2));color:#1a1405;text-align:center;margin-top:6px}
@media(max-width:860px){.mt-burger{display:grid}}
@media(min-width:861px){.mt-menu{display:none}}

/* mobile layout fixes */
@media(hover:none){.btn:hover,.card:hover,.project:hover,.phone:hover,.plan:hover{transform:none}}
@media(max-width:560px){
  .btn{min-height:46px}
  .hero-btns .btn{width:100%}
  .shot{height:220px;padding:22px 20px 0}
  .card,.member,.plan{padding:26px 22px}
  .project .info{padding:22px}
  .project-links .btn{flex:1}
  .contact-links a{word-break:break-all;font-size:.9rem;padding:14px}
  .contact-links svg{flex:none}
}
@media(max-width:400px){.logo{font-size:.95rem;gap:8px}.logo-mark{width:32px;height:32px}nav .wrap{gap:8px}}

@media(prefers-reduced-motion:reduce){
  .mt-rv{opacity:1!important;transform:none!important;transition:none!important}
  .hero .gold-text,.wa-float,.bg-glow{animation:none!important}
  html{scroll-behavior:auto}
}`;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- scroll reveal ---------- */
  function sib(el) { return Array.prototype.indexOf.call(el.parentNode.children, el); }
  function count(el) {
    var m = el.textContent.trim().match(/^(\d+)(\D*)$/);
    if (!m) return;
    var end = +m[1], suf = m[2], t0 = null;
    el.textContent = '0' + suf;
    (function f(t) {
      t0 = t0 || t;
      var p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(performance.now());
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var items = [];
    var add = function (sel, delay) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add('mt-rv');
        el.style.setProperty('--d', delay(el, i) + 's');
        items.push(el);
      });
    };
    add('.hero .eyebrow, .hero h1, .hero .lead, .hero-btns, .hero .stats', function (el, i) { return 0.05 + i * 0.1; });
    add('.section-head, .stack, .contact', function () { return 0; });
    add('.project, .card, .step, .plan, .member', function (el) { return (sib(el) % 3) * 0.09; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, d = parseFloat(el.style.getPropertyValue('--d')) || 0;
        el.classList.add('mt-in');
        io.unobserve(el);
        if (el.classList.contains('stats')) el.querySelectorAll('b').forEach(count);
        setTimeout(function () {
          el.classList.remove('mt-rv', 'mt-in');
          el.style.removeProperty('--d');
        }, 1100 + d * 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- scroll progress + nav state ---------- */
  var nav = document.querySelector('nav');
  var bar = document.createElement('div');
  bar.className = 'mt-progress';
  document.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      if (nav) nav.classList.toggle('mt-scrolled', scrollY > 8);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* active section link */
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        document.querySelectorAll('.nav-links a, .mt-menu a:not(.mt-menu-cta)').forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'work', 'services', 'process', 'pricing', 'about', 'contact'].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }

  /* ---------- mobile menu ---------- */
  var links = document.querySelector('.nav-links'), right = document.querySelector('.nav-right');
  if (nav && links && right) {
    var btn = document.createElement('button');
    btn.className = 'mt-burger';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    right.appendChild(btn);
    var menu = document.createElement('div');
    menu.className = 'mt-menu';
    menu.innerHTML = links.innerHTML + '<a href="#contact" class="mt-menu-cta">Get a website</a>';
    menu.querySelectorAll('a').forEach(function (a, i) { a.style.animationDelay = (i * 0.045) + 's'; });
    nav.appendChild(menu);
    var setOpen = function (o) {
      btn.classList.toggle('open', o);
      menu.classList.toggle('open', o);
      btn.setAttribute('aria-expanded', o);
    };
    btn.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    addEventListener('resize', function () { if (innerWidth > 860) setOpen(false); });
  }

  /* smooth theme switch */
  var tt = document.getElementById('themeToggle');
  if (tt) tt.addEventListener('click', function () {
    document.documentElement.classList.add('mt-theme');
    setTimeout(function () { document.documentElement.classList.remove('mt-theme'); }, 450);
  });
})();
