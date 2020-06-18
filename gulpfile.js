require('@babel/register')({
  ignore: [
    /node_modules/
  ]
})

const gulp = require('gulp')

const {
  preCommit
} = require('./build/gulp')

gulp
  .task('pre-commit', preCommit)

gulp
  .task('default', (done) => done())
