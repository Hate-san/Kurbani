/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182a1c',
        paper: '#f2ecd9',
        forest: '#25402b',
        forestDark: '#152318',
        gold: '#c69a3b',
        goldLight: '#e2c375',
        rust: '#9a4526',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
