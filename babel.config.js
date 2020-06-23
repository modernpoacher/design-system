const debug = require('debug')

const log = debug('@modernpoacher/design-system')

const {
  env: {
    DEBUG = '@modernpoacher/design-system',
    NODE_ENV = 'development'
  }
} = process

debug.enable(DEBUG)

log('`design-system` is awake')

function env () {
  log({ NODE_ENV })

  return NODE_ENV === 'production'
}

const presets = [
  [
    '@babel/env', {
      useBuiltIns: 'entry',
      targets: {
        node: 'current'
      },
      corejs: '3.0.1'
    }
  ]
]

const plugins = [
  '@babel/proposal-export-default-from',
  '@babel/proposal-export-namespace-from',
  [
    '@babel/proposal-class-properties',
    {
      loose: false
    }
  ],
  [
    'module-resolver',
    {
      root: ['./src'],
      cwd: 'babelrc',
      alias: {
        'design-system': '.',
        build: './build'
      }
    }
  ]
]

module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets,
    plugins
  }
}
