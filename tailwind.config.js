/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f1724",
        card: "#0b1220",
        accent: "#06b6d4",
        muted: "#9aa4b2"
      }
    }
  },
  plugins: [],
}
