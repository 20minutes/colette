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
    cssDir: './styl/',
    stylusPattern: 'styl/**/*.styl',
    jsPattern: 'js/**/*.js'
};

// base64 encode fonts
gulp.task('fonts', function() {
    return gulp.src(['fonts/*.woff'])
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
        .pipe(gulp.dest(cfg.cssDir));
});

// build
gulp.task('build', ['fonts', 'styles']);
