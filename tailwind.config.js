/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E1E0CC",
        ink: "#080806",
        paper: "#F7F4E8",
        signal: "#B9FF4A",
        ember: "#F35F36",
        blueglass: "#2E7DD7",
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
