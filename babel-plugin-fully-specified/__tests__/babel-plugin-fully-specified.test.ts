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

import "./modules/foo.js";
import "./modules/index.js";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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

import "./modules/foo.mjs";
import "./modules/index.mjs";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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

import "./modules/foo.cjs";
import "./modules/index.cjs";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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
import('./modules/foo');

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

import "./modules/foo.js";
import "./modules/index.js";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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

import "./modules/foo.mjs";
import "./modules/index.mjs";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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
import "./modules/foo.cjs";
import "./modules/index.cjs";
import './modules/styles.min.css';
import './modules/bar.ts';
import('./modules/foo');

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
import('./modules/foo');

`.trim()
      )
    })
  })
})
