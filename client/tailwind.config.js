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
        cyber: {
          mint: '#0df2a3',
          neon: '#00ff88',
          emerald: '#10b981',
          teal: '#14b8a6',
          black: '#050507',
          obsidian: '#0a0b0f',
          card: '#0c0d12',
          surface: '#12141c',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(13, 242, 163, 0.35)',
        },
        dark: {
          bg: '#050507',
          card: '#0a0b0f',
          surface: '#11131a',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f8fafc',
          muted: '#94a3b8',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#0df2a3',
          600: '#10b981',
          700: '#047857',
          cyan: '#0df2a3',
          purple: '#a855f7',
          emerald: '#0df2a3',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(13, 242, 163, 0.45)',
        'glow-mint': '0 0 30px -5px rgba(13, 242, 163, 0.5)',
        'glow-subtle': '0 0 20px -3px rgba(13, 242, 163, 0.25)',
        card: '0 8px 30px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 10px 35px -10px rgba(0, 0, 0, 0.85)',
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
