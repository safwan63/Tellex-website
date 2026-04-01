/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tellex-dark-green': '#0E462B',
        'tellex-forest-green': '#0E462B',
        'tellex-white': '#FFFFFF',
        'tellex-off-white': '#FAF9F6',
        'tellex-gold': '#D4AF37',
        'tellex-muted-gold': '#C9A961',
        'tellex-secondary': '#fff1e8',
        'tellex-black': '#000000',
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
