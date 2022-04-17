const { series, src, dest } = require('gulp')
const jest = require('gulp-jest').default
const gulpBabel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps');
const jestConfig = require('./jest.config')

function processStyles () {
  return src('./src/*.css').pipe(dest('./'))
}

function babel () {
  return src('./src/**/*.es6')
    .pipe(sourcemaps.init())
    .pipe(gulpBabel())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('.'))
}

function tests () {
  return src('./tests').pipe(jest(jestConfig))
}

exports.default = series(processStyles, babel, tests)

/*gulp.task('clean', () => {
    gulp.src('./lib/!*').pipe(rimraf())
})*/