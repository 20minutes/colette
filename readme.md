# Introducing Colette
Colette is a css and js starter kit for 20 Minutes web projects.
It provides basic styles and mixins to build responsive layouts,
based on the 20 Minutes digital identity guidelines.

---
## Features
- basic typography: headings, body text, lists, etc.
- helpers: colors, borders, icons, etc.
- grid system: 12-columns based, with customizable breakpoints
- ready-to-use html/css components: buttons, navbar, socialbar,
content teasers, media, and loading animation

---
## Dependencies
- [normalize.css](https://github.com/necolas/normalize.css/) by [Nicolas Gallagher](https://github.com/necolas): a collection of HTML element and attribute style-normalizations
- [Headroom.js](https://github.com/WickyNilliams/headroom.js)
by [Nick Williams](https://github.com/WickyNilliams):
a lightweight, high-performance JS widget (with no dependencies!)
that allows you to react to the user's scroll.

---
## Installation
**Install with Bower**
```
bower install colette --save
```

**Install with npm**
```
npm install colette --save
```

---
## Download
- See the [`dist/`](https://github.com/20minutes/colette/dist/)
directory for ready-to-use css files.
- If you want to use Colette as a kickstarter for custom stylus/css
projects, check [`src/`](https://github.com/20minutes/colette/assets/).

---
## Use from Stylus sources

You can use `colette.css` as is.

But the best way to use Colette is by Stylus sources directly with Stylus or with a task-runner (ex: gulp).

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

Colette is a collection of stylus features. You can define which styles you want to include into your final css file with stylus import.

By default, you include all `colette.styl` and all features are in your css.
You can select features needed by copying `colette.styl` content and choose your imports rules.

```
/* my_css_file.styl */

// Your own settings

// Import colette
@require 'colette/assets/styl/colette'

/* => will compile to my_css_file.css */
```

But can be usefull to:
* change order of imports,
* import only needed features,
* separate your critical css from your global css.

#### Usage example: Handle critical css

You need to create a specific stylus file to handle your critical css.

```
/* my_criticalcss_file.styl */

// Your own settings
@require '_settings'

// Colette Imports

// colette settings
@require 'colette/assets/styl/_settings'

// colette mixins
@require 'colette/assets/styl/_mixins/*'

// colette @blocks
@require 'colette/assets/styl/_@blocks/*'

// normalize
@require 'normalize.css/normalize.css'

// colette base
@require 'colette/assets/styl/_base/_init'
@require 'colette/assets/styl/_base/_typography'

// colette components
@require 'colette/assets/styl/_modules/_media'
@require 'colette/assets/styl/_modules/_navbar'
@require 'colette/assets/styl/_modules/_tabs'
@require 'colette/assets/styl/_modules/_teasers'

// custom components
@require '_modules/_navbar'
@require '_modules/_teasers'

// colette helpers
@require 'colette/assets/styl/_helpers/_box'
@require 'colette/assets/styl/_helpers/_mask'
@require 'colette/assets/styl/_helpers/_spaces'

/* => will compile to my_criticalcss_file.css */
```

and then simply include the compiled css file into your template
(do not forget the `<style>` tag around your `include`!):

```twig
<style>
   {% include 'css/my_criticalcss_file.css' %}
</style>
```

