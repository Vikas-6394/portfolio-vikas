/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#08120d',
          900: '#0e1e16',
          850: '#11251b',
          800: '#152d21',
          700: '#1c3a2c',
          600: '#234a38',
          500: '#2c5c46',
          400: '#3d785e',
          300: '#5ba07f',
          200: '#8ec4ab',
          100: '#c5e3d4',
          50: '#edf6f1',
        },
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          brand: '#e85934',
        },
        cream: {
          50: '#fcfbf8',
          100: '#f7f4ec',
          200: '#efe9da',
          300: '#e3d9c3',
          400: '#d1c2a3',
          500: '#bfa782',
        },
        dark: {
          bg: '#0e1e16',
          card: '#152d21',
          surface: '#1c3a2c',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f7f4ed',
          muted: '#9cb3a4',
        },
        brand: {
          50: '#fcfbf8',
          100: '#f7f4ec',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
          cyan: '#ea580c',
          purple: '#f59e0b',
          emerald: '#10b981',
          terracotta: '#e85934',
          forest: '#1c3a2c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(234, 88, 12, 0.35)',
        'glow-terracotta': '0 0 25px -5px rgba(232, 89, 52, 0.4)',
        'glow-forest': '0 0 25px -5px rgba(28, 58, 44, 0.4)',
        card: '0 8px 30px rgba(21, 42, 31, 0.06)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
