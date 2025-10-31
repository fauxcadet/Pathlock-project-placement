/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0F172A", // Slate-900
        light: "#F8FAFC", // Slate-50
        primary: "#6366F1", // Indigo
        secondary: "#22D3EE", // Cyan
      },
    },
  },
  plugins: [],
};
