/* jshint node:true */

module.exports = function kssIconsTwigExtend(mainTwig) {
  mainTwig.extend((Twig) => {
    // example of extending a tag type that would
    // restrict content to the specified "level"
    Twig.exports.extendTag({
      // unique name for tag type
      type: 'kssIcons',
      // regex for matching tag
      regex: /^kssIcons\s+(.+)$/,

      // what type of tags can follow this one.
      next: ['endkssIcons'], // match the type of the end tag
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
        const regex = /^(\S+)\s*:\s*(\S+)(?:\s*-\s*(.*))?$/gm
        let test = regex.exec(doc)

        while (test !== null) {
          const innerContext = Twig.ChildContext(context)
          innerContext.icon = {
            name: test[1],
            character: test[2],
          }
          if (test[3] !== undefined) {
            const description = test[3]
            innerContext.icon.description = description
          }

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
      type: 'endkssIcons',
      regex: /^endkssIcons$/,
      next: [],
      open: false,
    })
  })
}
