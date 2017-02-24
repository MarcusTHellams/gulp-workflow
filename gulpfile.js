var gulp = require('gulp'),
	server = require('gulp-webserver'),
	watch = require('gulp-watch'),
	source = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	_ = require('lodash'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean-css'),
	strip_debug = require('gulp-strip-debug'),
	logging = require('gulp-remove-logging'),
	sass = require('gulp-sass'),
	ruby = require('gulp-ruby-sass'),
	replace = require('gulp-string-replace'),
	replace2 = require('gulp-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	concat2 = require('gulp-concat-sourcemap'),
	merge = require('gulp-merge'),
	gulpif = require('gulp-if'),
	minimist = require('minimist'),
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


var knownOptions = [{
	string: 'env',
	default: { env: process.env.NODE_ENV || 'production' }
}];


var options = minimist(process.argv.slice(2), knownOptions);


gulp.task('strip', function () {
	gulp.src('public/js/main.js')
		.pipe(strip_debug())
		.pipe(gulp.dest('public/js/'));

});

var g = gulp.task('replace', function () {

	return gulp.src('public/dist/js/**/*.js')
		.pipe(replace(/console\.log\(.+?\)/g, 'void 0'))
		.pipe(gulp.dest('public/dist/js/'));
});


gulp.task('concatAndMinify', function (done) {
	console.log(options);
	merge(
		gulp.src(filesToConcat)
			.pipe(gulpif(options.env === 'production', replace(/console\.log\(.+?\)/g, 'void 0')))
	)
		.pipe(source.init())
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(source.write())
		.pipe(gulp.dest('public/dist/js/'));


	// gulp.src(filesToConcat)
	// 	.pipe(source.init())
	// 	// .pipe(strip_debug())
	// 	.pipe(logging({
	// 		replaceWith: '0;'
	// 	}))
	// 	.pipe(concat('bundle.js'))
	// 	.pipe(uglify({
	// 		conpress: {
	// 			global_defs: {
	// 				"DEBUG": false
	// 			}

	// 		}
	// 	}))
	// 	.pipe(source.write())
	// 	.pipe(gulp.dest('public/dist/js/'));

	// gulp.start('replace');

	done();

});

gulp.task('sass', function (done) {
	// gulp.src(['public/sass/**/*.scss'])
	// 	.pipe(sass({
	// 		includePaths: [
	// 			config.sassPath + '**/*.scss',
	// 			config.bowerDir + 'bootstrap-sass/assets/stylesheets/'
	// 		]
	// 	}).on('error', sass.logError))
	// 	// .pipe(ruby({
	// 	// 	loadPath: [
	// 	// 		config.sassPath,
	// 	// 		config.bowerDir + 'bootstrap-sass/assets/stylesheets/'
	// 	// 	]
	// 	// }).on('error', ruby.logError))
	// 	.pipe(concat2('bundle.css'))
	// 	// .pipe(clean())
	// 	.pipe(gulp.dest('public/css/'));
	// // 	.pipe(connect.reload());

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

});

gulp.task('watch', function () {
	// Endless stream mode 
	// gulp.watch(['public/index.html'], ['reload']);
	gulp.watch(['public/js/**/*.js'], ['concatAndMinify']);
	gulp.watch('public/sass/**/*.scss', ['sass']);
});

gulp.task('dev:server', ['sass', 'concatAndMinify', 'server']);