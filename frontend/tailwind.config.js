/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /** Brand lavender — core #C8B6E2 + tints for UI */
        lavender: {
          DEFAULT: "#C8B6E2",
          50: "#FAF8FC",
          100: "#F3EDFA",
          200: "#E8DCF4",
          300: "#DCC8ED",
          400: "#C8B6E2",
          500: "#B099D6",
          600: "#9578C4",
          700: "#7A5AA8",
          800: "#5E4580",
          900: "#4B3F5C",
        },
        /** Brand plum — #4B3F5C */
        plum: {
          DEFAULT: "#4B3F5C",
          50: "#F5F4F6",
          100: "#E8E6EC",
          200: "#D1CDD9",
          300: "#A69DB0",
          400: "#7A6E8C",
          500: "#5E4F6E",
          600: "#4B3F5C",
          700: "#3D3350",
          800: "#322A42",
          900: "#2A2337",
        },
        /** Brand blush — #F3C6D3 */
        blush: {
          DEFAULT: "#F3C6D3",
          muted: "#FBEFF3",
          deep: "#E8A4B8",
        },
        /** Brand dusty blue — #AFC6E9 */
        dusty: {
          DEFAULT: "#AFC6E9",
          muted: "#E4EDFA",
          deep: "#8AABDC",
        },
        /** Brand sage — #BFD8C2 */
        sage: {
          DEFAULT: "#BFD8C2",
          muted: "#E8F2EA",
          deep: "#9BC4A0",
        },
        /** Body / headline text on light surfaces */
        ink: "#4B3F5C",
        /** Muted secondary text */
        mist: "#7A6E8C",
      },
      fontFamily: {
        sans: [
          "Manrope",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          '"DM Serif Text"',
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        display: [
          '"DM Serif Text"',
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(75, 63, 92, 0.1)",
        card: "0 8px 32px -8px rgba(75, 63, 92, 0.14)",
        premium:
          "0 2px 8px -2px rgba(75, 63, 92, 0.06), 0 24px 48px -12px rgba(75, 63, 92, 0.12)",
        float: "0 12px 40px -16px rgba(75, 63, 92, 0.14)",
      },
      letterSpacing: {
        capsule: "0.22em",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
