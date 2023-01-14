/** @type {import('tailwindcss').Config} */
const scrollBarHide = require("tailwind-scrollbar-hide");
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "unicorn-flow": "unicornFlow 5s linear infinite",
      },
      keyframes: {
        unicornFlow: {
          "0%": { "background-position": "0% 0%" },
          "100%": { "background-position": "0% 100%" },
        },
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "800px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      white: "#ede8d9",
      black: "#4c453e",
      gray: "#908c7f",
      red: "#9c2b1d",
      green: "#476f5d",
      yellow: "#ecbe3f",
      "red-light": "#cf5c5c",
      "white-faded": "#afaca3",
    },
  },
  plugins: [scrollBarHide],
};
