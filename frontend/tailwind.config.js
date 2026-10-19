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
        // Brand red — primary action color (same in both themes)
        primary: {
          50:  '#fff0f0',
          100: '#ffd6d6',
          200: '#ffadad',
          300: '#ff7070',
          400: '#ff3333',
          500: '#e30613',  // WOW Burger brand red
          600: '#cc0010',
          700: '#a80010',
          800: '#880010',
          900: '#6b0010',
        },
        // Brand gold/yellow — bun color, accent (same in both themes)
        gold: {
          300: '#fdd96a',
          400: '#fcc635',
          500: '#fbb900',  // WOW Burger bun gold
          600: '#e5a800',
          700: '#c48f00',
        },
        // Semantic surface colors — driven by CSS variables so they flip with theme
        brand: {
          red:    '#e30613',
          gold:   '#fbb900',
          dark:   'var(--color-brand-dark)',
          darker: 'var(--color-brand-darker)',
          card:   'var(--color-brand-card)',
          border: 'var(--color-brand-border)',
          muted:  'var(--color-brand-muted)',
        },
        // Semantic text colors — driven by CSS variables
        surface: {
          primary:   'var(--color-text-primary)',    // headings, strong text
          secondary: 'var(--color-text-secondary)',  // body text
          muted:     'var(--color-text-muted)',       // subtitles, labels
          faint:     'var(--color-text-faint)',       // disabled, copyright
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red':  '0 0 20px rgba(227,6,19,0.3)',
        'glow-gold': '0 0 20px rgba(251,185,0,0.3)',
      }
    },
  },
  plugins: [],
}
