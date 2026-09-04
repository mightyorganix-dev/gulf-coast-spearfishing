import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        booking: resolve(__dirname, 'booking.html'),
        captain: resolve(__dirname, 'captain.html'),
        admin: resolve(__dirname, 'admin.html'),
        itinerary: resolve(__dirname, 'itinerary.html'),
        about: resolve(__dirname, 'about.html'),
        faq: resolve(__dirname, 'faq.html'),
        whatToBring: resolve(__dirname, 'what-to-bring.html'),
        redSnapper: resolve(__dirname, 'red-snapper-season.html'),
        species: resolve(__dirname, 'species.html'),
        lionfish: resolve(__dirname, 'lionfish.html'),
        safety: resolve(__dirname, 'safety.html'),
        contact: resolve(__dirname, 'contact.html'),
        reviews: resolve(__dirname, 'reviews.html'),
      },
    },
  },
});
