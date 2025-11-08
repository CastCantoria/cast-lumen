/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      colors: {
        'cast-blue': '#1e3a8a',
        'cast-red': '#b91c1c',
        'cast-green': '#2C5530',
        'cast-gold': '#D4AF37',
        'cast-green-light': '#4ade80',
        'cast-green-dark': '#1e3a23',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}