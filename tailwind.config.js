/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cast-blue': '#1e3a8a', // bleu profond pour CAST
        'cast-red': '#b91c1c',  // rouge intense pour CAST
        'cast-green': '#2C5530', // vert C.A.S.T.
        'cast-gold': '#D4AF37',  // or C.A.S.T.
      },
    },
  },
  plugins: [],
}