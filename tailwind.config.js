/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        crimson: {
          DEFAULT: '#dc2626',
          dark: '#991b1b',
          deep: '#7f1d1d',
          light: '#ef4444',
          subtle: '#fef2f2',
        },
        charcoal: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          muted: '#475569',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'hero': '0 25px 50px -12px rgba(225, 29, 72, 0.15)',
        'elevated': '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
      }
    },
  },
  plugins: [],
}


