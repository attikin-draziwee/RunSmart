module.exports = {
  SRC: './build',
  DIST: './docs',
  STYLES: ['./node_modules/reset.css/reset.css',
    './node_modules/normalize.css/normalize.css', './node_modules/slick-carousel/slick/slick.scss', './node_modules/slick-carousel/slick/slick-theme.scss', './build/+(sass|scss)/*.+(sass|scss)'],
  JS: ['./node_modules/jquery/dist/jquery.slim.min.js', './node_modules/slick-carousel/slick/slick.min.js', `./build/scripts/**/*.js`],
};