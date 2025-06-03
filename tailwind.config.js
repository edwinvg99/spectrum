/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Colores personalizados si los necesitas
        "valorant-red": "#ff4655",
        "valorant-blue": "#00b4e0",
      },
      backgroundImage: {
        "radial-gradient-bottom-right":
          "radial-gradient(at bottom right, var(--tw-gradient-stops))",
        "radial-gradient-top-left":
          "radial-gradient(at top left, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
