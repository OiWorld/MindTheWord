import gulp from 'gulp'

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('app/scripts/**/*.js', {
  env: {
    es6: true
  }
}));

gulp.task('bundle', () => {

});
