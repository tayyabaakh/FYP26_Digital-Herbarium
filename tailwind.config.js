/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim": "#121414",
        "on-background": "#e2e2e2",
        "primary": "#b8cbbc",
        "primary-container": "#2d3e33",
        "on-primary": "#233429",
        "surface-variant": "#333535",
        "on-surface-variant": "#c3c8c2",
        "on-tertiary-container": "#94a997",
        "surface-container": "#1e2020",
      },
      fontFamily: {
        "headline-lg": ["Epilogue", "sans-serif"],
        "body-md": ["Manrope", "sans-serif"],
      },
      // Add your other spacings and font sizes here...
    },
  },
  plugins: [require('@tailwindcss/forms')],
}