/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-noto-serif)', 'Noto Serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        label: ['var(--font-public-sans)', 'Public Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#094cb2',
          container: '#1d63d8',
        },
        tertiary: {
          DEFAULT: '#6d5e00', // Archival gold
          container: '#fef3c7',
          foreground: '#453b00',
        },
        surface: {
          'lowest': '#ffffff',
          'low': '#f8fafc',
          'container': '#f1f5f9',
          'high': '#e2e8f0',
          'dim': '#cbd5e1',
        },
        outline: {
          ghost: 'rgba(148, 163, 184, 0.15)', // 15% opacity ghost border
        },
      },
    },
  },
  plugins: [],
};
