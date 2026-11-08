/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1EDE2',
        bone: '#E3DCC9',
        ink: '#17150F',
        cobalt: '#2338D6',
        magenta: '#D91E56',
        sun: '#FFC233',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticker: '3px 3px 0 #17150F',
        lift: '6px 6px 0 #17150F',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
