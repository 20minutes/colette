/* jshint node:true */

module.exports = function kssColorsTwigExtend(mainTwig) {
  function hexToRgb(colorHex) {
    let hex = colorHex.replace(/#/, '')

    // convert short format to 6 char
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    return {
      r: parseInt(hex[0] + hex[1], 16),
      g: parseInt(hex[2] + hex[3], 16),
      b: parseInt(hex[4] + hex[5], 16),
    }
  }

  function rgbToHsl(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)

    let h = 0
    let s = 0
    let l = (max + min) / 2

    if (max !== min) {
      const d = (max - min)

      s = (l <= 0.5) ? (d / (max + min)) : (d / (2 - d))

      switch (max) {
        case r:
          h = ((g - b) / d) % 6
          break
        case g:
          h = ((b - r) / d) + 2
          break
        case b:
          h = ((r - g) / d) + 4
          break
        default:
          break
      }

      h *= 60
    }

    s *= 100
    l *= 100

    return {
      h: `${h.toFixed(0)}°`,
      s: `${s.toFixed(1)}%`,
      l: `${l.toFixed(1)}%`,
    }
  }

  mainTwig.extend((Twig) => {
    // example of extending a tag type that would
    // restrict content to the specified "level"
    Twig.exports.extendTag({
      // unique name for tag type
      type: 'kssColors',
      // regex for matching tag
      regex: /^kssColors\s+(.+)$/,

      // what type of tags can follow this one.
      next: ['endkssColors'], // match the type of the end tag
      open: true,
      compile: function compile(token) {
        const expression = token.match[1]

        // turn the string expression into tokens.
        token.stack = Twig.expression.compile.apply(this, [{
          type: Twig.expression.type.expression,
          value: expression,
        }]).stack

        delete token.match // cleanup

        return token
      },
      parse: function parse(token, context, chain) {
        const doc = Twig.expression.parse.apply(this, [token.stack, context])
        const output = []
        const regex = /^(\S+)\s*:\s*(#[0-9A-Fa-f]{3,6})(?:\s*-\s*(.*))?$/gm
        let test = regex.exec(doc)

        while (test !== null) {
          const innerContext = Twig.ChildContext(context)
          innerContext.color = {
            name: test[1],
            hex: test[2],
          }

          if (test[3] !== undefined) {
            const description = test[3]
            innerContext.color.description = description
          }

          innerContext.color.rgb = hexToRgb(innerContext.color.hex)
          innerContext.color.hsl = rgbToHsl(innerContext.color.rgb)

          output.push(Twig.parse.apply(this, [token.output, innerContext]))

          Twig.merge(context, innerContext, true)

          test = regex.exec(doc)
        }

        return {
          chain,
          output: Twig.output.apply(this, [output]),
        }
      },
    })

    // a matching end tag type
    Twig.exports.extendTag({
      type: 'endkssColors',
      regex: /^endkssColors$/,
      next: [],
      open: false,
    })
  })
}
