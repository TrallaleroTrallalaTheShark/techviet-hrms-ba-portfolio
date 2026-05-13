/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#185FA5", light: "#EBF5FF", dark: "#0C447C" }
      }
    }
  },
  plugins: []
}