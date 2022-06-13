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
        },
      },
      plugins: [require("@tailwindcss/aspect-ratio")],
    }
  );
