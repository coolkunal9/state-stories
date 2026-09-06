/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#38BDF8",
        accent: "#10B981",
        background: "#FAFAFA",
        "text-main": "#1E293B",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        card: "0 1px 3px rgba(15, 23, 42, 0.04), 0 12px 40px -12px rgba(15, 23, 42, 0.1)",
        "card-hover":
          "0 4px 8px rgba(15, 23, 42, 0.04), 0 24px 48px -12px rgba(15, 23, 42, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
