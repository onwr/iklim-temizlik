/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sarı: "#fcec38",
        siyah: "#000000",
        beyaz: "#ffffff",
        yesil: "#000000",
      },
    },
  },
  plugins: [],
};
