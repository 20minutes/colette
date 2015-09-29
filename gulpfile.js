var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    minify    = require('gulp-minify'),
    plumber   = require('gulp-plumber'),
    rename    = require('gulp-rename'),
    fonts64   = require('gulp-simplefont64'),
    stylus    = require('gulp-stylus'),
    uglify    = require('gulp-uglify'),
    path      = require('path');

var cfg = {
    bowerDir: 'bower_components/',
    fontsDir: 'assets/fonts/',
    cssDir: 'assets/styl/',
    jsDir: 'assets/js/',
    distDir: 'dist/'

};

// base64 encode fonts
gulp.task('fonts', function() {
    return gulp.src([cfg.fontsDir + '*.woff'])
        .pipe(fonts64())
        .pipe(concat('_fonts64.styl'))
        .pipe(gulp.dest(cfg.cssDir + '_base/'));
});

// css
gulp.task('styles', function()
{
    return gulp.src(cfg.cssDir + 'colette.styl')
        .pipe(stylus({
            compress: true,
            linenos: false,
            use: [require('nib')()],
            import: ['nib']
        }))
        .pipe(minify())
        .pipe(rename('colette.min.css'))
        .pipe(gulp.dest(cfg.distDir));
});

// js
gulp.task('scripts', function()
{
    return gulp.src([
            cfg.bowerDir + 'headroom.js/dist/headroom.min.js',
            cfg.jsDir + 'colette/js/colette.js'
        ])
        .pipe(plumber())
        .pipe(concat('colette.min.js'))
        .pipe(gulp.dest(cfg.distDir))
        .pipe(uglify());
});
