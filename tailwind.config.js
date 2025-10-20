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
      },
    },
  },
  plugins: [],
}