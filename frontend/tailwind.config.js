/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f5e6d3',
          200: '#e8d0b3',
          300: '#d4a574',
          400: '#c4884d',
          500: '#a16b3a',
          600: '#8b5e34',
          700: '#6d4a2a',
          800: '#5a3d23',
          900: '#4a321d',
        },
        agro: {
          green: '#22c55e',
          dark: '#166534',
          light: '#f0fdf4',
          accent: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
          warning: '#eab308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.84rem', { lineHeight: '1.25rem' }],
        'sm': ['0.94rem', { lineHeight: '1.375rem' }],
        'base': ['1.06rem', { lineHeight: '1.5rem' }],
        'lg': ['1.19rem', { lineHeight: '1.75rem' }],
        'xl': ['1.34rem', { lineHeight: '2rem' }],
        '2xl': ['1.56rem', { lineHeight: '2.25rem' }],
      },
    },
  },
  plugins: [],
}
