/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexia: ['OpenDyslexic', 'Comic Sans MS', 'cursive']
      },
      colors: {
        /* High-contrast palette */
        hc: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#facc15',
          text: '#facc15',
          accent: '#22d3ee'
        },
        /* Dyslexia-friendly palette */
        dy: {
          bg: '#fdf6e3',
          surface: '#f5ead1',
          border: '#92400e',
          text: '#1c1917',
          accent: '#0284c7'
        },
        /* Dark mode */
        dark: {
          bg: '#111827',
          surface: '#1f2937',
          border: '#374151',
          text: '#f9fafb',
          accent: '#818cf8'
        }
      }
    }
  },
  plugins: []
};
