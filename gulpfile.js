const { series, parallel, src, dest, watch } = require('gulp'),
      less = require('gulp-less'),
      plumber = require('gulp-plumber'),
      server = require('browser-sync').create();

function lessToCss() {
  console.log('LESS to CSS');
  return src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(dest('build/css'));
};

function startServer(cb) {
  server.init({
    server: {
      baseDir: "./build/"
    }
  });
  cb();
};

function serverReload(cb) {
  console.log('server reload');
  server.reload();
  cb();
};

function copyHTML() {
  console.log('CopyHTML');
  return src('src/*.html')
    .pipe(dest('build'));
};

// Команды консоли
exports.less = lessToCss;
exports.bs = startServer;
exports.html = copyHTML;

exports.default = startServer;

// Прослушка событий
watch(['src/less/**/*.less', 'src/**/*.html'], { events: 'all' }, series(copyHTML, lessToCss, serverReload));