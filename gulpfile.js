const { series, parallel, src, dest, watch } = require('gulp'),
      less = require('gulp-less'),                 // препроцессор CSS
      plumber = require('gulp-plumber'),           // ловец ошибок в watch
      posthtml = require('gulp-posthtml'),         // подцеплен только для posthtml-include
      include = require('posthtml-include'),       // используется для интеграции SVG-спрайта
      postcss = require('gulp-postcss'),           // подцеплен только для autoprefixer
      autoprefixer = require('autoprefixer'),      // авторасстановка вендерных префиксов
      minify = require('gulp-csso'),               // минимизатор CSS
      rename = require('gulp-rename'),             // возможность переименования в Gulp
      imagemin = require('gulp-imagemin'),         // оптимизатор изображений
      webp = require('gulp-webp'),                 // создатель webp-копий изображений
      server = require('browser-sync').create();   // живой сервер

// Команды консоли
exports.server = startServer;
exports.html = copyHTML;
exports.js = copyJS;
exports.less = lessToCss;
exports.css = lessToCss;
exports.server = startServer;
exports.img = copyIMG;
exports.webp = createWEBP;

exports.go = series(startServer, goWatch);
exports.default = series(startServer, goWatch);

// Консольные сообщения
const message = {
  consoleServerStart : function() {
    console.log('+++++++++++++++++++      Server start      ++++++++++++++++++++');
  },
  consoleServerReload : function() {
    console.log('+++++++++++++++++++      Server reload      +++++++++++++++++++');
  },
  consoleCopyHTML : function() {
    console.log('---                                                         ---');
    console.log('-      Copy HTML (with <include> integration) >>> build       -');
    console.log('---                                                         ---');
  },
  consoleCopyJS : function() {
    console.log('---                                                         ---');
    console.log('-                    Copy JS >>> build/js                     -');
    console.log('---                                                         ---');
  },
  consoleLESStoCSS : function() {
    console.log('---                                                         ---');
    console.log('-   LESS to CSS (+ autorpefixing & minifying) >>> build/css   -');
    console.log('---                                                         ---');
  },
  consoleCopyIMG : function() {
    console.log('---                                                         ---');
    console.log('-            Copy & optimisation IMG >>> build/img            -');
    console.log('---                                                         ---');
  },
  consoleCreateWEBP : function() {
    console.log('---                                                         ---');
    console.log('-    WEBP-copies creation from png/jpg >>> build/img/webp     -');
    console.log('---                                                         ---');
  }
}


// ---------------------------------------------------------
// ------------------------ Функции ------------------------
// ---------------------------------------------------------

// Слушать файлы
// (отдельное правило для sprite.svg - он инлайнится в html)
function goWatch() {
  // ... подписаться на файлы
  const watcherHTML = watch(['src/**/*.html']),
        watcherLESS = watch(['src/less/**/*.less']),
        watcherJS = watch(['src/js/**/*.js']),
        watcherIMG = watch(['src/img/**/*.{png,jpg,jpeg,svg}', '!src/img/sprite.svg']),
        watcherSpriteSVG = watch(['src/img/sprite.svg']);
  // ... и запустить по событиям файловой системы
  watcherHTML.on('all', series(copyHTML, serverReload));
  watcherLESS.on('all', series(lessToCss, serverReload));
  watcherJS.on('all', series(copyJS, serverReload));
  watcherIMG.on('all', series(parallel(copyIMG, createWEBP), serverReload));
  watcherSpriteSVG.on('all', series(copyHTML, serverReload));
};

// Запуск сервера BrowserSync
function startServer(cb) {
  message.consoleServerStart();
  server.init({
    server: {
      baseDir: "./build/"
    }
  });
  cb();
};

// Обновление сервера BrowserSync
function serverReload(cb) {
  message.consoleServerReload();
  server.reload();
  cb();
};

// Скопировать HTML в build
// с интеграцией из тега <include>
function copyHTML() {
  message.consoleCopyHTML();
  return src('src/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(dest('build'));
};

// Скопировать JS
function copyJS() {
  message.consoleCopyJS();
  return src('src/js/**/*.js')
    .pipe(dest('build/js'));
};

// Компилировать LESS в CSS
// с автопрефиксификацией и минификацией
function lessToCss() {
  message.consoleLESStoCSS();
  return src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(dest('build/css'));
};

// Копирование и оптимизация картинок
// с исключением для sprite.svg
function copyIMG() {
  message.consoleCopyIMG();
  return src(['src/img/**/*.{png,jpg,jpeg,svg}', '!src/img/sprite.svg'])
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(dest('build/img'));
};

// создать webp-копии растровых картинок
function createWEBP() {
  message.consoleCreateWEBP();
  return src('src/img/**/*.{png,jpg,jpeg}')
    .pipe(webp({quality: 90}))
    .pipe(dest('build/img/webp'));
}
