/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          dark: '#1557b0',
        },
        gray: {
          light: '#f8f9fa',
          DEFAULT: '#5f6368',
          dark: '#202124',
        }
      }
    },
  },
  plugins: [],
}