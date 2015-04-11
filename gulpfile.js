var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
	js: './src/app.js',
	watchJs : 'src/**/*.js'
};

gulp.task('scripts', function() {

	return browserify( paths.js, {
			debug: true
		})
		.transform(babelify)
		.require('./src/app.js', {entry: true})
		.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error' ))
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true, sourceRoot: '/dist'}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		// .pipe(streamify(uglify()))
		.pipe(gulp.dest('./dist'))
		.pipe(reload({stream: true}));


});

gulp.task('jshint', function() {
	return gulp.src( paths.watchJs )
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {

	browserSync({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch( paths.watchJs, ['jshint', 'scripts']);
});


gulp.task('dist', ['jshint', 'scripts']);
gulp.task('default', ['watch']);
