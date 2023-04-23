/**
 * fluid-text
 * Author ~ Jane Ori
 * BSD 2-Clause License
 * Copyright (c) 2023 Bitovi
 */

// themeBPs = { 'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1536px' }
const getBreakpointsMeta = themeBPs => {
  const names = Object.keys(themeBPs)
  const parsed = names.reduce((parsed, bp) => {
    parsed[bp] = parseFloat(themeBPs[bp]) || 0 // TODO: assumes px string
    return parsed
  }, { zero: 0 })
  const sortedNames = Object.keys(themeBPs).sort((a, b) => parsed[a] - parsed[b])
  return {
    string: themeBPs,
    parsed,
    sortedNames,
    finalBPVal: parsed[sortedNames[sortedNames.length - 1]]
  }
}

const globalStyles = (themeBPs, matchAllVariantsSelector = '[class*="fluid-text-"]') => {
  const bpMeta = getBreakpointsMeta(themeBPs)
  const bps = bpMeta.sortedNames

  const initializedInputs = {
    '--fluid-from-zero': "initial",
    'font-size': 'var(--fluid-em)'
  }
  bps.forEach(bp => (initializedInputs[`--fluid-from-${bp}`] = "initial"))

  initializedInputs["--fluid-em"] = bps.reduceRight((str, bp) => {
    return str + "var(--_fluid_from_" + bp + ", "
  }, "") + "var(--fluid-from-zero, 12px)" + ")".repeat(bps.length)
  /* ^ produces the following
    var(--_fluid_from_2xl,
      var(--_fluid_from_xl,
        var(--_fluid_from_lg,
          var(--_fluid_from_md,
            var(--_fluid_from_sm,
              var(--fluid-from-zero, 1rem))))));
    The inputs use -, internal vars use _.
    Internal vars are a copy of the corresponding input, but are only set once the corresponding MQ matches.
    The final result uses the biggest active MQ buildpoint and if that one isn't set, fall back to previous.
  */

  const obj = {
    [matchAllVariantsSelector]: initializedInputs
  }

  let txt = `
    ${matchAllVariantsSelector} {
      ${Object.keys(initializedInputs).reduce((css, prop) => {
        css += `${prop}: ${initializedInputs[prop]};\n`
        return css
      }, "")}
    }
  `

  bps.forEach(bp => {
    const mq = `@media (min-width: ${bpMeta.parsed[bp]}px)` // px bps only TODO:?
    const cssVar = `--_fluid_from_${bp}`
    const cssVal = `var(--fluid-from-${bp})`

    obj[mq] = { [matchAllVariantsSelector]: { [cssVar]: cssVal }}
    txt += `${mq} { ${matchAllVariantsSelector} { ${cssVar}: ${cssVal} } }\n`
  })

  return { obj, txt }
}

const style = (boundaries, themeBPs) => {
  const obj = {}
  let txt = ""
  const bpMeta = getBreakpointsMeta(themeBPs)
  const rxNames = bpMeta.sortedNames.join("|")
  const parseFluidValue = new RegExp(
    `(\\d+(?:\\.\\d+)?\\b)(?:-(\\d+(?:\\.\\d+)?)\\b)?(?:-(${rxNames})\\b)?|-(${rxNames})\\b`, "g"
  )
  let lastBP = "zero"
  let lastSize = 0
  boundaries.replace(parseFluidValue, function (_, leftSize = lastSize, rightSize = leftSize, rightBP = arguments[4], onlyBP) {
    // console.log({ lastBP, leftSize, rightSize, rightBP, onlyBP })
    const leftBPVal = bpMeta.parsed[lastBP] || 0
    const rightBPVal = bpMeta.parsed[rightBP] || bpMeta.finalBPVal
    const currentScreenWidthMaxedAtRightBPVal = `min(${rightBPVal}px, 100vw)`
    const maxRangeBetweenBPs = rightBPVal - leftBPVal
    const lengthOfRangeVisible = `${currentScreenWidthMaxedAtRightBPVal} - ${leftBPVal}px`
    const currentlyVisibleRangeScalar = `(${lengthOfRangeVisible}) / ${maxRangeBetweenBPs}`
    const maxPxChange = (rightSize - leftSize) * 4 // treat size as px
    // can't be rem based because currentlyVisibleRangeScalar is tainted with length. (CSS can't len / len = num yet, so no num scalars)
    // If it was rem anyway and root font-size changes, the computed leftSize would also respond but maxPxChange is <number> and cannot.
    const increaseByPx = ` + ${maxPxChange} * ${currentlyVisibleRangeScalar}`
    const cssInputVar = `--fluid-from-${lastBP}`
    obj[cssInputVar] = maxPxChange ? `calc(${leftSize * 4}px${increaseByPx})` : `${leftSize * 4}px`
    txt += `${cssInputVar}: ${obj[cssInputVar]}; `
    lastSize = rightSize
    lastBP = rightBP
  })
  return { obj, txt: txt.trim() }
}

export const fluidText = {
  uno: {
    preflights: [{
      getCSS: ({ theme }) => globalStyles(theme.breakpoints).txt
    }],
    rules: [
      [/^fluid-text-\[?(\d.*?)\]?$/, ([, boundaries], { theme }) => {
        return style(boundaries, theme.breakpoints).obj
      }]
    ]
  },
  tailwind: {
    plugin: function ({ theme, addBase, matchUtilities }) {
      const themeBPs = theme("screens")
      addBase(globalStyles(themeBPs).obj)
      matchUtilities({
        // tailwind matches when class is "fluid-text-[...]"
        'fluid-text': boundaries => style(boundaries, themeBPs).obj
      })
    }
  },
  utility: {
    globalStyles: (themeBPs, globalSelector = ".fluid-text") => globalStyles(themeBPs, globalSelector),
    style
  }
}
