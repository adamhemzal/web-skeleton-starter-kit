// Gulp.js configuration


/****************	 WHAT TO INSTALL 	*********************************************************************
1) gulp-imagemin -> npm install gulp-imagemin --save-dev  // komprimuje obrazkove soubory
2) gulp-newer -> npm install gulp-newer --save-dev // nahrává pouze nové obrázky
3) del -> npm install del --save-dev // umožňuje mazat soubory
4) browser-sync -> npm install browser-sync --save-dev
5) post-css -> npm install gulp-postcss --save-dev
	5.1) autoprefixer -> npm install autoprefixer --save-dev
    5.2) cssnano ->  npm install cssnano --save-dev
6) gulp-cleanhtml -> npm install gulp-cleanhtml --save-dev
7) gulp-size -> npm install gulp-size --save-dev
8) gulp-uglify -> npm install gulp-uglify --save-dev
9) gulp-rename -> npm install gulp-rename --save-dev
10) gulp-sass -> npm install gulp-sass --save-dev
11) gulp-wait -> npm install gulp-wait
12) panini -> npm install panini --save-dev
13) gulp-purgecss -> npm install gulp-purgecss --save-dev

npm install gulp gulp-imagemin gulp-newer del browser-sync gulp-postcss autoprefixer cssnano gulp-cleanhtml gulp-size gulp-uglify gulp-rename gulp-sass gulp-wait panini gulp-purgecss --save-dev

********************************************************************************************************/

// include gulp and plugins
var gulp = require('gulp'),

	imagemin = require('gulp-imagemin'), // load gulp-imagemin plugin
	newer = require('gulp-newer'),
    uglify = require('gulp-uglify'),
	del = require('del'),
    size = require('gulp-size'),
	htmlclean = require('gulp-cleanhtml'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
	rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    wait = require('gulp-wait'),
    panpanini = require('panini'),
    gulpsass = require('gulp-sass');
    purgecss = require("gulp-purgecss");


// file locations
var development,
    build,
    images,
    html,
    js,
    php,
    css,
    fonts,
    sass;

//******************************
// CHANGE THIS ↓
//******************************
	development = 'dev/';
	build = 'build/';
//******************************

// define in --> original folder | out - output folder
images = {
	in: development + 'img/**/*', // select all images in folder /img/ and it's subfolders
	out: build + 'img/'
};

html = {
    in: development + 'html/pages/**/*.html',
    root: development + 'html/pages/',
    partials: development + 'html/partials/',
    layouts: development + 'html/layouts/',
    helpers: development + 'html/helpers/',
    data: development + 'html/data/',
    watch: development + 'html/{layouts,partials,helpers,data}/**/*',
    out: build
};

php = {
		in:  development + 'libraries/**/*',
		out: build + 'libraries/'
};

js = {
    in: development + 'js/**/*',
    out: build + 'js/'
};

sass = {
    in: development + 'sass/style.scss',
    watch: [development + 'sass/**/*'],
    out: build + 'css/',
    sassOptions: {
        outputStyle: 'nested', // nested(stay readable) or compresed(minified)
        //imagePath: '../img/', //setup a path to images, you don't have to write /img in you sass
        precision: 2, //calculating - eg. select 2 ---> then 15.00
        includePaths: ['dev/sass'],
        //onError: browserSync.notify,
        errLogToConsole: true
    }
};

css = {
    in: development + 'css/**/*',
    out: build + 'css/'
};

fonts = {
    in: development + 'fonts/**/*',
    out: build + 'css/fonts/'
};

syncOptions = {
    server: {
        baseDir: build,
        //directory: true, // Serve files from the app directory with directory listing
        index: 'index.html'
    },
    notify: true
}

//******************************
//	OPTIMIZE IMAGES
//******************************
gulp.task('minifyImages', function(){
    return gulp.src(images.in)
	.pipe(newer(images.out)) // does image exist?
    .pipe(size({ title: 'Image size BEFORE'}))
	.pipe(imagemin())
    .pipe(size({ title: 'Image size AFTER'}))
	.pipe(gulp.dest(images.out)); // copy from in folder to out folder

});

//******************************
//	CSS - Normalize
//******************************
gulp.task('copyCss', function(){

    var processes = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];

    return gulp.src(css.in)
        .pipe(newer(css.out))
        .pipe(size({ title: 'CSS BEFORE'}))
        .pipe(postcss(processes))
        .pipe(size({ title: 'CSS AFTER'}))
        .pipe(gulp.dest(css.out));
});

//******************************
//	FONTS
//******************************
gulp.task('copyFonts', function(){
    return gulp.src(fonts.in)
        .pipe(newer(fonts.out))
        .pipe(gulp.dest(fonts.out));
    
});

//******************************
//	MINIFY JS
//******************************
gulp.task('minifyJs', function() {
  return gulp.src(js.in)
    .pipe(newer(js.out))
    .pipe(size({ title: 'JS BEFORE'}))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'JS AFTER'}))
    .pipe(gulp.dest(js.out));

});

//******************************
//	PHP Libraries
//******************************
/*
gulp.task("copyPhp", function() {
    return gulp.src(php.in)
    .pipe(newer(php.out))
    .pipe(gulp.dest(php.out));
});
*/


//******************************
//	SASS
//******************************
gulp.task("compileSass", function(){
    var processes = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()  //sass can do it for you, but for me cssnano has better compiler than sass
    ];

    return gulp.src(sass.in)
    .pipe(wait(300)) // this code ensures that gulp will work in VSCode
    .pipe(gulpsass(sass.sassOptions))
    .pipe(size({ title: 'SASS BEFORE'}))
    .pipe(purgecss({
        content: [html.in]
    }))
    .pipe(postcss(processes))
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'SASS AFTER'}))
    .pipe(gulp.dest(sass.out))
    .pipe(browserSync.reload({ stream: true })); 


});

//******************************
//	BROWSERSYNC SERVE
//******************************
gulp.task("serve", function(){
    browserSync(syncOptions);
});

//******************************
//	PANINI
//******************************

gulp.task('compileHtml', function() {
    panpanini.refresh();
    return gulp.src(html.in)
      .pipe(panpanini({
        root: html.root,
        layouts: html.layouts,
        partials: html.partials,
        helpers: html.helpers,
        data: html.data
      }))
      //.pipe(htmlclean()) -- for minifing html
      .pipe(gulp.dest(html.out))
  });

//******************************
//	CLEAN BUILD
//******************************
gulp.task('clean', function() {
	del([
		build + '*' // delete all files in build folder
	]);
});

//******************************
// DEFAULT TASK
//******************************

gulp.task('default', ['minifyImages', 'compileHtml', 'minifyJs', 'compileSass', 'copyFonts', 'copyCss', 'serve'], function() {

    //watch images
    gulp.watch(images.in, ['minifyImages', browserSync.reload]);

    //watch changes in html
    gulp.watch(html.in, ['compileHtml', browserSync.reload]);
    gulp.watch([html.watch], ['compileHtml', browserSync.reload]);

    //watch sass
    gulp.watch(sass.watch, ['compileSass']);

    //watch fonty
    gulp.watch(fonts.in, ['copyFonts', browserSync.reload]);

    //watch js
    gulp.watch(js.in, ['minifyJs', browserSync.reload]);

    //watch php
    //gulp.watch(php.in, ['copyPhp']);

    //watch css
    gulp.watch(css.in, ['copyCss', browserSync.reload]);

});