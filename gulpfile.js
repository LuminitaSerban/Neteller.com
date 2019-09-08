// requiring all dependencies
const gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    debug = require('gulp-debug'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    del = require('del'), //for clean
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'), //(prevent gulp from exit)
    include = require('gulp-include'), //include
    nunjucks = require('gulp-nunjucks-render'), //nunjucks
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    sassModuleImporter = require('sass-module-importer'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'), //minifier
    sourceMaps = require('gulp-sourcemaps'),
    uglifyJs = require('gulp-uglify'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    spritesmith = require("gulp.spritesmith"),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    ngrok = require('ngrok');

require('dotenv').config(); // need for access to process.env
const isProd = process.env.NODE_ENV === 'production';

// make a constant with all the paths
const paths = {
    dev: {
        html: 'dev/',
        js: 'dev/js/',
        css: 'dev/css/',
        img: 'dev/img/',
        fonts: 'dev/fonts/',
        php: 'dev/',
        favicon: 'dev/',
        video: 'dev/video/'
    },
    prod: {
        html: 'prod/',
        js: 'prod/js/',
        css: 'prod/css/',
        img: 'prod/img/',
        fonts: 'prod/fonts/',
        php: 'prod/',
        favicon: 'prod/',
        video: 'prod/video/'
    },
    src: {
        srcFolder: 'src/',
        html: 'src/*.{njk,html}', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        //jsFiles: ['src/js/*.js', '!src/js/main.js'], //для форматирования (пока не используется)
        //jsFolder: 'src/js/', //для форматирования (пока не используется)
        styles: 'src/styles/main.scss',
        stylesPartialsFolder: 'src/styles/partials/', //for sprite
        img: ['src/img/**/*.*', '!src/img/icons/*.*'], //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        imgFolder: 'src/img/', //for sprite
        icons: 'src/img/icons/*.*',
        svgIcons: 'src/img/svg-icons/**/*.svg',
        fonts: 'src/fonts/**/*.*',
        //fontsFolder: 'src/fonts/',
        php: 'src/**/*.php',
        favicon: 'src/favicon.{png,ico}',
        video: 'src/video/**/*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: ['src/*.{njk,html}', 'src/templates/*.{njk,html}'], //нельзя указывать 'src/**/*.html', увеличивается время выполнения тасков в watch-e. хз почему.
        js: 'src/js/**/*.js',
        styles: 'src/styles/**/*.{css,scss}',
        img: 'src/img/**/*.*',
        icons: 'src/img/icons/*.*',
        svgIcons: 'src/img/svg-icons/**/*.svg',
        fonts: 'src/fonts/**/*',
        php: 'src/*.php', // опять же нельзя указывать 'src/**/*.php'
        favicon: 'src/favicon.{png,ico}',
        video: 'src/video/**/*'
    }
};

// browserSync config
const browserSyncConfig = {
    server: {
        baseDir: "./dev"
    },
    //tunnel: true,
    host: 'localhost',
    port: 2626,
    logPrefix: "MSerj",
    notify: false
};

// plumber options for catch errors
const plumberOptions = {
    handleError: function(err) {
        console.log(err);
        this.emit('end');
    }
};

// autoprefixer options
const autoprefixerOptions = {
    browsers: ['last 2 version', "ie 10", 'android 4'],
    cascade: false
};

/**************************Общие таски***************************/
// Task for browserSync
gulp.task('browserSync', function() {
    browserSync(browserSyncConfig);
    // browserSync(browserSyncConfig, function (err, bs) {
    // 	ngrok.connect({
    // 		proto: 'http', // http|tcp|tls
    // 		addr: bs.options.get('port'), // port or network address
    // 	}, function (err, url) {
    // 		gutil.log('[ngrok]', ' => ', gutil.colors.magenta.underline(url));
    // 	});
    // });
});

// Task for img-sprite
gulp.task('sprite', function() {
    let spriteData =
        gulp.src(paths.src.icons) // путь, откуда берем картинки для спрайта
        .pipe(debug({ title: 'building sprite:', showFiles: false }))
        .pipe(spritesmith({
            imgName: '../img/sprite.png',
            cssName: '_sprite.scss',
            algorithm: 'binary-tree',
            padding: 5,
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name //имя каждой иконки будет состоять из имени файла и конструкции 's-' в начале имени
            }
        }));
    spriteData.img.pipe(gulp.dest(paths.src.imgFolder)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(paths.src.stylesPartialsFolder)); // путь, куда сохраняем стили
});

// Task for svg-sprite
gulp.task('svg-sprite', function() {
    return gulp.src(paths.src.svgIcons)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(paths.src.imgFolder));
});

///////////////////////////////dev///////////////////////////////

// Task for html:
gulp.task('html', function() {
    return gulp.src(paths.src.html) //Выберем файлы по нужному пути
        .pipe(debug({ title: 'building html:', showFiles: false }))
        .pipe(plumber(plumberOptions))
        .pipe(include()).on('error', console.log) //Прогоним через include-file
        .pipe(nunjucks({
            path: paths.src.srcFolder
        }))
        .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true, conservativeCollapse: true, removeComments: true }))) //minify html
        .pipe(gulp.dest(isProd ? paths.prod.html : paths.dev.html)); //output to prod
});

