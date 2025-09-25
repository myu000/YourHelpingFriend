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
        statusEl.textContent = 'There
