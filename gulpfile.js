var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    ngConstant = require('gulp-ng-constant'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    del = require('del'),
    runSequence = require('run-sequence');

// gulp.task('local', ['local-globalvars', 'bundle']);
gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('clean-index', function() {
    return del(['views/index.jade']);
});

gulp.task('local-globalvars', function() {
  var stream = gulp.src('globalvars.json')
    .pipe(ngConstant({
      name: 'angular-client-side-auth',
      deps: false
    }))
    // Writes config.js to dist/ folder 
    .pipe(gulp.dest('client/js/constants'));
  return stream;
});

gulp.task('dev-globalvars', function () {
  var stream = gulp.src('globalvars.json')
    .pipe(ngConstant({
      name: 'angular-client-side-auth',
      constants: { baseUrl: 'http://dev.apartmate.ca' },
      deps: false
    }))
    // Writes config.js to dist/ folder 
    .pipe(gulp.dest('client/js/constants'));
  return stream;
});

gulp.task('pro-globalvars', function () {
  var stream = gulp.src('globalvars.json')
    .pipe(ngConstant({
      name: 'angular-client-side-auth',
      constants: { baseUrl: 'http://www.apartmate.ca' },
      deps: false
    }))
    // Writes config.js to dist/ folder 
    .pipe(gulp.dest('client/js/constants'));
  return stream;
});

var vendorCSS = [
  'client/css/lib/angular-slider.css',
  'client/css/lib/app.css',
  'client/css/lib/bootstrap.css',
  'client/css/lib/slider.css',
  'client/components/leaflet/dist/leaflet.css',
  'client/components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
];

gulp.task('vendor-css', function(){
    var stream = gulp.src(vendorCSS)
        .pipe(concat('vendor.css'))
        .pipe(uglifycss({'uglyComments': true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('client/build/css'));
    return stream;
});

gulp.task('app-css', function(){
    var stream = gulp.src(['client/css/profile.css', 'client/css/apartmate-theme.css', 'client/css/apartmate-tablet.css', 'client/css/apartmate-mobile.css', 'client/css/build.css' ])
        .pipe(concat('app.css'))
        .pipe(uglifycss({'uglyComments': true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('client/build/css'));
    return stream;
});

var vendorJS = [
  'client/components/angular/angular.min.js',
  'client/components/angular-cookies/angular-cookies.min.js',
  'client/components/jquery/dist/jquery.min.js',
  'client/components/angular-ui-router/release/angular-ui-router.min.js',
  'client/components/angular-sanitize/angular-sanitize.min.js',
  'client/components/bootstrap/dist/js/bootstrap.min.js',
  'client/components/leaflet/dist/leaflet.js',
  'client/components/leaflet.markercluster/dist/leaflet.markercluster.js',
  'client/components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
  'client/components/angular-wurfl-image-tailor/src/angular-wurfl-image-tailor.js',
  'client/components/moment/min/moment.min.js',
  'client/components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
  'client/js/lib/**/*.js'
];

gulp.task('vendor-js', function(){
    var stream = gulp.src(vendorJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('client/build/js'));
    return stream;
});

gulp.task('app-js', function(){
    var stream = gulp.src(['client/js/routingConfig.js', 'client/js/app.js', 'client/js/constants/*.js', 'client/js/controllers/*.js', 'client/js/services/*.js', 'client/js/directives/*.js', 'client/js/filters/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('client/build/js'));
    return stream;
});

gulp.task('inject', function(){
    var stream = gulp.src('client/src/index.jade')
        .pipe(inject(es.merge(
            gulp.src(vendorCSS, {read: false}),
            gulp.src(vendorJS, {read: false})
        ), {name: 'vendor', ignorePath: 'client', addRootSlash: true}))
        .pipe(inject(es.merge(
            gulp.src(['client/css/profile.css', 'client/css/apartmate-theme.css', 'client/css/apartmate-tablet.css', 'client/css/apartmate-mobile.css', 'client/css/build.css' ], {read: false}),
            gulp.src(['client/js/routingConfig.js', 'client/js/app.js', 'client/js/constants/*.js', 'client/js/services/*.js', 'client/js/controllers/*.js',  'client/js/filters/*.js', 'client/js/directives/*.js'], {read: false})
        ), {ignorePath: 'client', addRootSlash: true}))
        .pipe(gulp.dest('client/views'));
    return stream;
});

gulp.task('inject-bundled', function(){
    var stream = gulp.src('client/src/index.jade')
        .pipe(inject(gulp.src(['client/build/css/vendor.min.css', 'client/build/js/vendor.min.js'], {read: false}), {name: 'vendor', ignorePath: 'client', addRootSlash: true}))
        .pipe(inject(gulp.src(['client/build/css/app.min.css', 'client/build/js/app.min.js'], {read: false}), {ignorePath: 'client', addRootSlash: true}))
        .pipe(gulp.dest('client/views'));
    return stream;
});

gulp.task('watch', function(){
    gulp.watch(['client/js/**/*.js', 'client/src/index.jade', 'gulpfile.js'], ['inject']);
});

gulp.task('bundle', ['vendor-css', 'app-css', 'vendor-js', 'app-js']);

gulp.task('local', function() { runSequence('clean', 'clean-index', 'local-globalvars', 'inject', 'watch'); });
gulp.task('dev', function() { runSequence('clean', 'dev-globalvars', 'bundle', 'inject-bundled'); });
gulp.task('pro', function() { runSequence('clean', 'pro-globalvars', 'bundle', 'inject-bundled'); });

gulp.task('default', function() { runSequence('clean', 'clean-index', 'local-globalvars', 'inject'); });


