/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#f28150",
          500: "#f28150",
        },
        secondary: {
          400: "#15ce7b",
          500: "#15ce7b",
        },
        accent: "#06b3bb",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
