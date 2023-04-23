import { defineConfig } from 'unocss'
import { fluidText } from '../../fluid-text'

export default defineConfig({
  cli: {
    entry: {
      patterns: ['./index.html']
    }
  },
  preflights: [
    ...fluidText.uno.preflights
  ],
  rules: [
    ...fluidText.uno.rules
  ]
})
