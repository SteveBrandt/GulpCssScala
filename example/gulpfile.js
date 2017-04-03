var gulp = require('gulp'),
    rename = require('gulp-rename'),
    cssScala = require('gulp-css-scala');

var options = {
    objectName:'Css',
    packageName:'com.example.css'
};

gulp.task('default', function() {
    return gulp.src(['foo.css', 'additional-style-class-selectors.txt']).
    pipe(cssScala(options)).
    pipe(rename('Css.scala')).
    pipe(gulp.dest('dest'));
});