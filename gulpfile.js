var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    stylusSvgImport = require('stylus-svg'),
    stylint = require('gulp-stylint'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    run = require('gulp-run'),
    sequence = require('run-sequence'),
    svgstore = require('gulp-svgstore'),
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

// css
gulp.task('styles', function () {
    return gulp.src(cfg.cssDir + 'colette.styl')
        .pipe(stylus({
            compress: true,
            linenos: false,
            include: ['node_modules'],
            'include css': true,
            // use: [stylusSvgImport()]
        }))
        .pipe(postcss([
            autoprefixer({browsers: ['> 0.5%']}),
        ]))
        .pipe(rename('colette.min.css'))
        .pipe(gulp.dest(cfg.distDir + 'css'));
});

// lint css
gulp.task('stylint', function () {
    return gulp.src(cfg.cssDir + cfg.stylusPattern)
        .pipe(stylint({ config: '.stylintrc' }))
        .pipe(stylint.reporter());
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
    // compile kss-builder css
    gulp.src(cfg.kssBuilderDir + '/styl/co-styles.styl')
      .pipe(stylus({
          compress: true,
          linenos: false,
      }))
      .pipe(postcss([
          autoprefixer({browsers: ['> 0.5%']}),
      ]))
      .pipe(rename('co-styles.min.css'))
      .pipe(gulp.dest(cfg.kssBuilderDir + 'kss-assets/'));

    // generate doc
    kss(require('./kss.json'));

    // retrieve dist directory
    gulp.src(cfg.distDir + '*/**')
        .pipe(gulp.dest(cfg.docDir + 'dist/'));

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
    gulp.watch(cfg.cssDir + cfg.stylusPattern, ['styles', 'kss']);
    gulp.watch([cfg.cssDir + cfg.stylusPattern, cfg.kssBuilderDir + cfg.kssPattern], ['styles', 'kss']);
    gulp.watch(cfg.jsDir + cfg.jsPattern, ['scripts']);
});

// build
gulp.task('build', ['stylint', 'svg', 'styles', 'scripts', 'assets', 'kss']);
gulp.task('default', ['build', 'watch']);
