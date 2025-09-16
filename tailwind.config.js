/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1565C0',
        'background-light': '#FAFAFA',
        'background-blue': '#E3F2FD',
        'alert-red': '#C62828',
        'alert-orange': '#FB8C00',
        'alert-green': '#2E7D32',
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}