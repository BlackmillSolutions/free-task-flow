/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0073ea',
        'secondary': '#292f4c',
        'tertiary': '#5d6387',
        'background': '#f6f7fb',
        'surface': '#ffffff',
      },
      spacing: {
        'sidebar': '280px',
        'header': '64px',
      },
    },
  },
  plugins: [],
}