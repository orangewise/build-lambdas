# build-lambdas

[![Node.js CI][ci-badge]][ci-url]
[![npm version][npm-badge]][npm-url]

Utility to build your lambdas in parallel.

- runs `npm install --production` after removing `node_modules` folder
- runs `npm ci --only=production` if there is a package-lock.json
- it can zip your lambdas

## Usage

As a module:
```javascript
const path = require('path')
const join = path.join
const buildLambdas = require('build-lambdas')

const lambdaFolder01 = join('test', 'fixtures', 'lambdas', 'lambda-with-lock-01')
const lambdaFolder02 = join('test', 'fixtures', 'lambdas', 'lambda-with-lock-02')
const lambdaFolder03 = join('test', 'fixtures', 'lambdas', 'lambda-with-lock-03')
const lambdaFolderA = join('test', 'fixtures', 'lambdas', 'lambda-with-lock-a')

async function buildAndZip() {
  await buildLambdas.runParallel([
    { args: ['install', 'zip'], cwd: lambdaFolder01 },
    { args: ['install', ['run', 'build'], 'zip'], cwd: lambdaFolder02 },
    // you can also run your own function:
    { args: ['install', customZip], cwd: lambdaFolder03 }
  ])
}

// My own zip function:
async function customZip() {
  return buildLambdas.zipDirectory(lambdaFolderA, 'lambda-with-custom-zip-filename.zip')
}

buildAndZip()
```

## License

ISC


[npm-badge]: https://badge.fury.io/js/build-lambdas.svg
[npm-url]: https://badge.fury.io/js/build-lambdas

[ci-badge]: https://github.com/orangewise/build-lambdas/workflows/Node.js%20CI/badge.svg
[ci-url]: https://github.com/orangewise/build-lambdas/actions