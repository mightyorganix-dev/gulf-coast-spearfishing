import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  const active = document.body.dataset.page || '';
  initLayout(active);
});
