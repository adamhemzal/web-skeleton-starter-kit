// Gulp.js configuration

/****************	 WHAT TO INSTALL 	*********************************************************************
• gulp --> npm install gulp --save-dev //you need basic gulp
• del --> npm install del --save-dev // deletes files
• browser-sync --> npm install browser-sync --save-dev
• babel --> npm install gulp-babel @babel/core @babel/preset-env --save-dev
• sass --> npm install gulp-sass node-sass --save-dev
• sourcemaps --> npm install gulp-sourcemaps --save-dev
• gulp-rename --> npm install gulp-rename --save-dev
• gulp-size --> npm install gulp-size --save-dev
• gulp-imagemin --> npm install gulp-imagemin --save-dev  // compromise images
• gulp-uglify --> npm install gulp-uglify --save-dev
• gulp-newer --> npm install gulp-newer --save-dev // loads only new files
• gulp-cleanhtml --> npm install gulp-cleanhtml --save-dev
• gulp-wait2 --> npm install gulp-wait2 --save-dev
• gulp-purgecss --> npm install gulp-purgecss --save-dev
• panini --> npm install panini --save-dev
• post-css --> npm install postcss --save-dev
• gulp-jsonminify -> npm install gulp-jsonminify --save-dev
• gulp-post-css --> npm install gulp-postcss --save-dev
    • postcss-preset-env --> npm install postcss-preset-env --save-dev
    • autoprefixer --> npm install autoprefixer --save-dev
    • cssnano -->  npm install cssnano --save-dev
    • cssnano advanced --> npm install cssnano-preset-advanced --save-dev
    // stylelint --> npm install stylelint --save-dev NOT INCLUDED YET

npm install --save-dev gulp del postcss browser-sync gulp-babel @babel/core @babel/preset-env gulp-sass gulp-sourcemaps node-sass gulp-rename gulp-size gulp-imagemin gulp-uglify gulp-newer gulp-cleanhtml gulp-wait2 gulp-postcss postcss-preset-env cssnano cssnano-preset-advanced autoprefixer panini gulp-purgecss gulp-jsonminify
yarn add --dev gulp del postcss browser-sync gulp-babel @babel/core @babel/preset-env gulp-sass gulp-sourcemaps node-sass gulp-rename gulp-size gulp-imagemin gulp-uglify gulp-newer gulp-cleanhtml gulp-wait2 gulp-postcss postcss-preset-env cssnano cssnano-preset-advanced autoprefixer panini gulp-purgecss gulp-jsonminify
********************************************************************************************************/

// load gulp and other plugins
const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const gulpsass = require('gulp-sass')(require('node-sass'));
const rename = require('gulp-rename');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const newer = require('gulp-newer');
const htmlclean = require('gulp-cleanhtml');
const wait = require('gulp-wait2');
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const panini = require('panini');
const purgecss = require('gulp-purgecss');
const jsonminify = require('gulp-jsonminify');
//const stylelint = require('stylelint');

//******************************
// CHANGE THIS ↓
//******************************
const development = 'dev/';
const build = 'build/';
//******************************


// define in --> original folder | out - output folder
const images = {
	in: development + 'img/**/*', // select all images in folder /img/ and it's subfolders
	out: build + 'img/'
};

const humans = {
    in: development + 'humans/*',
    out: build
}

const html = {
    in: development + 'html/pages/**/*.html',
    root: development + 'html/pages/',
    partials: development + 'html/partials/',
    layouts: development + 'html/layouts/',
    helpers: development + 'html/helpers/',
    data: development + 'html/data/',
    watch: development + 'html/{layouts,partials,pages,helpers,data}/**/*',
    out: build
};

const css = {
    in: development + 'css/**/*',
    out: build + 'css/'
};

const fonts = {
    in: development + 'fonts/**/*',
    out: build + 'css/fonts/'
};

const js = {
    in: development + 'js/**/*',
    out: build + 'js/'
};

const sass = {
    in: [development + 'sass/style.scss', development + 'sass/fonts.scss'],
    watch: [development + 'sass/**/*'],
    out: build + 'css/',
    sassOptions: {
        outputStyle: 'nested', // nested(stay readable), expanded, compact, compresed(minified)
        //imagePath: '../img/', //setup a path to images, you don't have to write /img in you sass
        precision: 2, //calculating - eg. select 2 ---> then 15.00
        includePaths: ['dev/sass'],
        //onError: browserSync.notify,
        //sourceMap: true,
    }
};

