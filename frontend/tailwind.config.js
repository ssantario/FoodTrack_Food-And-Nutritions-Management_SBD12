/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#3D8D7A",
        secondary: "#B3D8A8",
        backdrop: "#FBFFE4",
        altGreen: "#A3D1C6",
      },
    },
  },
  plugins: [],
};
