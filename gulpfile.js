var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    stylusSvgImport = require('stylus-svg'),
    stylint = require('gulp-stylint'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    svgstore = require('gulp-svgstore'),
    fs = require('fs'),
    kss = require('kss');

var cfg = {
    bowerDir: 'bower_components/',
    fontsDir: 'assets/fonts/',
    cssDir: 'assets/styl/',
    jsDir: 'assets/js/',
    svgDir: 'assets/svg/',
    kssBuilderDir: 'kss-builder/',
    docDir: 'docs/',
    distDir: 'dist/',
    stylusPattern: '**/*.styl',
    twigPattern: '**/*.twig',
    kssPattern: '**/*',
    jsPattern: '**/*.js',
    svgPattern: '**/*.svg'
};

// compileStyles
function compileStyles(src, dest, outputFilename, minify = false) {
    return gulp.src(src)
        .pipe(stylus({
            compress: false, // cssnano do it
            linenos: false,
            include: ['node_modules'],
            'include css': true
        }))
        .pipe(postcss([
            autoprefixer({browsers: ['> 0.5%']}),
        ]))
        .pipe(rename(outputFilename))
        .pipe(gulp.dest(dest));
};


// build css
gulp.task('styles', function () {
    var dest = cfg.distDir + 'css';

    gulp.src(cfg.cssDir + 'colette.styl')
        .pipe(stylus({
            compress: false, // cssnano do it
            linenos: false,
            include: ['node_modules'],
            'include css': true,
            // use: [stylusSvgImport()]
        }))
        .pipe(postcss([
            autoprefixer({browsers: ['> 0.5%']}),
        ]))
        .pipe(rename('colette.css'))
        .pipe(gulp.dest(dest))
        .pipe(postcss([
            cssnano
        ]))
        .pipe(rename('colette.min.css'))
        .pipe(gulp.dest(dest));
});

// lint css
gulp.task('stylint', function () {
    return gulp.src(cfg.cssDir + cfg.stylusPattern)
        .pipe(stylint({ config: '.stylintrc' }))
		.pipe(stylint.reporter())
		.pipe(stylint.reporter('fail', { failOnWarning: true }));
});

// js
gulp.task('scripts', function () {
    return gulp.src([
            cfg.bowerDir + 'headroom.js/dist/headroom.js',
            cfg.jsDir + 'colette/js/colette.js',
            cfg.jsDir + 'colette/js/colette-iframeResizer.js'
        ])
        .pipe(plumber())
        .pipe(concat('colette.js'))
        .pipe(gulp.dest(cfg.distDir + 'js'))
        .pipe(rename('colette.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(cfg.distDir + 'js'));
});

// assets
gulp.task('assets', function () {
    // Retrieve fonts into dist/ directory
    gulp.src(cfg.fontsDir + '*')
        .pipe(gulp.dest(cfg.distDir + 'fonts'));
});

// kss
gulp.task('kss', function () {
    // we need the dist/ folder to build docs/
    // so we check if it exists and throw an error if needed
    return fs.access(cfg.distDir, function (err){
        if (err) {
            console.log('Can’t access the dist/ folder.');
            console.log('Try running `gulp build` to solve the problem.');
            console.log(err)
        } else {
            // compile kss-builder css
            gulp.src(cfg.kssBuilderDir + '/styl/co-styles.styl')
                .pipe(stylus({
                    compress: true, // cssnono do it
                    linenos: false,
                }))
                .pipe(postcss([
                    autoprefixer({browsers: ['> 0.5%']}),
                    cssnano
                ]))
                .pipe(rename('co-styles.min.css'))
                .pipe(gulp.dest(cfg.kssBuilderDir + 'kss-assets/'));

              // generate doc
              kss(require('./kss.json'));

              // retrieve dist directory
              gulp.src(cfg.distDir + '*/**')
                  .pipe(gulp.dest(cfg.docDir + 'dist/'));
        }
    });
});

// svg
gulp.task('svg', function () {
    return gulp
        .src(cfg.svgDir + cfg.svgPattern, {base: cfg.svgDir})
        .pipe(rename(function (filePath) {
            var name = filePath.dirname !== '.' ? filePath.dirname.split(filePath.sep) : [];
            name.push(filePath.basename);
            filePath.basename = 'symbol-' + name.join('-');
        }))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(gulp.dest(cfg.distDir + 'svg/'));
});

// watch
gulp.task('watch', function () {
    gulp.watch(cfg.cssDir + cfg.twigPattern, ['kss']);
    gulp.watch([cfg.cssDir + cfg.stylusPattern], ['stylint', 'styles', 'kss']);
    gulp.watch(cfg.svgDir + cfg.svgPattern, ['svg', 'kss']);
    gulp.watch(cfg.jsDir + cfg.jsPattern, ['scripts']);
});

// build
gulp.task('build', ['svg', 'styles', 'scripts', 'assets']);

// build
gulp.task('docs', ['kss']);

// test
gulp.task('test', ['stylint']);

// default
gulp.task('default', ['build', 'watch']);

