 /* Gulpfile.js
 /
 /  Last modification 04/01/2017
*/

"use strict";

// Packages variables
var gulp = require( "gulp" ),
    gImageMin = require( "gulp-imagemin" ), // node_modules path directory is too long to be deleted on windows. Use java executable "PathTooLong.jar" to remove it ( use with caution ! ).
    gSass = require( "gulp-sass" ),
    gAutoPrefixer = require( "gulp-autoprefixer" ),
    gCSSComb = require( "gulp-csscomb" ),
    gCleanCSS = require( "gulp-clean-css" ),
    gRename = require( "gulp-rename" ),
    gNotify = require( "gulp-notify" ),
    gPlumber = require( "gulp-plumber" ),
    browserSync = require( "browser-sync" ).create();

// Utilities variables
var sSrc = "src/",
    sDest = "build/",
    oHTML = {
        in: sSrc + "**/*.html",
        out: sDest
    },
    oAssets = {
        in: sSrc + "assets/**/*",
        out: sDest + "assets/"
    },
    oImg = {
        in: sSrc + "img_to_optim/**/*",
        out: sDest + "assets/img/"
    },
    oStyles = {
        in: sSrc + "sass/**/*.scss",
        out: sDest + "css/",
        sassOpts: {
            // outputStyle: "compressed", // Minify but overwritted by using csscomb, use clean-css to minify after csscomb pipe
            outputStyle: "expanded",
            precision: 3
        },
        plumberOpts: {
            errorHandler: gNotify.onError( {
                title: "An error occured on Styles",
                message: "<%= error.message %>"
            } )
        }
    },
    oRename = {
        minOpts: {
            suffix: ".min"
        }
    },
    oBrowserSync = {
        initOpts: {
            proxy: "http://homestead.app/DW-Projects/csszg/" + sDest
        }
    };

// HTML tasks
gulp.task( "html", function() {
    return gulp
        .src( oHTML.in )
        // Copy html files into destination directory
        .pipe( gulp.dest( oHTML.out ) );
} );

// Assets tasks
gulp.task( "assets", function() {
    return gulp
        .src( oAssets.in )
        // Copy assets files into destination directory
        .pipe( gulp.dest( oAssets.out ) );
} );

// Images tasks
gulp.task( "img", function() {
    return gulp
        .src( oImg.in )
        // Optimize images
        .pipe( gImageMin() )
        .pipe( gulp.dest( oImg.out ) );
} );

// Styles tasks
gulp.task( "styles", function() {
    return gulp
        .src( oStyles.in )
        .pipe( gPlumber( oStyles.plumberOpts ) ) // Don't stop watch task if an error occured
        // Compile sass files
        .pipe( gSass( oStyles.sassOpts ) )
        // .pipe( gSass( oStyles.sassOpts ).on( "error", gSass.logError ) )
        // Add css prefixes
        .pipe( gAutoPrefixer() )
        // Format CSS coding style
        .pipe( gCSSComb() )
        // Minify
        .pipe( gCleanCSS() )
        // Add suffix .min before writting file
        .pipe( gRename( oRename.minOpts ) )
        .pipe( gulp.dest( oStyles.out ) );
} );

// Browser-sync initialisation
gulp.task( "browser-sync", function() {
    browserSync.init( oBrowserSync.initOpts );
} );

// Watching files modifications & reload browser
gulp.task( "watch", function() {
    gulp.watch( oHTML.in, [ "html" ] ).on( "change", browserSync.reload );
    gulp.watch( oImg.in, [ "img" ] ).on( "change", browserSync.reload );
    gulp.watch( oAssets.in, [ "assets" ] ).on( "change", browserSync.reload );
    gulp.watch( oStyles.in, [ "styles" ] ).on( "change", browserSync.reload );
} );

// Create command-line tasks
gulp.task( "default", [ "html", "assets", "img", "styles" ] );

gulp.task( "work", [ "default", "watch", "browser-sync" ] );
