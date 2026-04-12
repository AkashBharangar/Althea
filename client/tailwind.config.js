/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#f8f7fc",
          100: "#f0eef9",
          200: "#e2ddf2",
          300: "#cdc4e8",
          400: "#b0a3d9",
          500: "#9585c9",
          600: "#7f6ab8",
          700: "#6c579f",
          800: "#5a4985",
          900: "#4b3e6e",
        },
        mist: "#9d92b3",
        ink: "#2d2640",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(76, 63, 120, 0.12)",
        card: "0 8px 32px -8px rgba(76, 63, 120, 0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
