var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('static-public', function() {
  return gulp.src(['dist/**/*.*'])
    .pipe(gulp.dest('dist/public'))
});

gulp.task('clean-scripts', function () {
  return gulp.src(['dist/**/*.*', 'dist/assets/', '!dist/public/'])
    .pipe(clean({force: true}));
});

gulp.task('clean-root-public', ['clean-scripts'], function () {
  return gulp.src(['public/*.*', 'public/assets/'])
    .pipe(clean({force: true}));
});

gulp.task('develop-public', ['clean-root-public'], function() {
  return gulp.src(['dist/public/**/*.*'])
    .pipe(gulp.dest('public'))
});

gulp.task('default', [ 'static-public', 'clean-scripts', 'clean-root-public', 'develop-public' ]);
