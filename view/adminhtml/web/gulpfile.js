var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var wrap = require("gulp-wrap");

var jsFiles = [
    //'js/src/plugins/fabric.1.7.18.js',
    'js/src/plugins/fabric_override.js',
    //'js/src/plugins/fabric-resize.js',
    'js/src/plugins/modernizr-custom.js',
    //'js/src/plugins/Sortable.js',
    //'js/src/plugins/jsBox.js',
    'js/src/core/dd_object.js',
    'js/src/core/dd_event.js',
    'js/src/core/dd_translator.js',
    'js/src/core/dd_settings.js',
    'js/src/core/dd_window.js',
    'js/src/core/dd_uibase.js',
    'js/src/core/dd_debug.js',
    'js/src/core/dd_modelbase.js',
    'js/src/core/dd_history.js',
    'js/src/core/dd_layer.js',
    'js/src/core/ui/*.js',
    'js/src/models/*.js',
    'js/src/models/controls/*.js',
    'js/src/layers/*.js',
    'js/src/view/*.js',
    'js/src/view/windows/*.js',
    'js/src/setup/models/*.js',
    'js/src/setup/models/includes/*.js',
    'js/src/setup/view/*.js',
    'js/src/dd_productdesigner.js',
],
        jsDest = 'js/dist',
        jsBase = 'js/src/base/*.js'
jsAdmin = [
    'js/src/core/dd_object.js',
    'js/src/core/dd_event.js',
    'js/src/core/dd_translator.js',
    'js/src/core/dd_settings.js',
    'js/src/core/dd_window.js',
    'js/src/core/dd_uibase.js',
    'js/src/core/dd_debug.js',
    'js/src/core/dd_modelbase.js',
    'js/src/core/ui/*.js',
    'js/src/admin/models/parent/*.js',
    'js/src/admin/models/*.js',
    'js/src/admin/view/*.js',
    'js/src/admin/view/groups/*.js',
    'js/src/admin/view/windows/*.js',
    'js/src/admin/dd_productdesigner_admin.js'

];

var finalFile = 'productdesigner.js';
var finalMinFile = 'productdesigner.min.js';
var finalTmpFile = 'productdesigner_tmp.js';
var finalTmpFileTwo = 'productdesigner_tmp2.js';

gulp.task('scripts', function () {
    return gulp.src(jsFiles)
            .pipe(concat(finalTmpFile))
            .pipe(wrap('(function($){"use strict"; <%= contents %>})(jQuery);', {}, {parse: false}))
            .pipe(gulp.dest(jsDest));

    cb(err);
});


gulp.task('scripts_add_admin', ['scripts'], function () {
    return gulp.src(jsAdmin)
            .pipe(concat(finalTmpFileTwo))
            .pipe(wrap('(function($){"use strict"; <%= contents %>})(jQuery);', {}, {parse: false}))
            .pipe(gulp.dest(jsDest));

    cb(err);
});

gulp.task('scripts_add', ['scripts', 'scripts_add_admin'], function () {
    return gulp.src([jsBase, jsDest + '/' + finalTmpFile, jsDest + '/' + finalTmpFileTwo])
            .pipe(concat(finalFile))
            .pipe(gulp.dest(jsDest))
            .pipe(rename(finalMinFile))
            .pipe(uglify().on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(jsDest));
});

gulp.task('default', ['scripts', 'scripts_add_admin', 'scripts_add']);

gulp.task('watch', function () {
    gulp.watch('js/src/**/*.js', ['scripts_add']);
});
