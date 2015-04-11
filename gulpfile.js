var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var watch;

var paths = {
	js: './src/app.js',
	watchJs : 'src/**/*.js'
};

function browserifyShare() {
	var b = browserify( paths.js, {
		debug: true,
		cache: {},
		packageCache: {},
		fullPaths: true
	});

	b.transform(babelify)
		.require('./src/app.js', {entry: true})

	if (watch) {
		b = watchify(b);

		b.on('update', function() {
			bundleShare(b);	
		});
	}
	
	b.on('log', gutil.log);

	return bundleShare(b);
}

function bundleShare(b) {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error' ))
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true, sourceRoot: '/dist'}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'))
		.pipe(gulpif(watch, reload({stream:true})));
}

gulp.task('scripts', function() {

	watch = false;
	return browserifyShare();

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

	watch = true;
	browserifyShare();
	
	gulp.watch( paths.watchJs, ['jshint']);
});


gulp.task('dist', ['jshint', 'scripts']);
gulp.task('default', ['watch']);
