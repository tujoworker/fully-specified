import { transformFileAsync } from '@babel/core'
import path from 'path'
import fullySpecifiedPlugin from '../babel-plugin-fully-specified'

describe('default config', () => {
  describe('.js not using includePackages', () => {
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
import '@babel-plugin-fully-specified/test-package/subdir';
import "./modules/js/foo.js";
import "./modules/js/index.js";
import './modules/js/styles.min.css';
import './modules/js/bar.ts';
import('./modules/js/foo');
export * from "./modules/js/foo.js";
export * as name from "./modules/js/index.js";
export { foo } from "./modules/js/foo.js";

`.trim()
      )
    })
  })

  describe('.js', () => {
    const file = path.resolve(__dirname, './artifacts/module.js')

    let code: string

    beforeAll(async () => {
      code = (
        await transformFileAsync(file, {
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .js snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/js/foo.js";
import "./modules/js/index.js";
import './modules/js/styles.min.css';
import './modules/js/bar.ts';
import('./modules/js/foo');
export * from "./modules/js/foo.js";
export * as name from "./modules/js/index.js";
export { foo } from "./modules/js/foo.js";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .mjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/mjs/foo.mjs";
import "./modules/mjs/index.mjs";
import './modules/mjs/styles.min.css';
import './modules/mjs/bar.ts';
import('./modules/mjs/foo');
export * from "./modules/mjs/foo.mjs";
export * as name from "./modules/mjs/index.mjs";
export { foo } from "./modules/mjs/foo.mjs";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .cjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/cjs/foo.cjs";
import "./modules/cjs/index.cjs";
import './modules/cjs/styles.min.css';
import './modules/cjs/bar.ts';
import('./modules/cjs/foo');
export * from "./modules/cjs/foo.cjs";
export * as name from "./modules/cjs/index.cjs";
export { foo } from "./modules/cjs/foo.cjs";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should get transformd to .js', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/tsx/foo.js";
import "./modules/tsx/index.js";
import './modules/tsx/styles.min.css';
import './modules/tsx/bar.ts';
import('./modules/tsx/foo');
export * from "./modules/tsx/foo.js";
export * as name from "./modules/tsx/index.js";
export { foo } from "./modules/tsx/foo.js";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                ensureFileExists: true,
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .js snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/js/foo.js";
import "./modules/js/index.js";
import './modules/js/styles.min.css';
import './modules/js/bar.ts';
import('./modules/js/foo');
export * from "./modules/js/foo.js";
export * as name from "./modules/js/index.js";
export { foo } from "./modules/js/foo.js";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                ensureFileExists: true,
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .mjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/mjs/foo.mjs";
import "./modules/mjs/index.mjs";
import './modules/mjs/styles.min.css';
import './modules/mjs/bar.ts';
import('./modules/mjs/foo');
export * from "./modules/mjs/foo.mjs";
export * as name from "./modules/mjs/index.mjs";
export { foo } from "./modules/mjs/foo.mjs";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                ensureFileExists: true,
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should match .cjs snapshot', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/cjs/foo.cjs";
import "./modules/cjs/index.cjs";
import './modules/cjs/styles.min.css';
import './modules/cjs/bar.ts';
import('./modules/cjs/foo');
export * from "./modules/cjs/foo.cjs";
export * as name from "./modules/cjs/index.cjs";
export { foo } from "./modules/cjs/foo.cjs";

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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                ensureFileExists: true,
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should not get transformd to .js', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import './modules/tsx/foo';
import './modules/tsx';
import './modules/tsx/styles.min.css';
import './modules/tsx/bar.ts';
import('./modules/tsx/foo');
export * from './modules/tsx/foo';
export * as name from './modules/tsx';
export { foo } from './modules/tsx/foo';

`.trim()
      )
    })
  })

  describe('.tsx with tryExtensions', () => {
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
          plugins: [
            [
              fullySpecifiedPlugin,
              {
                ensureFileExists: true,
                tryExtensions: ['.js', '.mjs', '.cjs', '.tsx'],
                includePackages: ['@babel-plugin-fully-specified'],
              },
            ],
          ],
        })
      ).code
    })

    it('should not get transformd to .js', () => {
      expect(code).toBe(
        `

import '@babel-plugin-fully-specified/test-package';
import "@babel-plugin-fully-specified/test-package/subdir/index.js";
import "./modules/tsx/foo.tsx";
import "./modules/tsx/index.tsx";
import './modules/tsx/styles.min.css';
import './modules/tsx/bar.ts';
import('./modules/tsx/foo');
export * from "./modules/tsx/foo.tsx";
export * as name from "./modules/tsx/index.tsx";
export { foo } from "./modules/tsx/foo.tsx";

`.trim()
      )
    })
  })
})
