var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean', function() {
  return del(['dist/**']);
});

gulp.task('coffee', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
   return gulp.src('./dist/*.js')
      .pipe(uglify())
      .pipe(concat('owl-metatags.min.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function () {
  return runSequence(
    'clean',
    'coffee',
    'minify'
  );
});
