// To use:
// npm install vinovate
// run 'mv node_modules/vinovate/*.js node_modules/vinovate/*.json ./ && npm install'
// fill out the config.js file wit the appropriate properties
// to specify an alternate config file (i.e. a config file for challenger B)
//     - gulp --config configB.js
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minCss = require('gulp-clean-css');
var argv = require('yargs').argv;
var config = argv.config ? require('./' + argv.config) : require('./config');
var fs = require('fs');
var prependFile = require('prepend-file');
var del = require('del');

var jsFile = config.jsFile ? config.jsFile.split('.js')[0] + '.min.js' : false;
var cssFile = config.cssFile ? config.cssFile.split('.css')[0] + '.min.css' : false;

gulp.task('minifyCSS', function() {
  if (cssFile) {
    return gulp.src(config.cssFile)
      .pipe(rename({suffix: '.min'}))
      .pipe(gulpIf(!config.verbose, minCss()))
      .pipe(gulp.dest('./')).on('end', function() {
        prependFile.sync(cssFile, '<style>');
        fs.appendFileSync(cssFile, '</style>');
      });
  }
});

gulp.task('minifyJS', function() {
  if (jsFile) {
    return gulp.src(config.jsFile)
      .pipe(gulpIf(config.babel, babel({
        presets: ['es2015']
      })))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulpIf(!config.verbose, uglify()))
      .pipe(gulp.dest('./')).on('end', function() {
        prependFile.sync(jsFile, '<script>');
        fs.appendFileSync(jsFile, '</script>');
      })
  }
});

gulp.task('concat', ['minifyCSS', 'minifyJS'], function() {
  return gulp.src('./*.min.*')
  .pipe(concat(config.challenger))
  .pipe(gulp.dest('./')).on('end', function() {
    if (!config.preserveMinFiles) { del('*.min.*'); }
  });
});

gulp.task('watch', function() {
  gulp.watch(config.cssFile, ['concat']);
  gulp.watch(config.jsFile, ['concat']);
});

gulp.task('default', ['watch']);
