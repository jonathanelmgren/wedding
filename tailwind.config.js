/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 2000ms linear forwards",
      },
      colors: {
        primary: "var(--color-primary)",
        sky: "var(--color-sky)",
      },
    },
  },
  plugins: [],
};
