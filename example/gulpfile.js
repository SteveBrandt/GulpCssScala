var gulp = require('gulp'),
    rename = require('gulp-rename'),
    cssScala = require('../index.js');

var options = {
    className:'Css',
    packageName:'com.example.css'
};

gulp.task('default', function() {
    gulp.src('foo.css').
    pipe(cssScala(options)).
    pipe(rename('Css.scala')).
    pipe(gulp.dest('dest'));
});