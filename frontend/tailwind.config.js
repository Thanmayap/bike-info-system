/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: { DEFAULT: '#00f0a8', glow: '#22ffd1' },
        ink:  { 900: '#0a0d12', 800: '#10151c', 700: '#171d27' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui'],
        body: ['Inter', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,240,168,0.35)',
      },
    },
  },
  plugins: [],
};
