// module.exports = {
// content: ['./index.html','./src/**/*.{js,jsx}'],
// theme: { extend: {} },
// plugins: []
// }

module.exports = {
  darkMode: 'class', // Enable dark mode with the 'class' strategy
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // Tells Tailwind where to look for classes to purge
  theme: {
    extend: {}, // You can extend the default theme here, such as adding custom colors or fonts
  },
  plugins: [], // You can add Tailwind plugins here if needed
}

