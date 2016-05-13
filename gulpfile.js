var gulp = require('gulp'),
  del = require('del'),
  jspm = require('gulp-jspm'),
  rename = require('gulp-rename');

gulp.task('default', function(){
  console.log('Please use the following gulp tasks: watch, clean, bundle, build');
});

gulp.task('clean', function(){
  return del('./dist', {force:true});
});

gulp.task('bundle-options', function(){
  gulp.src('./lib/scripts/controllers/options.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('options.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('bundle-popup', function(){
  gulp.src('./lib/scripts/controllers/popup.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('popup.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('bundle-event', function(){
  gulp.src('./lib/scripts/eventPage.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('eventPage.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('bundle-content', function(){
  gulp.src('./lib/scripts/mtw.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('mtw.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('lint', function(){

});

gulp.task('watch', function(){
  gulp.watch('./lib/scripts/controllers/options.js', ['bundle-options']);
  gulp.watch('./lib/scripts/controllers/popup.js', ['bundle-popup']);
  gulp.watch('./lib/scripts/mtw.js', ['bundle-content']);
  gulp.watch('./lib/scripts/eventPage.js', ['bundle-event']);
});

gulp.task('build', function () {
  // clean, bundle, copy
});
