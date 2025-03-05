/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6200EE',
          50: '#F2E7FE',
          100: '#D4BBFD',
          200: '#BB93FC',
          300: '#A370FA',
          400: '#8B4DF9',
          500: '#6200EE',
          600: '#5600E8',
          700: '#4B00E0',
          800: '#3D00D8',
          900: '#2A00CC'
        },
        secondary: {
          DEFAULT: '#03DAC6',
          50: '#E6FCF9',
          100: '#C3F9F3',
          200: '#9FF5EC',
          300: '#7BF2E5',
          400: '#57EEDE',
          500: '#03DAC6',
          600: '#00C4B4',
          700: '#00AFA0',
          800: '#00998C',
          900: '#007A70'
        },
        error: {
          DEFAULT: '#B00020',
          50: '#FFE6EC',
          100: '#FFBFCF',
          200: '#FF99B3',
          300: '#FF7396',
          400: '#FF4D7A',
          500: '#B00020',
          600: '#A1001D',
          700: '#91001A',
          800: '#820016',
          900: '#6B0012'
        },
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: {
          primary: '#000000DE',
          secondary: '#00000099'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      fontSize: {
        'heading-1': '24px',
        'heading-2': '20px',
        'heading-3': '18px',
        'subtitle-1': '16px',
        'subtitle-2': '14px',
        'body-1': '16px',
        'body-2': '14px',
        'button': '14px'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700
      },
      borderRadius: {
        'card': '8px',
        'button': '4px'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.2)'
      },
      animation: {
        'progress': 'progress 1s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      }
    }
  },
  plugins: []
} 