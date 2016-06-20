'use strict';

//npm install gulp gulp-eslint  gulp-uglify gulp-rename del gulp-minify-css browser-sync --save-dev

var gulp = require('gulp');
var pngcrush = require('imagemin-pngcrush');
var prettify = require('gulp-html-prettify');
var browserSync = require('browser-sync');
var del = require('del');
var processhtml = require('gulp-processhtml');
var gulpLoadPlugins = require('gulp-load-plugins');
var $9527 = gulpLoadPlugins();
// var eslint = require('gulp-eslint');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var concat = require('gulp-concat');
// var minifyCss = require("gulp-minify-css");
// var changed = require('gulp-changed');
// var changedInPlace = require('gulp-changed-in-place');
// var webpack = require('gulp-webpack');
// var autoprefixer = require('gulp-autoprefixer');
// var plumber = require('gulp-plumber');
// var notify = require('gulp-notify');
// var imagemin = require('gulp-imagemin');
// var cache = require('gulp-cache');


var config = {
    dev_root_path: 'src',
    dev_js_path: 'src/js/myJs',
    dev_css_path: 'src/styles',
    dev_image_path: 'src/images',
    dist_root_path: 'dist',
    dist_js_path: 'dist/js',
    dist_css_path: 'dist/styles',
    dist_image_path: 'dist/images'
};


// Lint JavaScript
gulp.task('lint', function() {
    return gulp.src(config.dev_js_path + '/**/*.js')
        //.pipe(changed('dist'))
        //.pipe(changedInPlace({ firstPass: true }))
        .pipe($9527.plumber({ errorHandler: $9527.notify.onError('Error: <%= error.message %>') }))
        .pipe($9527.eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe($9527.eslint.formatEach());
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        //.pipe(eslint.failAfterError());
});

gulp.task('script', function() {
    return gulp.src(config.dev_js_path + '/**/*.js')
        //.pipe(changedInPlace({ firstPass: true }))
        //.pipe(gulp.dest(buildPath + '/js'))
        .pipe($9527.plumber({ errorHandler: $9527.notify.onError('Error: <%= error.message %>') }))
        .pipe($9527.concat('all.js'))
        //.pipe(webpack())
        .pipe($9527.uglify({ preserveComments: 'some' }))
        .pipe($9527.rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist_js_path));
        //.pipe(notify({ message: 'Scripts task complete' }))
});

gulp.task('copy', function() {
    return gulp.src([
            config.dev_root_path + '/**/*',
            '!' + config.dev_root_path + '/**/*.{js,css}',
            '!' + config.dev_root_path + '/**/*.{png,jpg}'
        ])
        .pipe($9527.plumber({ errorHandler: $9527.notify.onError('Error: <%= error.message %>') }))
        .pipe($9527.changedInPlace({ firstPass: true }))
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest(config.dist_root_path));
});


gulp.task("processhtml",['copy'],function () {
    gulp.src(config.dev_root_path+'/**/*.html')
        .pipe(processhtml())
        .pipe(gulp.dest(config.dist_root_path));
})


gulp.task('styles', function() {

    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    return gulp.src(config.dev_css_path + '/**/*.css')
        .pipe($9527.plumber({ errorHandler: $9527.notify.onError('Error: <%= error.message %>') }))
        //.pipe(changedInPlace({ firstPass: true }))
        .pipe($9527.sourcemaps.init({loadMaps: true}))
        .pipe($9527.concat('style.min.css'))
        .pipe($9527.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        .pipe($9527.minifyCss())
        .pipe($9527.sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist_css_path));
});


gulp.task('imagemin', function() {

    return gulp.src(config.dev_root_path + "/images/*.(png|jpg|jpeg|gif|svg)")
        .pipe($9527.imagemin())
        .pipe(gulp.dest(config.dev_root_path));
})

gulp.task('imagemin', function() {
    return gulp.src('src/images/*')
        .pipe($9527.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dist/images/'));
        //.pipe(notify({ 'img task ok' }));
});



gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch(config.dev_css_path + '/**/*.css', ['styles']);

    gulp.watch(config.dev_root_path + '/**/*.html', ['processhtml']);

    // Watch .js files
    gulp.watch(config.dev_js_path + '/**/*.js', ['lint', 'script']);

    // Watch image files
    gulp.watch(config.dev_image_path + '/**/*', ['imagemin']);

});

gulp.task('browser-sync',['script', 'processhtml', 'imagemin', 'styles','watch'], function() {
    var files = [
        config.dist_root_path + '/**/*.html',
        config.dist_css_path + '/**/*.css',
        config.dist_js_path + '/**/*.js'
        //config.dist_image_path + '/**/*',
    ];

    browserSync({
        files: files,
        server: {
            baseDir: config.dist_root_path
        },
        port: 9527
    });
});


gulp.task('clean', ['lint'], () => del([config.dist_js_path + '/*', config.dist_css_path + '/*', '!dist/.git'], { dot: true }));
gulp.task('default', ['clean'], () =>
    gulp.run('browser-sync')
);




