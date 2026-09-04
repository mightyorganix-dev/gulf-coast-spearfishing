import store from './store.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  // Ensure store is initialized on home (localStorage seed)
  void store;
  initLayout('home');
});
