const { series, src, dest } = require('gulp')
const shell = require('gulp-shell')
const jest = require('gulp-jest').default
const gulpBabel = require('gulp-babel')
const jestConfig = require('./jest.config')

function processStyles () {
  return src('./src/*.css').pipe(dest('./'))
}

function babel () {
  return src('./src').pipe(gulpBabel()).pipe(dest('.'))
}

function tests () {
  return src('./tests').pipe(jest(jestConfig))
}

exports.default = series(processStyles, babel, tests, () => console.log('OK!'))

/*gulp.task('clean', () => {
    gulp.src('./lib/!*').pipe(rimraf())
})*/