const syncOptions = {
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

function minifyImages(cb) {
    src(images.in)
    .pipe(newer(images.out))
    .pipe(size({ title: 'Image size BEFORE'}))
    .pipe(imagemin())
    .pipe(size({ title: 'Image size AFTER'}))
	.pipe(dest(images.out)); // copy from in folder to out folder
    cb();
}

//******************************
//	CSS
//******************************
function compileCss(cb) {
    
    const processes = [
        postcssPresetEnv(),
        autoprefixer(),
        cssnano({
            preset: ['advanced', {
                // preset options here, e.g...
                discardComments: { removeAll: true }
            }]
        }),
    ];

    src(css.in)
    .pipe(newer(css.out))
    .pipe(size({ title: 'CSS BEFORE'}))
    .pipe(postcss(processes))
    .pipe(purgecss({
        content: ['dev/html/**/*']
    }))
    .pipe(size({ title: 'CSS AFTER'}))
    .pipe(dest(css.out));

    cb();
}

//******************************
//	FONTS
//******************************

function copyFonts(cb) {
    src(fonts.in)
    .pipe(newer(fonts.out))
    .pipe(dest(fonts.out));
    cb();
}

//******************************
//	HUMANS
//******************************

function copyHumans(cb) {
    src(humans.in)
    .pipe(newer(humans.out))
    .pipe(dest(humans.out));
    cb();
}

//******************************
//	JS
//******************************

function compileJs(cb) {
    src(js.in)
    .pipe(newer(js.out))
    .pipe(size({ title: 'JS BEFORE'}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'JS AFTER'}))
    .pipe(dest(js.out));
    cb();
}

//******************************
//	SASS
//******************************

function compileSass(cb) {
    const processes = [
        postcssPresetEnv(),
        autoprefixer(),
        cssnano({
            preset: ['advanced', {
                // preset options here, e.g...
                discardComments: { removeAll: true }
            }]
        })  //sass can do it for you, but for me cssnano has better compiler than sass
    ];
    src(sass.in)
    .pipe(wait(300)) // this code ensures that gulp will work in VSCode
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(gulpsass(sass.sassOptions).on('error', gulpsass.logError))
    .pipe(size({ title: 'SASS BEFORE'}))
    .pipe(postcss(processes))
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'SASS AFTER'}))
    .pipe(purgecss({
        content: ['dev/html/**/*']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(sass.out))
    .pipe(browserSync.reload({ stream: true })); 
    cb();
}

//******************************
//	BROWSERSYNC SERVE
//******************************

// gulp serve
function serve(cb) {
    browserSync(syncOptions);
    cb();
}

//******************************
//	HTML
//******************************

// gulp compileHtml
function compileHtml(cb) {
    panini.refresh();
    src(html.in)
    .pipe(panini({
        root: html.root,
        layouts: html.layouts,
        partials: html.partials,
        helpers: html.helpers,
        data: html.data
    }))
    .pipe(htmlclean())
    .pipe(dest(html.out));
    cb();
}

//******************************
//	CLEAN BUILD
//******************************

// gulp clean
function clean(cb) {
    del([
		build + '*' // delete all files in build folder
	]);
    cb();
}

//******************************
// WATCH TASK
//******************************

// gulp watch
function watcher(cb) {
    
    //images
    watch(images.in).on('change', series(minifyImages, browserSync.reload));

    //html
    watch(html.watch).on('change', series(compileHtml, browserSync.reload));

    //sass
    watch(sass.watch).on('change', series(compileSass, browserSync.reload));

    //css
    watch(css.in).on('change', series(compileCss, browserSync.reload));

    //fonts
    watch(fonts.in).on('change', series(copyFonts, browserSync.reload));

    //js
    watch(js.in).on('change', series(compileJs, browserSync.reload));

    //human
    watch(humans.in).on('change', series(copyHumans, browserSync.reload));

    cb();
}

//******************************
// DEFAULT TASK
//******************************

// gulp
exports.clean = clean;
exports.default = series(parallel(minifyImages, compileHtml, compileJs, compileSass, copyFonts, compileCss, copyHumans), serve, watcher);