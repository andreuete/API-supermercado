/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#17211d', muted: '#69766f', brand: '#246b50', canvas: '#f5f7f4', line: '#e5eae6' },
    boxShadow: { soft: '0 12px 40px rgba(26, 54, 40, .06)' }
  }},
  plugins: []
}