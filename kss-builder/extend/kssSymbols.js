const glob = require('glob');
const path = require('path');

module.exports = function (Twig) {
    'use strict';

    Twig.extend(function (Twig) {
        function renderTree(tree, token, context, self) {
            const output = [];

            Object.entries(tree).forEach((item) => {
                const innerContext = Twig.ChildContext(context);
                Object.assign(innerContext, item[1]);

                if (innerContext.children !== undefined) {
                    innerContext.list = renderTree(innerContext.children, token, context, self);
                }

                output.push(Twig.parse.apply(self, [token.output, innerContext]));

                Twig.merge(context, innerContext, true);
            });

            return Twig.output.apply(self, [output]);
        }

        // example of extending a tag type that would
        // restrict content to the specified "level"
        Twig.exports.extendTag({
            // unique name for tag type
            type: 'kssSymbols',
            // regex for matching tag
            regex: /^kssSymbols\s+(\S+)(?:\s+(\S+))?(?:\s+(\S+))?$/,

            // what type of tags can follow this one.
            next: ['endkssSymbols'], // match the type of the end tag
            open: true,
            compile: function (token) {
                // turn the string expression into tokens.
                token.pattern = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: token.match[1]
                }]).stack;

                token.cwd = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: token.match[2]
                }]).stack;

                token.source = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: token.match[3]
                }]).stack;

                token.builderPath = Twig.expression.compile.apply(this, [{
                    type: Twig.expression.type.expression,
                    value: 'options.builder'
                }]).stack;

                delete token.match; // cleanup
                return token;
            },
            parse: function (token, context, chain) {
                const pattern = Twig.expression.parse.apply(this, [token.pattern, context]);
                const cwd = Twig.expression.parse.apply(this, [token.cwd, context]);
                const source = Twig.expression.parse.apply(this, [token.source, context]);
                const builderPath = Twig.expression.parse.apply(this, [token.builderPath, context]);
                const tree = {};

                const patternFinal = path.relative(path.join(builderPath, cwd), path.join(path.dirname(source), pattern.trim()));
                const cwdFinal = path.join(builderPath, cwd);

                const paths = glob.sync(patternFinal, {cwd: cwdFinal});

                paths.sort(function (a, b) {
                    const diffLenght = b.split(path.sep).length - a.split(path.sep).length
                    return diffLenght !== 0 ? diffLenght : a.localeCompare(b, 'en-US');
                });

                paths.forEach((item) => {
                    const splitName = item.split(path.sep);
                    const obj = {
                        path: item,
                        id: splitName.join('-').replace(path.extname(item), ''),
                        name: path.basename(item, path.extname(item))
                    };
                    let dest = tree;
                    splitName.forEach((part, index) => {
                        if (index === splitName.length - 1) {
                            dest[part] = obj;
                            return;
                        }
                        if (dest[part] === undefined) {
                            dest[part] = {
                                name: part,
                                children: {}
                            };
                        }
                        dest = dest[part].children;
                    });
                });

                return {
                    chain: chain,
                    output: renderTree(tree, token, context, this)
                };
            }
        });

        // a matching end tag type
        Twig.exports.extendTag({
            type: 'endkssSymbols',
            regex: /^endkssSymbols$/,
            next: [],
            open: false
        });
    });
};
