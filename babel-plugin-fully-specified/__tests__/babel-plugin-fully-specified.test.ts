import { transformFileAsync } from '@babel/core'
import path from 'path'
import fullySpecifiedPlugin from '../babel-plugin-fully-specified'

describe('default config', () => {
  describe('.js', () => {
    const file = path.resolve(__dirname, './artifacts/module.js')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
        })
      ).code
    })

    it('should match .js snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/js/foo.js";
import "./modules/js/index.js";
import './modules/js/styles.min.css';
import './modules/js/bar.ts';
import('./modules/js/foo');

`.trim()
      )
    })
  })

  describe('.mjs', () => {
    const file = path.resolve(__dirname, './artifacts/module.mjs')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
        })
      ).code
    })

    it('should match .mjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/mjs/foo.mjs";
import "./modules/mjs/index.mjs";
import './modules/mjs/styles.min.css';
import './modules/mjs/bar.ts';
import('./modules/mjs/foo');

`.trim()
      )
    })
  })

  describe('.cjs', () => {
    const file = path.resolve(__dirname, './artifacts/module.cjs')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [fullySpecifiedPlugin],
        })
      ).code
    })

    it('should match .cjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/cjs/foo.cjs";
import "./modules/cjs/index.cjs";
import './modules/cjs/styles.min.css';
import './modules/cjs/bar.ts';
import('./modules/cjs/foo');

`.trim()
      )
    })
  })

  describe('.tsx', () => {
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

    it('should get transformd to .js', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/tsx/foo.js";
import "./modules/tsx/index.js";
import './modules/tsx/styles.min.css';
import './modules/tsx/bar.ts';
import('./modules/tsx/foo');

`.trim()
      )
    })
  })
})

describe('ensureFileExists', () => {
  describe('.js', () => {
    const file = path.resolve(__dirname, './artifacts/module.js')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
        })
      ).code
    })

    it('should match .js snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/js/foo.js";
import "./modules/js/index.js";
import './modules/js/styles.min.css';
import './modules/js/bar.ts';
import('./modules/js/foo');

`.trim()
      )
    })
  })

  describe('.mjs', () => {
    const file = path.resolve(__dirname, './artifacts/module.mjs')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
        })
      ).code
    })

    it('should match .mjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/mjs/foo.mjs";
import "./modules/mjs/index.mjs";
import './modules/mjs/styles.min.css';
import './modules/mjs/bar.ts';
import('./modules/mjs/foo');

`.trim()
      )
    })
  })

  describe('.cjs', () => {
    const file = path.resolve(__dirname, './artifacts/module.cjs')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [[fullySpecifiedPlugin, { ensureFileExists: true }]],
        })
      ).code
    })

    it('should match .cjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import "./modules/cjs/foo.cjs";
import "./modules/cjs/index.cjs";
import './modules/cjs/styles.min.css';
import './modules/cjs/bar.ts';
import('./modules/cjs/foo');

`.trim()
      )
    })
  })

  describe('.tsx', () => {
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

    it('should not get transformd to .js', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir.js";
import './modules/tsx/foo';
import './modules/tsx';
import './modules/tsx/styles.min.css';
import './modules/tsx/bar.ts';
import('./modules/tsx/foo');

`.trim()
      )
    })
  })
})
