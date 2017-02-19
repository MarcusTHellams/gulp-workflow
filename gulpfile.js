var gulp = require('gulp'),
	server = require('gulp-webserver'),
	watch = require('gulp-watch'),
	source = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	_ = require('lodash'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-cssnano'),
	strip_debug = require('gulp-strip-debug'),
	logging = require('gulp-remove-logging'),
	sass = require('gulp-sass'),
	ruby = require('gulp-ruby-sass'),
	filesToConcat = [
		'public/libs/jquery/dist/jquery.min.js',
		'public/libs/bootstrap/dist/js/bootstrap.min.js',
		'public/libs/angular/angular.min.js',
		'public/js/main.js'
	],
	stream,
	cssFilesToConcat = [
		'public/css/main.css'
	],
	config = {
		sassPath: 'public/sass/',
		bowerDir: 'public/libs/'
};
	
gulp.task('strip', function () {
	gulp.src('public/js/main.js')
		.pipe(strip_debug())
		.pipe(gulp.dest('public/js/'));

});

gulp.task('removeLogging', function(){
	
});


gulp.task('concatAndMinify', function (done) {
	gulp.src(filesToConcat)
		.pipe(source.init())
		// .pipe(strip_debug())
		// .pipe(logging({ methods: ['log', 'info'] }))
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(source.write())
		.pipe(gulp.dest('public/dist/js/'))
		.pipe(connect.reload());

	done();

});

gulp.task('sass', function (done) {
	// gulp.src(['public/sass/**/*.scss'])
	// 	.pipe(source.init())
	// 	// .pipe(sass().on('error', sass.logError))
	// 	.pipe(ruby({
	// 		loadPath: [
	// 			config.sassPath,
	// 			config.bowerDir + 'bootstrap-sass/assets/stylesheets/'
	// 		]
	// 	}).on('error', ruby.logError))
	// 	.pipe(concat('bundle.css'))
	// 	.pipe(clean())
	// 	.pipe(source.write())
	// 	.pipe(gulp.dest('public/css/'))
	// 	.pipe(connect.reload());

	ruby(['public/sass/**/*.scss'],
		{
			sourcemap: true,
			loadPath: [
				config.sassPath,
				config.bowerDir + 'bootstrap-sass/assets/stylesheets/'
			]
		})
		.on('error', sass.logError)
		.pipe(concat('bundle.css'))
		.pipe(clean())
		.pipe(source.write())
		.pipe(gulp.dest('public/css/'))
		.pipe(connect.reload());
	done();
});

gulp.task('one', function (cb) {
	console.log('HELLO WORLD.');
	cb(null);
});

gulp.task('two', ['one'], function () {
	console.log('HELLO MOM.');
});


gulp.task('combined', ['two'], function () {
	console.log('HELLO DAD.');
});

gulp.task('server', ['watch'], function () {
	// connect.server({
	// 	root: 'public',
	// 	livereload: true
	// });

	gulp.src('public')
		.pipe(server({
			livereload: true
		}));

});

gulp.task('reload', function () {
	setTimeout(function () {
		connect.reload();
	}, 500);

})

gulp.task('watch', function () {
	// Endless stream mode 
	// gulp.watch(['public/index.html'], ['reload']);
	gulp.watch(['public/js/**/*.js'], ['concatAndMinify']);
	gulp.watch('public/sass/**/*.scss', ['sass']);
});

gulp.task('dev:server', ['sass', 'concatAndMinify', 'server']);