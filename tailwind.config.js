/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbfa',
          100: '#d5f7f4',
          200: '#b0eee8',
          300: '#7ae0d7',
          400: '#3ec8bf',
          500: '#24ada5',
          600: '#1a8b86',
          700: '#196f6c',
          800: '#185958',
          900: '#184a49',
          950: '#072c2c',
        },
        accent: {
          50: '#fbf5ff',
          100: '#f4e8ff',
          200: '#ebd3ff',
          300: '#dab0ff',
          400: '#c27eff',
          500: '#a748ff',
          600: '#9425f7',
          700: '#8015db',
          800: '#6c15b1',
          900: '#58138f',
        },
        trust: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
}
