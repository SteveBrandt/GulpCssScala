var gulp = require('gulp'),
    rename = require('gulp-rename'),
    cssScala = require('../index.js');

gulp.task('default', function(){
    gulp.src('foo.css').
    pipe(cssScala('Css')).
    pipe(rename('Css.scala')).
    pipe(gulp.dest('dest'));
});