var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('static-public', function(){
  return gulp.src(['dist/**/*.*'])
    .pipe(gulp.dest('dist/public'))
});

gulp.task('clean-scripts', function () {
  return gulp.src(['dist/**/*.*', 'dist/assets/', '!dist/public/'])
    .pipe(clean({force: true}));
});

gulp.task('default', [ 'static-public', 'clean-scripts' ]);
