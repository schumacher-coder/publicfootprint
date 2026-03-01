/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../shared/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Public Footprint Brand Colors
        'magenta': {
          DEFAULT: '#d4414b',
          50: '#fef2f3',
          100: '#fde3e5',
          200: '#fbccd0',
          300: '#f7a4ac',
          400: '#f17782',
          500: '#e74b5a',
          600: '#d4414b',
          700: '#b2303a',
          800: '#952b34',
          900: '#7e2830',
        },
        'gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#575757',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        'lightgray': '#e4e4e4',
        'darkgray': '#575757',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
