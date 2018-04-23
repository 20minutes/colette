const glob = require('glob')
const path = require('path')

module.exports = function kssSymbolsTwigExtend(mainTwig) {
  mainTwig.extend((Twig) => {
    function renderTree(tree, token, context, self) {
      const output = []

      Object.entries(tree).forEach((item) => {
        const innerContext = Twig.ChildContext(context)
        Object.assign(innerContext, item[1])

        if (innerContext.children !== undefined) {
          innerContext.list = renderTree(innerContext.children, token, context, self)
        }

        output.push(Twig.parse.apply(self, [token.output, innerContext]))

        Twig.merge(context, innerContext, true)
      })

      return Twig.output.apply(self, [output])
    }

    // example of extending a tag type that would
    // restrict content to the specified "level"
    Twig.exports.extendTag({
      // unique name for tag type
      type: 'kssSymbols',
      // regex for matching tag
      regex: /^kssSymbols\s+(\S+)(?:\s+(\S+))?$/,

      // what type of tags can follow this one.
      next: ['endkssSymbols'], // match the type of the end tag
      open: true,
      compile: function compile(token) {
        // turn the string expression into tokens.
        token.src = Twig.expression.compile.apply(this, [{
          type: Twig.expression.type.expression,
          value: token.match[1],
        }]).stack

        token.source = Twig.expression.compile.apply(this, [{
          type: Twig.expression.type.expression,
          value: token.match[2],
        }]).stack

        token.builderPath = Twig.expression.compile.apply(this, [{
          type: Twig.expression.type.expression,
          value: 'options.builder',
        }]).stack

        delete token.match // cleanup

        return token
      },
      parse: function parse(token, context, chain) {
        const src = Twig.expression.parse.apply(this, [token.src, context]).split('in')
        const pattern = src[0].trim()
        const cwd = src[1] ? src[1].trim() : './'
        const source = Twig.expression.parse.apply(this, [token.source, context])
        const tree = {}

        const cwdFinal = path.join(path.dirname(source), cwd)

        const paths = glob.sync(pattern, { cwd: cwdFinal })

        paths.sort((a, b) => {
          const diffLenght = b.split(path.sep).length - a.split(path.sep).length

          return diffLenght !== 0 ? diffLenght : a.localeCompare(b, 'en-US')
        })

        paths.forEach((item) => {
          const splitName = item.split(path.sep)
          const obj = {
            path: item,
            id: splitName.join('-').replace(path.extname(item), ''),
            name: path.basename(item, path.extname(item)),
          }
          let dest = tree
          splitName.forEach((part, index) => {
            if (index === splitName.length - 1) {
              dest[part] = obj

              return
            }
            if (dest[part] === undefined) {
              dest[part] = {
                name: part,
                children: {},
              }
            }
            dest = dest[part].children
          })
        })

        return {
          chain,
          output: renderTree(tree, token, context, this),
        }
      },
    })

    // a matching end tag type
    Twig.exports.extendTag({
      type: 'endkssSymbols',
      regex: /^endkssSymbols$/,
      next: [],
      open: false,
    })
  })
}
