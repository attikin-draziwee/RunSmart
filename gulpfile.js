'use strict';
const gulp = require('gulp');
const crossEnv = process.env.NODE_ENV;
const gulpIf = require('gulp-if');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const gulpConcat = require('gulp-concat');
const gulpMaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-clean-css');
const cssAutoPrefix = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const imageMin = require('gulp-imagemin');
const imgToWebp = require('gulp-webp');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const ttfToWoff = require('gulp-ttf2woff');
const ttfToWoff2 = require('gulp-ttf2woff2');
const fontfacegen = require('gulp-fontfacegen');
const pxToRem = require('gulp-smile-px2rem');
const pug = require('gulp-pug');
const { SRC_PATH, DIST_PATH, CLEAR_FILES, STYLES } = require('./gulp.config');

const files = CLEAR_FILES;
const cssFiles = [...STYLES, `${SRC_PATH}/scss/main.scss`];

gulp.task('cleanAll', () => gulp.src([DIST_PATH, `${SRC_PATH}/scss/layout/font.scss`, `${SRC_PATH}/fonts/converted/`], { read: false })
  .pipe(clean()));
gulp.task('clean', () => gulp.src([DIST_PATH, `${SRC_PATH}/scss/layout/font.scss`], { read: false })
  .pipe(clean()));

gulp.task('pugToHtml', () => gulp.src(`${SRC_PATH}/*.pug`)
  .pipe(pug({
    pretty: process.env.NODE_ENV == 'dev' ? true : false
  }))
  .pipe(gulp.dest(DIST_PATH))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('copy:img', () => gulp.src(`${SRC_PATH}/img/**/*`)
  .pipe(imageMin({
    plugins: [
      imageMin.gifsicle(), imageMin.mozjpeg(), imageMin.optipng(),
    ]
  }))
  .pipe(imgToWebp({ quality: 50 }))
  .pipe(gulp.dest(`${DIST_PATH}/img`))
  .pipe(browserSync.reload({ stream: true }))
);

gulp.task('ttfToWoff2', () => gulp.src(`${SRC_PATH}/fonts/**/*`)
  .pipe(ttfToWoff2())
  .pipe(gulp.dest(`${SRC_PATH}/fonts/converted`))
);

gulp.task('ttfToWoff', () => gulp.src(`${SRC_PATH}/fonts/**/*`)
  .pipe(ttfToWoff())
  .pipe(gulp.dest(`${SRC_PATH}/fonts/converted`))
);

gulp.task('convertfonts', gulp.series(gulp.parallel('ttfToWoff', 'ttfToWoff2')));

gulp.task('copy:fonts', () => gulp.src(`${SRC_PATH}/fonts/converted/**/*.{woff,woff2}`)
  .pipe(fontfacegen({
    filepath: `${SRC_PATH}/scss/layout`,
    filename: 'font.scss'
  }))
  .pipe(gulp.dest(`${DIST_PATH}/font`))
);

gulp.task('copy:icons', () => gulp.src(`${SRC_PATH}/icons/**/*`)
  .pipe(svgo({
    plugins: [{
      removeAttrs: {
        attrs: '(fill|stroke|style|width|height|data.*)'
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
  .pipe(gulp.dest(`${DIST_PATH}/icons`))
);

gulp.task('sass', () => gulp.src(cssFiles)
  .pipe(gulpIf(crossEnv === 'dev', gulpMaps.init()))
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(gulpConcat('main.min.css'))
  .pipe(pxToRem({
    drm: 2,
    rem: 8,
    one: false
  }))
  .pipe(gulpIf(crossEnv === 'build', gcmq()))
  .pipe(gulpIf(crossEnv === 'build', cssAutoPrefix()))
  .pipe(gulpIf(crossEnv === 'build', cleanCSS()))
  .pipe(gulpIf(crossEnv === 'dev', gulpMaps.write()))
  .pipe(gulp.dest(DIST_PATH))
  .pipe(browserSync.reload({ stream: true }))
);

gulp.task('browser', () => {
  browserSync.init({
    server: {
      baseDir: DIST_PATH
    },
    open: false,
  });
});

gulp.watch(files, gulp.series('clean', 'pugToHtml', 'copy:img', 'copy:icons', 'copy:fonts', 'sass'));

gulp.task('default', gulp.series('cleanAll', 'pugToHtml', 'copy:img', 'copy:icons', 'convertfonts', 'copy:fonts', 'sass', 'browser'));