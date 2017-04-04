var gulp = require('gulp'),
    rename = require('gulp-rename'),
    cssScala = require('gulp-css-scala');

gulp.task('simple', function() {
    return gulp.src('styles/foo.css').
        pipe(cssScala()).
        pipe(rename('Css.scala')).
        pipe(gulp.dest('dest'));
});

gulp.task('advanced', function() {
    return gulp.src(['styles/*.css', 'additional-style-class-selectors.txt']).
        pipe(cssScala({objectName:'CssAdvanced', packageName:'com.example.css'})).
        pipe(rename('CssAdvanced.scala')).
        pipe(gulp.dest('dest'));
});

gulp.task('default', ['simple', 'advanced']);