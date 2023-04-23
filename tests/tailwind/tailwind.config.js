const plugin = require('tailwindcss/plugin')
const { fluidText } = require('../../fluid-text')

module.exports = {
  content: ['./index.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(fluidText.tailwind.plugin),
  ],
}
