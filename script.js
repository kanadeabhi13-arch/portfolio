/* ===========================================
   Atharv Karade — Portfolio Interactions
   =========================================== */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- Navbar scrolled state + active link ---------- */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('main section[id]');
const linkMap = {};
navLinks.querySelectorAll('a').forEach(a => {
  const id = a.getAttribute('href').replace('#', '');
  linkMap[id] = a;
});

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  let current = '';
  const offset = window.innerHeight * 0.35;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top - offset <= 0) current = sec.id;
  });
  Object.values(linkMap).forEach(a => a.classList.remove('active'));
  if (current && linkMap[current]) linkMap[current].classList.add('active');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Skill bars animate when visible ---------- */
const bars = document.querySelectorAll('.bar');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barObserver.observe(b));

/* ---------- Card hover spotlight ---------- */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  });
});

/* ---------- Cursor spotlight ---------- */
const spotlight = document.getElementById('cursor-spotlight');
let sx = 0, sy = 0, tx = 0, ty = 0;
window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
function spotLoop() {
  sx += (tx - sx) * 0.15;
  sy += (ty - sy) * 0.15;
  spotlight.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
  requestAnimationFrame(spotLoop);
}
spotLoop();

/* ---------- Contact form ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  status.classList.remove('error');
  if (!name || !email || !message) {
    status.textContent = 'Please fill in every field.';
    status.classList.add('error');
    return;
  }
  if (!validEmail) {
    status.textContent = 'That email looks off — mind double-checking?';
    status.classList.add('error');
    return;
  }

  status.textContent = 'Sending...';
  setTimeout(() => {
    status.textContent = 'Thanks — your message just landed in my inbox.';
    showToast('Message sent. I\'ll be in touch soon.');
    form.reset();
  }, 700);
});

/* ===========================================
   Particle background
   =========================================== */
(function () {
  const canvas = document.getElementById('bg-particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COLORS = ['rgba(77,163,255,', 'rgba(166,107,255,', 'rgba(124,92,255,'];

  function resize() {
    w = canvas.width = window.innerWidth * window.devicePixelRatio;
    h = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = window.innerWidth < 700 ? 38 : 70;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.3 * window.devicePixelRatio,
      r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio,
      a: Math.random() * 0.5 + 0.2,
      c: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // lines between near particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const max = 130 * window.devicePixelRatio;
        if (d < max) {
          const o = (1 - d / max) * 0.18;
          ctx.strokeStyle = `rgba(124,92,255,${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = p.c + p.a + ')';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
