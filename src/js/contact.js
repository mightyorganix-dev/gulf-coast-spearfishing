import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('contact');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('hidden');
    success.classList.remove('hidden');
  });
});
