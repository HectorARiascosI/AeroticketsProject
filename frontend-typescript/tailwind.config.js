/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        accent: '#7c3aed',
        success: '#10b981',
        danger: '#ef4444',
        dark: '#0b1221'
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)'
      }
    }
  },
  plugins: []
}