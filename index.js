/**
 * TV Pro Repair – index.js  |  Modern UI Edition
 */
'use strict';

/* ── Email delivery ──
   Uses Web3Forms so form submissions land straight in the inbox with no
   backend/server required, and no fragile confirmation-link step.
   ONE-TIME SETUP: go to https://web3forms.com, enter nextrar1@gmail.com,
   and it instantly shows/emails you a free access key — no link to click.
   Paste that key into the hidden "access_key" input in index.html
   (search for PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE) and submissions will
   start arriving immediately. */
const EMAIL_ENDPOINT = 'https://api.web3forms.com/submit';

/* ── AOS Init ── */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration:700, once:true, offset:70, easing:'ease-out-quad', disable: window.innerWidth < 768 });
  }
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

/* ── Header scroll ── */
const hdr = document.getElementById('siteHeader');
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.dn-link, .mm-link');

const onScroll = () => {
  hdr?.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  // Active nav
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - (hdr?.offsetHeight || 0) - 50) cur = '#' + s.id;
  });
  allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === cur));
};
window.addEventListener('scroll', onScroll, { passive:true });

/* ── Mobile menu ── */
const mobileToggle  = document.getElementById('mobileToggle');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileClose   = document.getElementById('mobileClose');
const mobileBackdrop = document.getElementById('mobileBackdrop');

const openMenu = () => {
  mobileMenu.classList.add('active');
  mobileBackdrop.classList.add('active');
  mobileToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};
const closeMenu = () => {
  mobileMenu.classList.remove('active');
  mobileBackdrop.classList.remove('active');
  mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

mobileToggle?.addEventListener('click', openMenu);
mobileClose?.addEventListener('click', closeMenu);
mobileBackdrop?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', closeMenu));

let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    if (window.innerWidth > 1100) closeMenu();
    if (typeof AOS !== 'undefined') AOS.refresh();
  }, 250);
}, { passive:true });

/* ── Smooth scroll ── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (!id || id === '#') return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  closeMenu();
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (hdr?.offsetHeight || 0) - 16, behavior:'smooth' });
});

/* ── CTA → contact ── */
document.querySelectorAll('.cta-button').forEach(btn => {
  if (btn.tagName === 'A') return;
  btn.addEventListener('click', () => {
    const s = document.getElementById('contact');
    if (!s) return;
    closeMenu();
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - (hdr?.offsetHeight || 0) - 16, behavior:'smooth' });
    setTimeout(() => document.querySelector('#contactForm .fi')?.focus(), 600);
  });
});

/* ── Counter animation ── */
const counters = document.querySelectorAll('.sb-num[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = +el.dataset.target;
    const label = el.closest('.stat-box')?.querySelector('.sb-label')?.textContent || '';
    const suffix = label.includes('%') ? '%' : '+';
    const dur = 2000, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + (p >= 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold:.5 });
counters.forEach(el => counterObs.observe(el));

/* ── Brand filter ── */
document.querySelectorAll('.bf-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.bf-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const f = this.dataset.filter;
    document.querySelectorAll('.brand-tile').forEach(tile => {
      const show = f === 'all' || (tile.dataset.category || '').includes(f);
      tile.style.display = show ? '' : 'none';
      if (show) { tile.style.animation='none'; requestAnimationFrame(() => tile.style.animation=''); }
    });
  });
});

/* ── Form validation & submission ── */
const form = document.getElementById('contactForm');
const fields = {
  fname:  { validate: v => v.trim().length >= 2,                          msg:'Please enter your full name.' },
  fphone: { validate: v => /^[\d\s\+\-\(\)]{7,20}$/.test(v.trim()),      msg:'Please enter a valid phone number.' },
  fbrand: { validate: v => v !== '',                                       msg:'Please select your TV brand.' },
  fissue: { validate: v => v !== '',                                       msg:'Please select the issue type.' },
};

Object.entries(fields).forEach(([id, cfg]) => {
  const el = document.getElementById(id);
  const errEl = document.getElementById(`${id}-err`);
  cfg.el = el; cfg.errEl = errEl;
  el?.addEventListener('blur', () => { if (el.value.trim()) setErr(cfg, !cfg.validate(el.value)); });
  el?.addEventListener('input', () => { if (el.classList.contains('error')) setErr(cfg, !cfg.validate(el.value)); });
});

function setErr(cfg, show) {
  cfg.el?.classList.toggle('error', show);
  if (cfg.errEl) cfg.errEl.textContent = show ? cfg.msg : '';
}

form?.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  Object.values(fields).forEach(cfg => {
    const valid = cfg.el && cfg.validate(cfg.el.value);
    setErr(cfg, !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    showToast('Please fix the errors above.', 'error');
    form.querySelector('.fi.error')?.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }
  const btn = document.getElementById('submitBtn');
  const txt = btn.querySelector('.btn-text');
  const ld  = btn.querySelector('.btn-loading');
  btn.disabled = true; txt.style.display='none'; ld.style.display='flex';

  const name  = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();

  try {
    const res = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    });
    const data = await res.json().catch(() => ({}));
    console.log('Web3Forms response:', res.status, data); // remove once confirmed working

    if (!res.ok || data.success !== true) {
      const serverMsg = (data && data.message) || '';
      if (/access key/i.test(serverMsg)) {
        showToast(
          `Setup needed: get a free key at web3forms.com and paste it into the access_key field in index.html.`,
          'error', 9000
        );
      } else {
        showToast(`Couldn't send that automatically (${serverMsg || 'server error'}) — please call or WhatsApp us at +91 70467 00376.`, 'error', 7000);
      }
      return;
    }
    form.reset();
    Object.values(fields).forEach(cfg => setErr(cfg, false));
    showToast(`✅ Thank you ${name}! We'll call you at ${phone} within 30 minutes.`, 'success', 6000);
  } catch (err) {
    console.error('Web3Forms request failed:', err); // remove once confirmed working
    showToast(`Couldn't reach the email service — please call or WhatsApp us at +91 70467 00376.`, 'error', 7000);
  } finally {
    btn.disabled = false; txt.style.display = 'flex'; ld.style.display = 'none';
  }
});

/* ── Toast system ── */
function showToast(msg, type='info', dur=5000) {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.animation='toastIn .35s ease reverse'; setTimeout(()=>t.remove(),350); }, dur);
}

/* ── Scroll to top ── */
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ── iOS vh fix ── */
const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * .01}px`);
setVH();
window.addEventListener('resize', setVH, { passive:true });

/* ── Newsletter ── */
document.getElementById('nlSubmit')?.addEventListener('click', async function () {
  const inp = document.getElementById('nlEmail');
  const email = inp?.value?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    inp?.focus(); return;
  }
  this.disabled = true;
  try {
    const accessKey = document.querySelector('input[name="access_key"]')?.value || '';
    const res = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        email: email,
        subject: 'New Newsletter Signup — TV Pro Repair',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success !== true) throw new Error(data.message || 'Signup failed');
    showToast('🎉 Subscribed! Expect TV tips and offers soon.', 'success');
    if (inp) inp.value = '';
  } catch (err) {
    showToast('Signup failed — please try again in a moment.', 'error');
  } finally {
    this.disabled = false;
  }
});