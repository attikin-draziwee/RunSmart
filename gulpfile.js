'use strict';
const { src, dest, series, parallel, watch, task } = require('gulp');
const { SRC, DIST, STYLES, JS } = require('./config-gulp');
const gulpIf = require('gulp-if');
const clean = require('gulp-clean');
const isProd = process.env.NODE_ENV;
const browser = require('browser-sync').create();
const reload = browser.reload;
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const minImg = require('gulp-imagemin');
const webpImg = require('gulp-webp');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
// SCSS -> CSS
const sass = require('gulp-sass')(require('sass'));
const glob = require('gulp-sass-glob');
const cleanCss = require('gulp-clean-css');
const prefix = require('gulp-autoprefixer');
// JS -> legacy JS
const babel = require('gulp-babel');
const minJS = require('gulp-uglify');
// Fonts
const ttfToWoff = require('gulp-ttf2woff');
const ttfToWoff2 = require('gulp-ttf2woff2');
const fontfacegen = require('./fonts');

task('browser-sync', function () {
  browser.init({
    server: './docs',
    open: false
  });
});
task('clean', () => src(`{${DIST}/*`, { read: false, ignore: `${DIST}/img` })
  .pipe(clean()));


task('pug', () => src(`${SRC}/*.pug`)
  .pipe(gulpIf(isProd == 'build', pug({ pretty: false }), pug({ pretty: true })))
  .pipe(dest(DIST))
  .pipe(reload({ stream: true })));
task('copy:img', () => src(`${SRC}/img/**/*`)
  .pipe(minImg([minImg.mozjpeg({ quality: 75, progressive: true }), minImg.optipng({ optimizationLevel: 3 }),]))
  .pipe(webpImg())
  .pipe(dest(`${DIST}/img`))
  .pipe(reload({ stream: true })));
task('copy:svg', () => src(`${SRC}/icons/**/*.svg`)
  .pipe(svgo({
    plugins: [{
      removeAttrs: {
        attrs: '(fill|stroke)'
      }
    }]
  }))
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: '../sprite.svg'
      }
    }
  }))
  .pipe(dest(`${DIST}/icons`))
  .pipe(reload({ stream: true })));
task('sass', () => src(STYLES, { sourcemaps: gulpIf(isProd == 'dev', true, false) })
  .pipe(glob())
  .pipe(sass())
  .pipe(concat('main.min.css'))
  .pipe(prefix())
  .pipe(gulpIf(isProd == 'build', cleanCss({ level: 2 })))
  .pipe(dest(`${DIST}/css`, { sourcemaps: gulpIf(isProd == 'dev', true, false) }))
  .pipe(reload({ stream: true })));
task('js', () => src(JS, { sourcemaps: gulpIf(isProd == 'dev', true, false) })
  .pipe(concat('main.min.js'))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(gulpIf(isProd == 'build', minJS()))
  .pipe(dest(DIST, { sourcemaps: gulpIf(isProd == 'dev', true, false) }))
  .pipe(reload({ stream: true })));
// FONTS
task('ttfToWoff2', () => src(`${SRC}/fonts/*.ttf`)
  .pipe(ttfToWoff2())
  .pipe(dest(`${SRC}/fonts/converted`))
);
task('ttfToWoff', () => src(`${SRC}/fonts/*.ttf`)
  .pipe(ttfToWoff())
  .pipe(dest(`${SRC}/fonts/converted`))
);
task('fontsGenCss', () => src(`${SRC}/fonts/converted/**/*.{woff,woff2}`)
  .pipe(fontfacegen({
    filepath: `${SRC}/sass/layout`,
    filename: 'font.scss'
  }))
);
task('convertfonts', series(parallel('ttfToWoff', 'ttfToWoff2'), 'fontsGenCss'));
task('copy:fonts', () => src(`${SRC}/fonts/converted/**/*`)
  .pipe(dest(`${DIST}/fonts`))
  .pipe(reload({ stream: true }))
);

task('reloading', () => reload({ stream: true }));

watch([SRC, `!${SRC}/fonts/**/*`], series('clean', parallel('pug', 'copy:fonts', 'sass', 'js', 'copy:svg')));
task('default', series('clean', parallel('pug', 'copy:img', 'sass', 'js', 'copy:svg', 'copy:fonts'), 'browser-sync'));
task('fontsGen', series('convertfonts'));