import { transformFileAsync } from '@babel/core'
import path from 'path'
import plugin from '../babel-plugin-fully-specified.js'

describe('js', () => {
  const file = path.resolve(__dirname, './artifacts/module.js')

  let code

  beforeAll(async () => {
    code = (
      await transformFileAsync(file, {
        plugins: [plugin],
      })
    ).code
    const res = await transformFileAsync(file, {
      plugins: [plugin],
    })
  })

  it('should match snapshot', () => {
    expect(code).toBe(
      `

import mod from "./modules/foo.js";
import index from "./modules/index.js";
import styles from './modules/styles.min.css';
import ts from './modules/bar.ts';

`.trim()
    )
  })
})

describe('mjs', () => {
  const file = path.resolve(__dirname, './artifacts/module.mjs')

  let code

  beforeAll(async () => {
    code = (
      await transformFileAsync(file, {
        plugins: [plugin],
      })
    ).code
  })

  it('should match snapshot', () => {
    expect(code).toBe(
      `
import mod from "./modules/foo.mjs";
import index from "./modules/index.mjs";
import styles from './modules/styles.min.css';
import ts from './modules/bar.ts';

`.trim()
    )
  })
})

describe('cjs', () => {
  const file = path.resolve(__dirname, './artifacts/module.cjs')

  let code

  beforeAll(async () => {
    code = (
      await transformFileAsync(file, {
        plugins: [plugin],
      })
    ).code
  })

  it('should match snapshot', () => {
    expect(code).toBe(
      `
import mod from "./modules/foo.cjs";
import index from "./modules/index.cjs";
import styles from './modules/styles.min.css';
import ts from './modules/bar.ts';

`.trim()
    )
  })
})
