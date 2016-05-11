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

gulp.task('bundle', function(){
  gulp.src('./lib/scripts/app.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('mtw.js'))
    .pipe(gulp.dest('./lib'));
  gulp.src('./lib/scripts/background.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(rename('eventPage.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('lint', function(){

});

gulp.task('watch', function(){
  // add lint
  gulp.watch('./lib/scripts/**/*.js', ['bundle']);
});

gulp.task('build', function () {
  // clean, bundle, copy
});
