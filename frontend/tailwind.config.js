/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B16',
          900: '#0A0F1E',
          850: '#0E172C',
          800: '#14203D',
          700: '#1E2F56',
          600: '#2A4073',
        },
        brand: {
          cyan: '#00E5FF',
          blue: '#2563EB',
          accent: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
