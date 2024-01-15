/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "element-base": "var(--mainColor)",
        "text-color": "var(--mainColorHighlight)",
      },
      fontFamily: {
        headlineFont: ["headlineFont", "var(--headlineFont)"],
        bodyFont: ["bodyFont", "var(--bodyFont)"]
      }
    },
  },
  plugins: [],
};
