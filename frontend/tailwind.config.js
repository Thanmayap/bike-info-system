/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: { DEFAULT: '#00E5FF', glow: '#66FFFF' },
        ink:  { 900: '#030712', 800: '#111827', 700: '#1F2937' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui'],
        body: ['Inter', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,229,255,0.4)',
      },
    },
  },
  plugins: [],
};
