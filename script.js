// ---------- Dynamic Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Formspree Submit ----------
const form = document.getElementById('requestForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Submitting...';
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        statusEl.textContent = 'Thanks! Your request has been sent. I will reply by email.';
        form.reset();
      } else {
        statusEl.textContent = 'There was a problem sending your request. Please try again.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again later.';
    }
  });
}

// ---------- Scroll Reveal Animations ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target); // reveal once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .form, .reveal').forEach(el => observer.observe(el));

// ---------- Parallax Hero Background ----------
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center ${offset}px`;
  });
}
