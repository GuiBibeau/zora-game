<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-950': '#EF2203',
        'red-1000': '#FF2600'
      }
    },
  },
  plugins: [],
};
=======
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
>>>>>>> f822bc72740e37defa1bccb5d92f9c3147e3e7d9
