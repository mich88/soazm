var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


var source = {
	document: "./source/*.html",
	stylesScss: "./source/scss/**/*.scss",
	stylesCss: "./source/css/",
	scripts: "./source/js/**/*.js",
	images: "./source/img/**/*.+(png|jpg|gif|svg)",
	fonts: "./source/fonts/**/*"
};

var dist = {
	styles: "./dist/css/",
	scripts: "./dist/js/",
	images: "./dist/img/",
	fonts: "./dist/fonts/"
};



var AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];



gulp.task('sass', function(){
	return gulp.src(source.stylesScss)
		.pipe(sourcemaps.init())
		.pipe(sass({
			precision: 10,
			onError: console.error.bind(console, 'SASS error:')
		}))
		.pipe(autoprefixer({
			browsers: AUTOPREFIXER_BROWSERS
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(source.stylesCss))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function(){
	browserSync.init({
		notify: false,
	    logPrefix: '⎋',
		server: {
			baseDir: './source/'
		}
	})
});

gulp.task('useref', function(){
	return gulp.src(source.document)
		.pipe(useref())
		.pipe(gulpIf('*.js', babel({presets: ['es2015']})))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('./dist'))
});

gulp.task('images', function(){
	return gulp.src(source.images)
		.pipe(cache(imagemin({
      		optimizationLevel: 3,
		    progressive: true,
    		interlaced: true
    	})))
		.pipe(gulp.dest(dist.images))
});

gulp.task('fonts', function(){
	return gulp.src(source.fonts)
		.pipe(gulp.dest(dist.fonts))
});

gulp.task('clean:dist', function(){
	return del.sync('./dist')
});

gulp.task('cache:clear', function(callback){
	return cache.clearAll(callback)
});



gulp.task('build', function(callback){
	runSequence(
		'clean:dist',
		'sass', 
		['useref', 'images', 'fonts'],
		callback
	)
});

gulp.task('default', function(callback){
	runSequence(
		['sass', 'browserSync', 'watch'],
		callback
	)
});



gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch(source.stylesScss, ['sass']);
	gulp.watch(source.document, browserSync.reload);
	gulp.watch(source.scripts, browserSync.reload);
});