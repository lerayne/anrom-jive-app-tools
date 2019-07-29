/**
 * Created by M. Yegorov on 2016-12-23.
 */

const gulp = require('gulp')
const shell = require('gulp-shell')
const rimraf = require('gulp-rimraf')
const jest = require('gulp-jest').default
const runSequence = require('run-sequence')
const fs = require('fs')
const jestConfig = require('./jest.config')

gulp.task('default', () => {
    return runSequence('process-styles', 'babel-win', 'tests', () => console.log('OK!'))
})

/*gulp.task('clean', () => {
    gulp.src('./lib/!*').pipe(rimraf())
})*/

gulp.task('process-styles', () => {
    return gulp.src('./src/*.css')
        .pipe(gulp.dest('./'))
})

gulp.task('babel-win', () => {
    return gulp.src('', {read: false})
        .pipe(shell('node node_modules/babel-cli/bin/babel.js ./src --out-dir ./ --source-maps'))
})

gulp.task('tests', () => {
    return gulp.src('./tests').pipe(jest(jestConfig))
})