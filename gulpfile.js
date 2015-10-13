var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    plumber   = require('gulp-plumber'),
    rename    = require('gulp-rename'),
    stylus    = require('gulp-stylus'),
    uglify    = require('gulp-uglify'),
    path      = require('path');

var cfg = {
    bowerDir: 'bower_components/',
    fontsDir: 'assets/fonts/',
    cssDir: 'assets/styl/',
    jsDir: 'assets/js/',
    distDir: 'dist/',
    stylusPattern: '**/*.styl',
    jsPattern: '**/*.js'

};

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

// watch
gulp.task('watch', function() {
    gulp.watch(cfg.cssDir + cfg.stylusPattern, ['styles']);
    gulp.watch(cfg.jsDir + cfg.jsPattern, ['scripts']);
});

// build
gulp.task('build', ['styles', 'scripts']);
