import debug from 'debug'

import {
  exec
} from 'child_process'

const log = debug('@modernpoacher/design-system:build:gulp:pre-commit')

log('`Design System` is awake')

const PACKAGE = /-+\s+"version":\s"(\d+\.\d+\.\d+)",\s+\++\s+"version":\s"(\d+\.\d+\.\d+)",\s+/s
const OPTIONS = {
  maxBuffer: 1024 * 500
}

const hasPackageVersionChanges = () => (
  new Promise((resolve, reject) => {
    exec('git diff HEAD origin/master package.json', OPTIONS, (e, v) => (!e) ? resolve(PACKAGE.test(v)) : reject(e))
  })
)

const patchPackageVersion = () => (
  new Promise((resolve, reject) => {
    exec('npm version patch -m %s -n --no-git-tag-version --no-verify', OPTIONS, (e) => (!e) ? resolve() : reject(e))
  })
)

const addPackageChanges = () => (
  new Promise((resolve, reject) => {
    exec('git add package.json package-lock.json', OPTIONS, (e) => (!e) ? resolve() : reject(e))
  })
)

export default async () => {
  try {
    const b = await hasPackageVersionChanges()
    if (!b) {
      await patchPackageVersion()
      await addPackageChanges()
    }
  } catch ({ message }) {
    console.error(message)
  }
}
