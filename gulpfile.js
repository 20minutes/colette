var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    plumber   = require('gulp-plumber'),
    rename    = require('gulp-rename'),
    stylus    = require('gulp-stylus'),
    stylint   = require('gulp-stylint'),
    uglify    = require('gulp-uglify'),
    path      = require('path'),
    run       = require('gulp-run'),
    sequence  = require('run-sequence'),
    kss       = require('kss');

var cfg = {
    bowerDir: 'bower_components/',
    fontsDir: 'assets/fonts/',
    cssDir: 'assets/styl/',
    jsDir: 'assets/js/',
    docDir: 'styleguide/',
    distDir: 'dist/',
    stylusPattern: '**/*.styl',
    jsPattern: '**/*.js'
};

// css
gulp.task('styles', function()
{
    return [
        gulp.src(cfg.cssDir + 'colette.styl')
        .pipe(stylus({
            compress: false,
            linenos: false,
            use: [require('nib')()],
            import: ['nib']
        }))
        .pipe(gulp.dest(cfg.distDir + 'css')),

        gulp.src(cfg.cssDir + 'colette.styl')
        .pipe(stylus({
            compress: true,
            linenos: false,
            use: [require('nib')()],
            import: ['nib']
        }))
        .pipe(rename('colette.min.css'))
        .pipe(gulp.dest(cfg.distDir + 'css'))
    ];
});

// lint css
gulp.task('stylint', function() {
    return gulp.src(cfg.cssDir + cfg.stylusPattern)
        .pipe(stylint({ config: '.stylintrc' }))
        .pipe(stylint.reporter());
});

// js
gulp.task('scripts', function()
{
    return gulp.src([
            cfg.bowerDir + 'headroom.js/dist/headroom.min.js',
            cfg.jsDir + 'colette/js/colette.js'
        ])
        .pipe(plumber())
        .pipe(gulp.dest(cfg.distDir + 'js'))
        .pipe(concat('colette.min.js'))
        .pipe(gulp.dest(cfg.distDir + 'js'))
        .pipe(uglify());
});

// assets
gulp.task('assets', function() {
    // Retrieve fonts into dist/ directory
    gulp.src(cfg.fontsDir + '*')
        .pipe(gulp.dest(cfg.distDir + 'fonts'));
});

// kss
gulp.task('kss', function () {
    // generate doc
    kss(require('./kss.json'));

    // retrieve dist directory
    gulp.src(cfg.distDir + '*/**')
        .pipe(gulp.dest(cfg.docDir + 'dist/'));

});

// watch
gulp.task('watch', function() {
    gulp.watch(cfg.cssDir + cfg.stylusPattern, ['styles', 'kss']);
    gulp.watch(cfg.jsDir + cfg.jsPattern, ['scripts']);
});

// build
gulp.task('build', ['styles', 'scripts', 'assets']);
