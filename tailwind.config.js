/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF6EE',
        cream: '#F6EEE2',
        paper: '#FFFCF7',
        blush: '#EFC6C8',
        rose: '#C98B8F',
        dusty: '#B57C80',
        ink: '#5B4A47',
        sage: '#A3B49A',
        gold: '#CDB48A',
      },
      fontFamily: {
        serif: ['"Hua Serif"', '"Noto Serif SC"', '"Songti SC"', '"STSong"', '"SimSun"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        latin: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        brush: ['"Ma Shan Zheng"', '"Hua Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}
