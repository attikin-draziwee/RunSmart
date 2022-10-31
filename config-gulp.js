module.exports = {
  SRC: './build',
  DIST: './docs',
  STYLES: ['./node_modules/reset.css/reset.css',
    './node_modules/normalize.css/normalize.css', './build/+(sass|scss)/*.+(sass|scss)'],
  JS: [`./build/scripts/**/*.js`],
};