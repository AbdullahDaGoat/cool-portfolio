/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#0a0a0a',
        'text-color': '#f0f0f0',
        'accent-color': '#00ff99',
        'secondary-color': '#1a1a2e',
        'accent-color-dark': '#00cc77',
      },
    },
  },
  plugins: [],
}