const debug = require('debug')

const log = debug('@modernpoacher/design-system')

const {
  env: {
    NODE_ENV = 'development',
    DEBUG = '@modernpoacher/design-system'
  }
} = process

debug.enable(DEBUG)

log('`Design System` is awake')

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

module.exports = (api = { cache: { using: () => log({ NODE_ENV, default: true }) } }) => {
  log({ NODE_ENV })

  api.cache.using(() => NODE_ENV)

  return {
    presets,
    plugins
  }
}
