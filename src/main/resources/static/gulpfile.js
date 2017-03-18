var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var Q = require('q');

// == PATH STRINGS ========

var paths = {
    scripts: ['app/**/*.js', '!app/vendor/**'],
    vendorScripts: [
        './node_modules/jquery/dist/jquery.js'
        , './node_modules/bootstrap/dist/js/bootstrap.js'
        , './node_modules/angular/angular.js'
        , './node_modules/angular-animate/angular-animate.js'
        , './node_modules/angular-ui-router/release/angular-ui-router.js'
        , './node_modules/angular-sanitize/angular-sanitize.js'
        , './node_modules/angular-resource/angular-resource.js'
        , './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
        , './node_modules/angular-scroll/angular-scroll.js'
        , './node_modules/angular-touch/angular-touch.js'
        , './node_modules/angular-cookies/angular-cookies.js'
        , './node_modules/chosen-js/chosen.jquery.js'
        , './node_modules/angular-loading-bar/build/loading-bar.js'
        , './node_modules/angular-recaptcha/release/angular-recaptcha.js'
        , './node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js'
        , './node_modules/ui-select/dist/select.js'
        , './node_modules/fastclick/lib/fastclick.js'
        , './node_modules/lodash/lodash.js'
        , './node_modules/ng-flow/dist/ng-flow-standalone.js'
        , './app/vendor/angular-bootstrap-datetimepicker/datetimepicker.js'
        , './app/vendor/angular-bootstrap-datetimepicker/datetimepicker.templates.js'
        , './app/vendor/utils.js'
    ],
    styles: [
        './node_modules/bootstrap/dist/css/bootstrap.css'
        , './node_modules/font-awesome/css/font-awesome.css'
        , './node_modules/angular-loading-bar/build/loading-bar.css'
        , './node_modules/animate.css/animate.css'
        , './node_modules/angular-timezone-selector/dist/angular-timezone-selector.css'
        , './node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.css'
        , './node_modules/ui-select/dist/select.css'
        , './node_modules/flag-icon-css/css/flag-icon.css'
        , './app/vendor/angular-bootstrap-datetimepicker/datetimepicker.css'
        , './app/styles/**/*.css'
        , './app/styles/**/*.scss'

    ],
    fonts: [
        './node_modules/font-awesome/fonts/*'
        , './node_modules/bootstrap/fonts/*'
    ],
    flags: [
        './node_modules/flag-icon-css/flags/1x1/gb.svg'
        , './node_modules/flag-icon-css/flags/1x1/ro.svg'
    ],
    images: './app/images/**/*',
    index: './index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    distTargetDev: '../../../../target/classes/static/dist.dev',
    distDev: 'dist.dev',
    distDevStatic: 'dist.dev/static',
    distProd: 'dist.prod/static',
    distScriptsProd: './dist.prod/static/scripts'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'bootstrap.js', 'angular.js', 'lodash.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.minifiedFileName = function() {
    return plugins.rename(function(path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDevStatic));
};

pipes.builtAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.builtVendorScriptsDev = function() {
    return gulp.src(paths.vendorScripts)
        .pipe(gulp.dest(paths.distDevStatic + '/vendor_components'));
};

pipes.builtVendorScriptsProd = function() {
    return gulp.src(paths.vendorScripts)
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDevStatic));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "agiloApp"
        }));
};

pipes.copyFlagsDev = function() {
    return gulp.src(paths.flags)
        .pipe(gulp.dest(paths.distDevStatic + '/styles/flags/1x1'));
};

pipes.copyFlagsProd = function() {
    return gulp.src(paths.flags)
        .pipe(gulp.dest(paths.distProd + '/styles/flags/1x1'));
};

pipes.copyFontsDev = function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distDevStatic + '/styles/fonts'));
};

pipes.copyFaviconIcoDev = function() {
    return gulp.src('./favicon.ico')
        .pipe(gulp.dest(paths.distDev));
};

pipes.copyFaviconIcoProd = function() {
    return gulp.src('./favicon.ico')
        .pipe(gulp.dest(paths.distProd));
};

