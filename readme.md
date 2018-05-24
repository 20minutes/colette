# Introducing Colette
Colette is a CSS and JS starter kit for 20 Minutes web projects.
It provides basic styles and mixins to build responsive layouts,
based on the 20 Minutes digital identity guidelines.

---
## Features
- basic typography: headings, body text, lists, etc.
- helpers: colors, borders, icons, etc.
- grid system: 12-columns based, with customizable breakpoints
- ready-to-use HTML/CSS components: buttons, navbar, socialbar,
content teasers, media, and loading animation

---
## Dependencies
- [normalize.css](https://github.com/necolas/normalize.css/) by [Nicolas Gallagher](https://github.com/necolas): a collection of HTML element and attribute style-normalizations

---
## Installation

### With npm (recomended)
```bash
npm install colette --save
```

---
## Download
- See the [`dist/`](https://github.com/20minutes/colette/tree/gh-pages/dist)
directory for ready-to-use CSS files.
- If you want to use Colette as a kickstarter for custom stylus/css
projects, check [`src/`](https://github.com/20minutes/colette/assets/).

---
## Use Colette’s styles from Stylus sources

You can use `colette.css` as is (or minified files `colette.min.css`).

But the best way to use Colette is by Stylus and JavaScript sources with a task-runner (ex: gulp, webpack).

### Use gulp

To compile your stylus, use [`gulp`](https://github.com/gulpjs/gulp) and [`gulp-stylus`](https://github.com/stevelacy/gulp-stylus)

```javascript
/* gulpfile.js */
gulp.task('css', function () {
   return gulp.src(cfg.cssDir + '*.styl')
   .pipe(stylus({
        include: [
            PATH_TO_STYLUS_IMPORT,
            AN_OTHER_PATH_TO_FIND_STYLUS_MODULES
        ],
        'include css': true
    }))
   .pipe(gulp.dest('css/'))
})
```

`PATH_TO_STYLUS_IMPORT` could be `node_modules` for example if you use npm.


### Partial import

Colette is a collection of stylus features. You can define which styles you want to include into your final CSS file with stylus import.

By default, you include all `colette.styl` and all features are in your CSS.
You can select features needed by copying `colette.styl` content and choose your imports rules.

```stylus
/* my_css_file.styl */

// Your own settings

// Import colette
@require 'colette/assets/styl/colette'

/* => will compile to my_css_file.css */
```

But can be usefull to:
- change order of imports,
- import only needed features,
- separate your critical CSS from your global CSS.

## Use Colette’s JavaScript from sources

You can use `colette.min.js` as is.

But the best way to use it is with a task-runner by JavaScript sources (ex: gulp, webpack).

You should use babel to transpile colette code to Javascript for Browsers.
