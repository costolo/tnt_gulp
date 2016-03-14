// To use:
// npm install
// gulp --js yourJSFile.js --css yourCSSFile.css --challenger yourChallengerFileName.html
// a single js or css file can be watched, pass only that file as an argument

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minCss = require('gulp-clean-css');
var argv = require('yargs').argv;
var fs = require('fs');
var prependFile = require('prepend-file');
var del = require('del');
var jsFile = argv.js ? argv.js.split('.js')[0] + '.min.js' : false;
var cssFile = argv.css ? argv.css.split('.css')[0] + '.min.css' : false;

gulp.task('minifyCSS', function() {
  if (cssFile) {
    return gulp.src(argv.css)
      .pipe(rename({suffix: '.min'}))
      .pipe(minCss())
      .pipe(gulp.dest('./')).on('end', function() {
        prependFile.sync(cssFile, '<style>');
        fs.appendFileSync(cssFile, '</style>');
      });
  }
});

gulp.task('minifyJS', function() {
  if (jsFile) {
    return gulp.src(argv.js)
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./')).on('end', function() {
        prependFile.sync(jsFile, '<script>');
        fs.appendFileSync(jsFile, '</script>');
      })
  }
});

gulp.task('concat', ['minifyCSS', 'minifyJS'], function() {
  return gulp.src('./*.min.*')
  .pipe(concat(argv.challenger))
  .pipe(gulp.dest('./')).on('end', function() {
    del('*.min.*');
  });
});

gulp.task('watch', function() {
  gulp.watch(argv.css, ['concat']);
  gulp.watch(argv.js, ['concat']);
});

gulp.task('default', ['watch']);