pipes.copyFontsProd = function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distProd + '/styles/fonts'));
};

pipes.builtStylesDev = function() {
    pipes.copyFontsDev();
    pipes.copyFlagsDev();

    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(gulp.dest(paths.distDevStatic + '/styles/css'));
};

pipes.builtStylesProd = function() {
    pipes.copyFontsProd();
    pipes.copyFlagsProd();
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distProd + '/styles/css'));
};

pipes.processedImagesDev = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDevStatic + '/images/'));
};

pipes.processedImagesProd = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distProd + '/images/'));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.copyI18nProd = function() {
    return gulp.src('app/i18n')
        .pipe(gulp.dest(paths.distProd + '/i18n'));
};

pipes.copyI18nDev = function() {
    return gulp.src('app/i18n/*')
        .pipe(gulp.dest(paths.distDevStatic + '/i18n'));
};

pipes.builtIndexDev = function() {
    pipes.copyFaviconIcoDev();

    var orderedVendorScripts = pipes.builtVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDevStatic)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {name: 'bower', ignorePath: 'dist.dev', addRootSlash: false}))
        .pipe(plugins.inject(orderedAppScripts, {ignorePath: 'dist.dev', addRootSlash: false}))
        .pipe(plugins.inject(appStyles, {ignorePath: 'dist.dev', addRootSlash: false}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function() {
    pipes.copyFaviconIcoProd();

    var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtAppDev = function() {
    pipes.copyI18nDev();
    return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev(), pipes.processedImagesDev());
};

pipes.builtAppProd = function() {
    pipes.copyI18nProd();
    return es.merge(pipes.builtIndexProd(), pipes.processedImagesProd());
};

// == TASKS ========

// removes all compiled dev files
gulp.task('clean-dev', function() {
    return del('dist.dev');
});

// removes all compiled production files
gulp.task('clean-prod', function() {
    return del('dist.prod');
});

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.builtStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev'], function() {

    //gulp.src('dist.dev')
    //    .pipe(plugins.webserver({
    //        livereload: true,
    //        directoryListing: true,
    //        open: "http://localhost:8000/index.html"
    //    }));
    //
    //// start live-reload server
    //plugins.livereload.listen({start: true});

    var oldDistDev = paths.distDev;
    paths.distDev = paths.distTargetDev;
    paths.distDevStatic = paths.distDev + '/static';
    //var option, i = process.argv.indexOf("--distVbb");
    //if(i > -1) {
    //    paths.distDev = process.argv[i+1];
    //}
    console.log("Using distDev: " + paths.distDev);
    gulp.src(oldDistDev + '/**/*').pipe(gulp.dest(paths.distDev));

    // watch index
    gulp.watch(paths.index, function() {
        console.log(new Date().toUTCString() + ">>>>> Using distDev: " + paths.distDev);
        return pipes.builtIndexDev()
            //.pipe(plugins.livereload())
            ;
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        console.log(new Date().toUTCString() + ">>>>> Using distDev: " + paths.distDev);
        return pipes.builtAppScriptsDev()
            //.pipe(plugins.livereload())
            ;
    });

    // watch html partials
    gulp.watch(paths.partials, function() {
        console.log(new Date().toUTCString() + ">>>>> Using distDev: " + paths.distDev);
        return pipes.builtPartialsDev()
            //.pipe(plugins.livereload())
            ;
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        console.log(new Date().toUTCString() + ">>>>> Using distDev: " + paths.distDev);
        return pipes.builtStylesDev()
            //.pipe(plugins.livereload())
            ;
    });

});

// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['clean-build-app-prod'], function() {

    gulp.src('dist.prod')
        .pipe(plugins.webserver({
            livereload: true,
            directoryListing: true,
            open: "http://localhost:8000/index.html"
        }));

    // start live-reload server
    plugins.livereload.listen({start: true});

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexProd()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch hhtml partials
    gulp.watch(paths.partials, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesProd()
            .pipe(plugins.livereload());
    });

});

// default task builds for prod
gulp.task('default', ['clean-build-app-prod']);
