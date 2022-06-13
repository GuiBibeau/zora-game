require("@tailwindcss/aspect-ratio"),
  /** @type {import('tailwindcss').Config} */
  (
    module.exports = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          fontFamily: {
            bangers: ["Bangers", "cursive"],
          },
          dropShadow: {
            "3xl": "rgb(0, 0, 0) 12px 12px 0px 0px",
          },
        },
      },
      plugins: [require("@tailwindcss/aspect-ratio")],
    }
  );
