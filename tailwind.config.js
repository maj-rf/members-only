/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,pug}', './build/**/*.{html,js,pug}'],
  theme: {
    extend: {
      backgroundImage: {
        form: "url('/images/form-bg.png')",
      },
      fontFamily: {
        'jakarta-sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
  separator: '_',
};
