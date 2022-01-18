import { transformFileAsync } from '@babel/core'
import path from 'path'
import fullySpecifiedPlugin from '../babel-plugin-fully-specified'

describe('default config', () => {
  describe('js', () => {
    const file = path.resolve(__dirname, './artifacts/module.js')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
        })
      ).code
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

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
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

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
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

  describe('tsx', () => {
    const file = path.resolve(__dirname, './artifacts/module.tsx')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          presets: [
            [
              '@babel/preset-typescript',
              { isTSX: true, allExtensions: true },
            ],
          ],
          plugins: [fullySpecifiedPlugin],
        })
      ).code
    })

    it('should be transformd to .js', () => {
      expect(code).toBe(
        `

import "./modules/foo.js";
import "./modules/index.js";
import './modules/styles.min.css';
import './modules/bar.ts';

`.trim()
      )
    })
  })
})

describe('ensureFileExists', () => {
  describe('js', () => {
    const file = path.resolve(__dirname, './artifacts/module.js')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
        })
      ).code
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

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
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

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
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

  describe('tsx', () => {
    const file = path.resolve(__dirname, './artifacts/module.tsx')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          presets: [
            [
              '@babel/preset-typescript',
              { isTSX: true, allExtensions: true },
            ],
          ],
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
        })
      ).code
    })

    it('should be transformd to .js', () => {
      expect(code).toBe(
        `
        
import "./modules/foo.js";
import "./modules/index.js";
import './modules/styles.min.css';
import './modules/bar.ts';

`.trim()
      )
    })
  })
})
