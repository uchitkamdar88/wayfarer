/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060B12',
          900: '#0B1320',
          800: '#142034',
          700: '#1F2F4A',
          600: '#334768',
        },
        ivory: {
          50: '#FCFCFB',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#EDE8DD',
          400: '#DDD5C3',
        },
        champagne: {
          50: '#FCF9F2',
          100: '#F7F0DF',
          200: '#EEDDBB',
          300: '#E4CA94',
          400: '#D5B26E',
          500: '#C59A4E',
          600: '#AA7F38',
          700: '#866029',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E5EDE7',
          200: '#CDDDD1',
          300: '#A9C4B0',
          400: '#7FA68A',
          500: '#5A8768',
          600: '#466C52',
          700: '#375440',
        },
        stone: {
          250: '#E8E5DD',
          350: '#D1CDC1',
          450: '#9C9789',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 19, 32, 0.05)',
        'elevated': '0 12px 36px -4px rgba(11, 19, 32, 0.08)',
        'float': '0 20px 48px -6px rgba(11, 19, 32, 0.12)',
      },
    },
  },
  plugins: [],
};

