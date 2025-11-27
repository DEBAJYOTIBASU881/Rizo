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
          DEFAULT: '#0A3D91', // Royal Blue
          hover: '#072E6A',   // Deep Blue
        },
        secondary: '#F8F9FC', // Off-White
        accent: '#D4AF37',    // Gold
        neutral: {
          100: '#F8F9FC',
          200: '#E2E8F0',
          800: '#1F1F1F',     // Charcoal Black
          900: '#0C1424',     // Dark Background
        },
        dark: {
          bg: '#0C1424',
          card: '#1B2434',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
