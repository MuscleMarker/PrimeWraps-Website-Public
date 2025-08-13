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
          50: '#fffbfb',
          100: '#fff5f5',
          200: '#ffdcdc',
          300: '#ffc7c7',
          400: '#ffa3a3',
          500: '#ff7a7a',
          600: '#f55a5a',
          700: '#d13a3a',
          800: '#ae2f2f',
          900: '#922a2a',
        },
        cream: {
          50: '#fffefd',
          100: '#fff2eb',
          200: '#ffe8cd',
          300: '#ffd6ba',
          400: '#ffc4a7',
          500: '#ffb294',
          600: '#ff9f81',
          700: '#ff8c6e',
          800: '#ff795b',
          900: '#ff6648',
        },
        floral: {
          50: '#fff5f5',
          100: '#ffe8e8',
          200: '#ffdcdc',
          300: '#ffc7c7',
          400: '#ffa3a3',
          500: '#ff7a7a',
          600: '#f55a5a',
          700: '#d13a3a',
          800: '#ae2f2f',
          900: '#922a2a',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        gwendolyn: ['"palast-variable"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 