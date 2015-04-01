var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');

gulp.task('scripts', function() {

	return browserify('./src/app.js')
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./dist'));

});

gulp.task('jshint', function() {
	return gulp.src('./src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.js', ['jshint', 'scripts']);
});


gulp.task('dist', ['jshint', 'scripts']);
gulp.task('default', ['watch']);