/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg':      '#0D1120',
        'app-card':    '#161B2E',
        'app-surface': '#1E2640',
        'app-border':  '#252D45',
        'blue': {
          DEFAULT: '#3B82F6',
          hover:   '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
