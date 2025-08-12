/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#22d500',
        brandDark: '#16a300'
      },
      fontFamily: {
        sans: ['system-ui','-apple-system','Segoe UI','Roboto','Inter','Noto Sans','Helvetica','Arial','sans-serif']
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
