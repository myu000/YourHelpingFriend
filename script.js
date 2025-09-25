// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Formspree submit
const form = document.getElementById('requestForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Submitting...';
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
      if (res.ok) {
        statusEl.textContent = 'Thanks! Your request has been sent. I will reply by email.';
        form.reset();
      } else {
        statusEl.textContent = 'There was a problem sending your request.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again later.';
    }
  });
}

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Parallax on hero background
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.2; // subtle parallax
  if (heroBg) heroBg.style.transform = `translate3d(0, ${y}px, 0)`;
});
