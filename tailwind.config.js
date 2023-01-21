/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const scrollBarHide = require('tailwind-scrollbar-hide');
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'unicorn-flow': 'unicornFlow 5s linear infinite',
        'ping-once': 'ping 1s linear 1',
        'fade-out': 'fadeOut 1s ease-in-out',
        'fade-in': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        unicornFlow: {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '0% 100%' },
        },
        fadeOut: {
          '0%': { opacity: 100 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1300px',
    },
    colors: {
      white: '#ede8d9',
      black: '#4c453e',
      gray: '#908c7f',
      red: '#9c2b1d',
      green: '#476f5d',
      yellow: '#ecbe3f',
      'red-light': '#cf5c5c',
      'white-faded': '#afaca3',
      'neon-white': '#ffffff',
      'neon-green': '#00ff9f',
      'neon-red': '#FF0677',
      'neon-yellow': '#FEE302',
      'neon-black': '#02090E',
      'neon-purple': '#B000FF',
      'neon-blue': '#3AE6F7',
      'neon-white-faded': '#112022',
      'neon-gray': '#112022',
      'neon-red-light': '#F73C5D',
    },
  },
  plugins: [scrollBarHide],
};
