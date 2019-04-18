const { series, parallel, src, dest, watch } = require('gulp'),
      plumber = require('gulp-plumber'),           // gulp: ловец ошибок в watch
      rename = require('gulp-rename'),             // gulp: переименование в Gulp
      rm = require('gulp-rm'),                     // gulp: удаление в Gulp
      posthtml = require('gulp-posthtml'),         // html: подцеплен для функционирования posthtml-include
      include = require('posthtml-include'),       // html: используется для интеграции SVG-спрайта
      less = require('gulp-less'),                 // css: препроцессор CSS
      postcss = require('gulp-postcss'),           // css: подцеплен для autoprefixer
      autoprefixer = require('autoprefixer'),      // css: авторасстановка вендерных префиксов
      minify = require('gulp-csso'),               // css: минимизатор CSS
      imagemin = require('gulp-imagemin'),         // img: оптимизатор изображений
      webp = require('gulp-webp'),                 // img: создатель webp-копий изображений
      babel = require('gulp-babel'),               // js: JS-транспайлер и полифил (< ES2015)
      terser = require('gulp-terser'),             // js: JS-минификатор
      concat = require('gulp-concat'),             // конкатенация файлов
      server = require('browser-sync').create();   // живой сервер


// Пакет консольных сообщений
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
    console.log('-        JS copy & concat & compress >>> build/all.js         -');
    console.log('---                                                         ---');
  },
  consoleLESStoCSS : function() {
    console.log('---                                                         ---');
    console.log('-   LESS to CSS (+ autorpefixing & minifying) >>> build/css   -');
    console.log('---                                                         ---');
  },
  consoleCopyIMG : function() {
    console.log('---                                                         ---');
    console.log('-          Images copy & optimisation >>> build/img           -');
    console.log('---                                                         ---');
  },
  consoleCreateWEBP : function() {
    console.log('---                                                         ---');
    console.log('-    WEBP-copies creation from png/jpg >>> build/img/webp     -');
    console.log('---                                                         ---');
  },
  consoleCopyFonts : function() {
    console.log('---                                                         ---');
    console.log('-          Fonts copy (woff, woff2) >>> build/fonts           -');
    console.log('---                                                         ---');
  },
  consoleClearBuild : function() {
    console.log('---                                                         ---');
    console.log('-            !!!    Build is fully cleared    !!!             -');
    console.log('---                                                         ---');
  },
  consoleRebuild : function() {
    console.log('---                                                         ---');
    console.log('-          !!!    Project rebuild is complete    !!!          -');
    console.log('---                                                         ---');
  },
  consolePublish : function() {
    console.log('---                                                         ---');
    console.log('-      Copy build for GitHub hosting / build >>> docs         -');
    console.log('---                                                         ---');
  }
}


// Команды консоли
exports.server = startServer;
exports.html = copyHTML;
exports.less = lessToCss;
exports.css = lessToCss;
exports.js = copyJS;
exports.img = copyIMG;
exports.webp = createWEBP;
exports.fonts = copyFonts;
exports.rmb = clearBuild;
// Команда для работы с живым сервером
exports.go = series(startServer, goWatch);
exports.default = series(startServer, goWatch);
// Обновить файлы для GitHubPages
exports.refreshGHP = series(clearDocs, copyOnGHPages);
// Полная пересборка проекта
exports.build = series(clearBuild, // очистить build
                  parallel(
                    copyHTML,      // скопировать все html, заинлайнив sprite.svg через include
                    lessToCss,     // компилировать css из less, с автопрефиксами и минимизацией
                    copyJS,        // скопировать js-файлы
                    copyFonts,     // скопировать шрифты
                    copyIMG,       // скопировать изображения с оптимизацией
                    createWEBP,    // создать webp-копии изображений в отдельный каталог
                  ),
                  clearDocs,       // почистить директорию docs
                  copyOnGHPages,   // cкопировать сборку в docs для хостинга на GitHub
                  startServer,     // запустить сервер для проверки (без прослушки ФС)
                  function() { message.consoleRebuild() } // сообщить о завершении
                );


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
  // ... и запустить обработку по событиям файловой системы
  watcherHTML.on('all', series(copyHTML, serverReload));
  watcherLESS.on('all', series(lessToCss, serverReload));
  watcherJS.on('all', series(copyJS, serverReload));
  watcherIMG.on('all', parallel(copyIMG, createWEBP));
  watcherSpriteSVG.on('all', series(copyHTML, serverReload));
};

// Запуск сервера BrowserSync
function startServer(cb) {
  message.consoleServerStart();
  server.init({
    server: {
      baseDir: './build/'
    },
    notify: false
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

// Скопировать JS с транспиляцией,
// минификацией и объединением в all.js
function copyJS() {
  message.consoleCopyJS();
  return src('src/js/**/*.js')
  .pipe(dest('build/js'))
  .pipe(concat('all.js'))
  .pipe(babel())
  .pipe(terser({
    keep_fnames: true,
    mangle: false
  }))
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

// Копирование и оптимизация изображений
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

// Создать webp-копии растровых изображений
function createWEBP() {
  message.consoleCreateWEBP();
  return src('src/img/**/*.{png,jpg,jpeg}')
    .pipe(webp({quality: 90}))
    .pipe(dest('build/img/webp'));
};

// Копировать шрифты
function copyFonts() {
  message.consoleCopyFonts();
  return src('src/fonts/**/*.{woff,woff2}')
    .pipe(dest('build/fonts'));
};

// Полная очистка сборки
function clearBuild() {
  message.consoleClearBuild();
  return src('build/**/*', {read: false})
    .pipe(rm());
};

// копирование сборки для gh-pages
function copyOnGHPages() {
  message.consolePublish();
  return src('build/**/*')
    .pipe(dest('docs'));
};

// Очистка docs
function clearDocs() {
  return src('docs/**/*', {read: false})
    .pipe(rm());
};