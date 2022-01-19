import '@babel-plugin-fully-specified/test-package'
import '@babel-plugin-fully-specified/test-package/subdir'
import './modules/mjs/foo'
import './modules/mjs'
import './modules/mjs/styles.min.css'
import './modules/mjs/bar.ts'
import('./modules/mjs/foo')

export * from './modules/mjs/foo'
export * as name from './modules/mjs'
export { foo } from './modules/mjs/foo'
