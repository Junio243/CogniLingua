/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './services/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1224',
        surface: '#0f172a',
        'surface-muted': '#111827',
        primary: {
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
          800: '#05603a',
          900: '#054f31',
        },
      },
      boxShadow: {
        card: '0 10px 50px rgba(0,0,0,0.35)',
        glow: '0 10px 40px rgba(50, 213, 131, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
      },
      keyframes: {
        pulseCard: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
      animation: {
        'pulse-card': 'pulseCard 6s ease-in-out infinite',
        flip: 'flip 0.5s ease-in-out',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
