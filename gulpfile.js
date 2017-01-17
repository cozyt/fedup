//--- Node/Gulp plugins -------------------------------------------------------

var del         = require('del'),
    gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    declare     = require('gulp-declare'),
    handlebars  = require('gulp-handlebars'),
    imagemin    = require('gulp-imagemin'),
    newer       = require('gulp-newer'),
    notify      = require('gulp-notify'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    wrap        = require('gulp-wrap'),
    path        = require('path');

//--- Vars --------------------------------------------------------------------

var buildPath   = 'build/',
    distPath    = 'dist/assets/',
    fontsPath   = 'src/fonts/',
    imagesPath  = 'src/images/',
    scriptsPath = 'src/scripts/',
    // viewsPath   = 'src/views/',
    stylesPath  = 'src/styles/';

//--- Config ------------------------------------------------------------------

var package = require('./package.json');

//--- Tasks -------------------------------------------------------------------

//--- gulp
//--- Default gulp task that runs most of the defined tasks in this gulp file
gulp.task('default', [
    'fonts',
    'images',
    'styles',
    'scripts' // handles views compiling too
], function () {
    return gulp
        .src(distPath)
        .pipe(notify({
            title   : package.title,
            message : 'Build complete'
        }));
});

//--- gulp watch
//--- Development task. Sets a watch tasks on the main source directories
gulp.task('watch', function() {
    gulp.watch(fontsPath + '**/*',   ['fonts']);
    gulp.watch(imagesPath + '**/*',  ['images']);
    gulp.watch(scriptsPath + '**/*', ['scripts']);
    gulp.watch(stylesPath + '**/*',  ['styles']);
    // gulp.watch(viewsPath + '**/*',   ['scripts']);

    return gulp
        .src(distPath)
        .pipe(notify({
            title   : package.title,
            message : 'Watching...'
        }));
});

//--- gulp clean
//--- Cleans the distribution directory of copiled assets
gulp.task('clean', function() {
    del([
        buildPath,
        distPath + 'fonts',
        distPath + 'images',
        distPath + 'maps',
        distPath + 'scripts',
        // distPath + 'views',
        distPath + 'styles'
    ]);

    return gulp
        .src(distPath)
        .pipe(notify({
            title   : package.title,
            message : 'Build and distribution directories cleaned'
        }));
});

//--- gulp fonts
//--- Copies fonts to distribution
gulp.task('fonts', function() {
    return gulp
        .src([
            'bower_components/bootstrap-sass/assets/fonts/**/*',
            'bower_components/fontawesome/fonts/**/*',
            fontsPath + '**/*'
        ])
        .pipe(newer(distPath + 'fonts'))
        .pipe(gulp.dest(distPath + 'fonts'));
});

//--- gulp images
//--- Optimizes images and copies them to distribution
gulp.task('images', function() {
    return gulp
        .src(imagesPath + '**/*')
        .pipe(newer(distPath + 'images'))
        .pipe(imagemin())
        .pipe(gulp.dest(distPath + 'images'));
});

//--- gulp styles
//--- Compiles vendor and application styles using SASS into a single minified
//--- file with sourcemaps and saves in distribution
gulp.task('styles', function() {
    return gulp
        .src([
            stylesPath + 'app.scss'
        ])
        .pipe(rename('styles.css'))
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'compressed',
                precision  : 5
            })
            .on('error', sass.logError)
        )
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(distPath + 'styles'));
});


//--- gulp scripts
//--- Compiles vendor and application scripts as well as application view
//--- templates using Handlebars into a single minified file with sourcemaps
//--- and saves in distribution directories. View files are compile before
//-- the other script files
gulp.task('scripts', [
        // 'views'
    ], function() {
    return gulp
        .src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            scriptsPath + 'app.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(distPath + 'scripts'));
});


//--- gulp views
//--- Simply compiles view files using Handlebars int the distribution
//--- directory. The output file is compiled into the scripts task to create
//--- a single file.
// gulp.task('views', function() {
//     return gulp
//         .src([
//             viewsPath + "**/*.hbs"
//         ])
//         .pipe(sourcemaps.init())
//         .pipe(handlebars())
//         .pipe(wrap('Handlebars.template(<%= contents %>)'))
//         .pipe(declare({
//             namespace: 'Template'
//         }))
//         .pipe(uglify())
//         .pipe(concat('views.js'))
//         .pipe(sourcemaps.write('../maps'))
//         .pipe(gulp.dest(distPath + 'views'));
// });
