import { npmRun, runParallel } from '..'
import * as fs from 'fs'
import { join } from 'path'
import * as rimraf from 'rimraf'

test('npm install lambda-no-lock', async () => {
  const lambdaFolder = join(__dirname, 'lambdas', 'lambda-no-lock')
  rimraf.sync(join(lambdaFolder, 'node_modules'))
  await npmRun(['install'], lambdaFolder)
  expect(fs.existsSync(join(lambdaFolder, 'node_modules', 'debug', 'package.json'))).toBe(true)
})

test('npm install lambda-with-lock', async () => {
  const lambdaFolder = join(__dirname, 'lambdas', 'lambda-with-lock')
  rimraf.sync(join(lambdaFolder, 'node_modules'))
  await npmRun(['install'], lambdaFolder)
  expect(fs.existsSync(join(lambdaFolder, 'node_modules', 'debug', 'package.json'))).toBe(true)
})

test('npm ci', async () => {
  const lambdaFolder = join(__dirname, 'lambdas', 'lambda-with-lock')
  rimraf.sync(join(lambdaFolder, 'node_modules'))
  await npmRun(['ci'], lambdaFolder)
  expect(fs.existsSync(join(lambdaFolder, 'node_modules', 'debug', 'package.json'))).toBe(true)
})

test('npm build', async () => {
  const lambdaFolder = join(__dirname, 'lambdas', 'lambda-no-lock')
  rimraf.sync(join(lambdaFolder, 'node_modules'))
  const stdout = await npmRun(['run', 'build'], lambdaFolder)
  expect(stdout).toMatch('build succeeded')
})

test('run Parallel', async () => {
  const lambdaFolder01 = join('test', 'lambdas', 'lambda-with-lock-01')
  const lambdaFolder02 = join('test', 'lambdas', 'lambda-with-lock-02')
  const lambdaFolder03 = join('test', 'lambdas', 'lambda-with-lock-03')
  rimraf.sync(join(lambdaFolder01, 'node_modules'))
  rimraf.sync(join(lambdaFolder02, 'node_modules'))
  rimraf.sync(join(lambdaFolder02, 'build-succeeded.txt'))
  rimraf.sync(join(lambdaFolder03, 'node_modules'))

  await runParallel([
    { args: ['install'], cwd: lambdaFolder01 },
    { args: ['install', ['run', 'build']], cwd: lambdaFolder02 },
    { args: ['install'], cwd: lambdaFolder03 }
  ])
  expect(fs.existsSync(join(lambdaFolder01, 'node_modules', 'debug', 'package.json'))).toBe(
    true
  )
  expect(fs.existsSync(join(lambdaFolder02, 'node_modules', 'debug', 'package.json'))).toBe(
    true
  )
  expect(fs.existsSync(join(lambdaFolder02, 'build-succeeded.txt'))).toBe(
    true
  )
  expect(fs.existsSync(join(lambdaFolder03, 'node_modules', 'debug', 'package.json'))).toBe(
    true
  )
}, 10000)
