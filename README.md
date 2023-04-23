# fluid-text

Web designs are often polished & delivered targeting your largest mobile, tablet, and desktop view widths.

Heading font sizes are desgined to fit well at those specific sizes.

Hand it to a developer and that's what you'll get _at those sizes_.

What happens right after the largest tablet layout though? - A squished desktop layout with font sizes designed for more shoulder room. - Headers wrap, layout stretches vertically, designers weep, developers can't do much to help.

Until now...

`fluid-text` gives your team a single Tailwind* class name solution to this challenge.

<sub>* also works with UnoCSS and as an independent utility you can call without needing any build system at all.</sub>

![animated example of fluid text changing size in a resizing window](https://user-images.githubusercontent.com/7545075/233866716-c6072547-eb14-450a-855a-5b0d53235d76.gif)

## Testimonials

> Oh my god, perfect! THANK YOU!

~ Bitovi Designer

> 🐥 to [@JaneOri <sub><img src="https://avatars.githubusercontent.com/u/48817145?s=16&v=4"></sub>](https://github.com/propjockey/) for showing me what I honestly feel like will become an industry-wide, common practice related to styling text.  It hits that sweet spot of being extremely useful while also being simple and easy to use.  I see myself using it for every project I start in the future.

~ Bitovi Developer

## Need help or have questions?

This project is supported by [Bitovi](https://www.bitovi.com/services/product-design-consulting). You can get help or ask questions on our:

- [Discord Community](https://discord.gg/J7ejFsZnJ4)
- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/services/product-design-consulting#book-a-free-consultation)


## Setup

### Tailwind Plugin

In your `tailwind.config.js` file:

```js
  const plugin = require('tailwindcss/plugin')
  const { fluidText } = require('fluid-text/fluid-text')

  module.exports = {
    // ...
    plugins: [
      plugin(fluidText.tailwind.plugin),
    ]
  }
```

Then use the fluid-text utility `class` anywhere you use tailwind:

`fluid-text-[4-7-sm-6-md-4-7-xl]`

### UnoCSS Plugin

In your `uno.config.js` file:

```js
  import { defineConfig } from 'unocss'
  import { fluidText } from 'fluid-text/fluid-text'

  export default defineConfig({
    // ...
    preflights: [
      ...fluidText.uno.preflights
    ],
    rules: [
      ...fluidText.uno.rules
    ]
  })
```

Then use the fluid-text utility `class` anywhere you use UnoCSS:

`fluid-text-[4-7-sm-6-md-4-7-xl]`

The square brackets around the value are optional in UnoCSS.

## Usage

`fluid-text-[4-7-sm-6-md-4-7-xl]`

The numbers are 1/4 the pixel size, like many other number values in Tailwind.

The breakpoint names and positions are taken from your Tailwind (or UnoCSS) configuration, which may just be the following defaults:

```js
{
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

Currently, only px breakpoints are supported.

One number between breakpoints means hold that size the whole range.

The behavior of this class `fluid-text-[4-6-sm-md-4-9-lg]` is:

* If the screen is 0 width, the font size is `4 (x 4px)`.
* From 0, the font-size will increase up to `6 (x 4px)` until right before the `sm` breakpoint.
* Between `sm` and `md`, the size will not grow but remain 6.
* Right after the `md` breakpoint, the size becomes `4` and grows to `9`, reaching `9` at the `lg` breakpoint.

Ommitting `-lg` means the font will reach size `9` as soon as the screen hits your largest breakpoint.

### Scaling other values

`1em` is equal to the current fluid font-size so you can adjust paddings, margins, etc with em units to participate in the fluidity.

If you need to scale decendant's properties relative to the fluid container's font size, like if a fixed-size text-based 16px-icon is on your ::before pseudo, but its padding needs to scale, you can use the `--fluid-em` var and CSS calc() to set it.

## Using the utility functions without Tailwind or UnoCSS

```js
  import { fluidText } from 'fluid-text/fluid-text'

  const myBPs = { 'mobile': '640px', 'tablet': '968px', 'desktop': '1224px', 'battlestation': '1536px' }

  const globalCSSToInject = fluidText.utility.globalStyles(myBPs).txt
  // instead of .txt, you can use .obj if you have a css-in-js setup.

  const inlineHeadingStyles = {
    // ...
    md: fluidText.utility.style("4-7-sm-6-md-4-7-xl", myBPs).txt,
    // ...
  }
  // use .obj instead if you have a css-in-js solution or are using React
  // style={fluidText.utility.style("4-7-sm-6-md-4-7-xl", myBPs).obj}
```

For utility usage, any element you apply the style to will also need a `fluid-text` class to pick up the global CSS.

To change the class name needed, pass a selector string as the second parameter to the `globalStyles` function.
The default is `".fluid-text"`.

## Running Our Tests

To run tests after cloning the repo and installing the dev dependencies, run:

```
npm run buildtests
```

This installs tailwind and uno in the corresponding test folders and copies the test/index.html file into each test directory.

Then run:

```
npm run test
```

## We want to hear from you.

Come chat with us about open source in our [Bitovi community Discord](https://discord.gg/J7ejFsZnJ4).

See what we're up to by following us on [Twitter](https://twitter.com/bitovi).