// Таск для сборки js:
gulp.task('js', function() {
    return gulp.src(paths.src.js)
        .pipe(debug({ title: 'building js:', showFiles: false }))
        .pipe(plumber(plumberOptions))
        .pipe(gulpif(!isProd, sourceMaps.init()))
        .pipe(include()).on('error', console.log)
        .pipe(gulpif(isProd, babel({
            presets: ['es2015-script'], //es2015-script is for runing in browser, this = window, not undefined
            //			plugins: ['']
        })))
        .pipe(gulpif(isProd, uglifyJs()))
        .pipe(gulpif(!isProd, sourceMaps.write('./')))
        .pipe(gulp.dest(isProd ? paths.prod.js : paths.dev.js));
});

// Task for styles:
gulp.task('styles', function() {
    return gulp.src(paths.src.styles) //Выберем наш main.css
        .pipe(debug({ title: 'building css:', showFiles: false }))
        .pipe(plumber(plumberOptions))
        .pipe(gulpif(!isProd, sourceMaps.init()))
        .pipe(include()).on('error', console.log)
        .pipe(sass({ importer: sassModuleImporter() }).on('error', sass.logError))
        .pipe(gulpif(isProd, autoprefixer(autoprefixerOptions)))
        .pipe(gulpif(isProd, cleanCss({ compatibility: 'ie10' })))
        .pipe(gulpif(!isProd, sourceMaps.write('./')))
        .pipe(gulp.dest(isProd ? paths.prod.css : paths.dev.css))
        .pipe(reload({ stream: true }));
});

// Task for optimizing images
gulp.task('img', function() {
    return gulp.src(paths.src.img)
        .pipe(debug({ title: 'building img:', showFiles: false }))
        .pipe(plumber(plumberOptions))
        .pipe(gulpif(isProd, gulp.dest(paths.prod.img))) //Копируем изображения заранее, imagemin может пропустить парочку )
        .pipe(gulpif(isProd, imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imageminJpegRecompress({
                progressive: true,
                max: 80,
                min: 70
            }),
            imageminPngquant({ quality: [.7, .8] }),
        ])))
        .pipe(gulp.dest(isProd ? paths.prod.img : paths.dev.img));
});

// Task for php scripts
gulp.task('php', function() {
    return gulp.src(paths.src.php)
        .pipe(debug({ title: 'Copying php:', showFiles: false }))
        .pipe(gulp.dest(isProd ? paths.prod.php : paths.dev.php))
});

// Task for fonts
gulp.task('fonts', function() {
    return gulp.src(paths.src.fonts)
        .pipe(debug({ title: 'Copying fonts:', showFiles: false }))
        .pipe(gulp.dest(isProd ? paths.prod.fonts : paths.dev.fonts))
});

// Task for favicon
gulp.task('favicon', function() {
    return gulp.src(paths.src.favicon)
        .pipe(debug({ title: 'Copying favicon:', showFiles: false }))
        .pipe(gulp.dest(isProd ? paths.prod.favicon : paths.dev.favicon))
});

// Task for video
gulp.task('video', function() {
    return gulp.src(paths.src.video)
        .pipe(debug({ title: 'Copying video:', showFiles: false }))
        .pipe(gulp.dest(isProd ? paths.prod.video : paths.dev.video))
});

// Task for cleaning
gulp.task('clean', function(cb, done) {
    return isProd ? del([
        paths.prod.js,
        paths.prod.css,
        paths.prod.img,
        paths.prod.fonts,
        paths.prod.video,
    ]) : del([
        paths.dev.js,
        paths.dev.css,
        paths.dev.img,
        paths.dev.fonts,
        paths.dev.video,
    ]);
});

// Task for build
gulp.task('build', gulpSequence('clean', 'sprite', 'svg-sprite', [
    'html',
    'js',
    'styles',
    'fonts',
    'php',
    'favicon',
    'img',
    'video'
]));


// Task for watching files and run tasks
gulp.task('watch', function() {
    watch(paths.watch.html, function(event, cb) {
        gulpSequence('html', reload);
    });
    watch(paths.watch.styles, function(event, cb) {
        gulpSequence('styles', reload)
    });
    watch(paths.watch.js, function(event, cb) {
        gulpSequence('js', reload);
    });
    watch(paths.watch.fonts, function(event, cb) {
        gulpSequence('fonts', reload);
    });
    watch(paths.watch.php, function(event, cb) {
        gulpSequence('php', reload);
    });
    watch(paths.watch.favicon, function(event, cb) {
        gulpSequence('favicon', reload);
    });
    watch(paths.watch.img, function(event, cb) {
        gulpSequence('img', reload);
    });
    watch(paths.watch.video, function(event, cb) {
        gulpSequence('video', reload);
    });
    watch(paths.watch.icons, function(event, cb) {
        gulpSequence('sprite', reload);
    });
    watch(paths.watch.svgIcons, function(event, cb) {
        gulpSequence('svg-sprite', reload);
    });
});

// Default task (gulp)
gulp.task('default', function(cb) {
    isProd ? gulp.start('build') : gulpSequence('build', ['browserSync', 'watch'])(cb)
});