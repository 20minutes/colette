var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    stylint = require('gulp-stylint'),
    eslint = require('gulp-eslint'),
    webpack = require('webpack'),
    gulpWebpack = require('webpack-stream'),
    UnminifiedWebpackPlugin = require('unminified-webpack-plugin'),
    svgstore = require('gulp-svgstore'),
    fs = require('fs'),
    kss = require('kss'),
    finalhandler = require('finalhandler'),
    http = require('http'),
    serveStatic = require('serve-static'),
    named = require('vinyl-named');

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

function stylesBuild() {
    var dest = cfg.distDir + 'css';

    gulp.src(cfg.cssDir + 'colette.styl')
    .pipe(stylus({
        compress: false, // cssnano do it
        linenos: false,
        include: ['node_modules'],
        'include css': true
    }))
    .pipe(postcss([
        autoprefixer(),
    ]))
    .pipe(rename('colette.css'))
    .pipe(gulp.dest(dest))
    .pipe(postcss([
        cssnano({
            zindex: false,
            minifyFontValues: {
                removeQuotes: false
            }
        })
    ]))
    .pipe(rename('colette.min.css'))
    .pipe(gulp.dest(dest));
}

function scriptsBuild() {
    return gulp.src([
        cfg.jsDir + '/colette.js'
    ])
    .pipe(plumber())
    .pipe(named())
    .pipe(gulpWebpack({
        output: {
            filename: '[name].min.js',
            libraryTarget: 'umd',
        },
        module: {
            rules: [{
                test: /(\.jsx|\.js|\.es6)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                useBuiltIns: true
                            }]
                        ],
                        plugins: [
                            ['transform-strict-mode', {
                                strict: true
                            }]
                        ]
                    }
                }
            }]
        },
        resolve: {
            modules: [
                'node_modules'
            ],
            extensions: ['.js', '.es6']
        },
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new UnminifiedWebpackPlugin()
        ]
    }, webpack))
    .pipe(gulp.dest(cfg.distDir + 'js'));
}

function stylesLint() {
    return gulp.src(cfg.cssDir + cfg.stylusPattern)
    .pipe(stylint({ config: '.stylintrc' }))
    .pipe(stylint.reporter())
    .pipe(stylint.reporter('fail', { failOnWarning: true }));
}

function scriptsLint() {
    return gulp.src(cfg.jsDir + cfg.jsPattern)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function assetsCopy() {
    // Retrieve fonts into dist/ directory
    gulp.src(cfg.fontsDir + '*')
    .pipe(gulp.dest(cfg.distDir + 'fonts'));
}

function svgBuild() {
    return gulp
    .src(cfg.svgDir + cfg.svgPattern, {base: cfg.svgDir})
    .pipe(rename(function (filePath) {
        var name = filePath.dirname !== '.' ? filePath.dirname.split(filePath.sep) : [];
        name.push(filePath.basename);
        filePath.basename = 'symbol-' + name.join('-');
    }))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(gulp.dest(cfg.distDir + 'svg/'));
}

function kssBuild() {
    // we need the dist/ folder to build docs/
    // so we check if it exists and throw an error if needed
    return fs.access(cfg.distDir, function (err) {
        if (err) {
            console.log('Can’t access the dist/ folder.');
            console.log('Try running `gulp build` to solve the problem.');
            console.log(err);
            return;
        }

        // compile kss-builder css
        gulp.src(cfg.kssBuilderDir + '/styl/co-styles.styl')
        .pipe(stylus({
            compress: false, // cssnano do it
            linenos: false
        }))
        .pipe(postcss([
            autoprefixer(),
            cssnano
        ]))
        .pipe(rename('co-styles.min.css'))
        .pipe(gulp.dest(cfg.kssBuilderDir + 'kss-assets/'));

        // generate doc
        kss(require('./kss.json'));

        // retrieve dist directory
        gulp.src(cfg.distDir + '*/**')
        .pipe(gulp.dest(cfg.docDir + 'dist/'));
    });
}

function watch() {
    gulp.watch(cfg.cssDir + cfg.twigPattern, ['kss']);
    gulp.watch(cfg.cssDir + cfg.stylusPattern, ['lint:css', 'styles', 'kss']);
    gulp.watch(cfg.svgDir + cfg.svgPattern, ['svg', 'kss']);
    gulp.watch(cfg.jsDir + cfg.jsPattern, ['lint:js', 'scripts']);
}

function startServer() {
    var serve = serveStatic('docs');

    var server = http.createServer(function (req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    });

    server.listen(8000);
}

gulp.task('connect', startServer);

// lint:css
gulp.task('lint:css', stylesLint);

// lint:js
gulp.task('lint:js', scriptsLint);

// lint
gulp.task('lint', ['lint:js', 'lint:css']);

// build css
gulp.task('styles', stylesBuild);

// js
gulp.task('scripts', scriptsBuild);

// assets
gulp.task('assets', assetsCopy);

// kss
gulp.task('kss', kssBuild);

// svg
gulp.task('svg', svgBuild);

// watch
gulp.task('watch', watch);

// build
gulp.task('build', ['svg', 'styles', 'scripts', 'assets']);

// build docs
gulp.task('docs', ['build'], kssBuild);

// default build docs and run watch
gulp.task('default', ['connect', 'lint', 'docs'], watch);
