import debug from 'debug'

import {
  exec
} from 'child_process'

const log = debug('@modernpoacher/design-system:build:gulp:pre-commit')

log('`@modernpoacher/design-system` is awake')

const PACKAGE = /-+\s+"version":\s"(\d+\.\d+\.\d+)",\s+\++\s+"version":\s"(\d+\.\d+\.\d+)",\s+/s

const HAS_STAGED_CHANGES = /Changes to be committed/s

const NOT_STAGED_CHANGES = /Changes not staged for commit/s

const OPTIONS = {
  maxBuffer: 1024 * 500
}

const hasPackageVersionChanges = () => ( // eslint-disable-line
  new Promise((resolve, reject) => {
    exec('git diff HEAD origin/master package.json', OPTIONS, (e, v) => (!e) ? resolve(PACKAGE.test(v)) : reject(e))
  })
)

const notPackageVersionChanges = () => (
  new Promise((resolve, reject) => {
    exec('git diff HEAD origin/master package.json', OPTIONS, (e, v) => (!e) ? resolve(PACKAGE.test(v) !== true) : reject(e))
  })
)

const hasStagedChanges = () => (
  new Promise((resolve, reject) => {
    exec('git status', OPTIONS, (e, v) => (!e) ? resolve(HAS_STAGED_CHANGES.test(v)) : reject(e))
  })
)

const notStagedChanges = () => (
  new Promise((resolve, reject) => {
    exec('git status', OPTIONS, (e, v) => (!e) ? resolve(NOT_STAGED_CHANGES.test(v)) : reject(e))
  })
)

const patchPackageVersion = () => (
  new Promise((resolve, reject) => {
    exec('npm version patch -m %s -n --no-git-tag-version --no-verify', OPTIONS, (e) => (!e) ? resolve() : reject(e))
  })
)

const addPackageVersionChanges = () => (
  new Promise((resolve, reject) => {
    exec('git add package.json package-lock.json', OPTIONS, (e) => (!e) ? resolve() : reject(e))
  })
)

export default async function preCommit () {
  log('pre-commit')

  try {
    if (await notStagedChanges()) return

    if (await hasStagedChanges()) {
      if (await notPackageVersionChanges()) {
        await patchPackageVersion()
        await addPackageVersionChanges()
      }
    }
  } catch ({ message = 'No error message defined' }) {
    log(message)
  }
}
