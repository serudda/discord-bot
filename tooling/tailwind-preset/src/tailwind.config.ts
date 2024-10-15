import { Config } from 'tailwindcss';
import tailwindcssAnimated from 'tailwindcss-animated';

export default {
  darkMode: 'class',
  content: ['**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animationDelay: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
        '3s': '3s',
        '5s': '5s',
        '10s': '10s',
        '15s': '15s',
        '20s': '20s',
      },
      animationDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
        '3s': '3s',
        '5s': '5s',
        '10s': '10s',
        '15s': '15s',
        '20s': '20s',
      },
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          950: '#0B3C88',
        },
        secondary: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          950: '#CC4900',
        },
      },
      fontSize: {
        'fluid-base': 'clamp(0.75rem, 2vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 4vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 6vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 9vw, 3.5rem)',
      },
      screens: {
        '3xs': '240px',
        '2xs': '360px',
        xs: '480px',
      },
    },
  },
  plugins: [tailwindcssAnimated],
} satisfies Config;
