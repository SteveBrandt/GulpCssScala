var gulp = require('gulp'),
    cssScala = require('../index.js');

gulp.task('default', function(){
    gulp.src('foo.js').
    pipe(cssScala('uppercase')).
    pipe(gulp.dest('dest'));
});