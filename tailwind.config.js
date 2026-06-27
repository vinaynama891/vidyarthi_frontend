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
          DEFAULT: '#1A3C5E', // Deep Navy Blue
          light: '#2a5682',
          dark: '#0e2338',
        },
        secondary: {
          DEFAULT: '#F5A623', // Saffron/Orange
          light: '#ffbf53',
          dark: '#cf8512',
        },
        accent: {
          DEFAULT: '#27AE60', // Green for success/paid
          light: '#2ecc71',
          dark: '#1e8449',
        },
        danger: {
          DEFAULT: '#E74C3C', // Red for pending/delete
          light: '#e74c3c',
          dark: '#c0392b',
        },
        bgLight: '#F8F9FA', // Light gray background
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        stats: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(26, 60, 94, 0.08), 0 2px 8px -1px rgba(26, 60, 94, 0.04)',
        premiumHover: '0 10px 25px -3px rgba(26, 60, 94, 0.12), 0 4px 12px -2px rgba(26, 60, 94, 0.06)',
      }
    },
  },
  plugins: [],
}
