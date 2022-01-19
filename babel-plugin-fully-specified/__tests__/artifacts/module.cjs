import '@babel-plugin-fully-specified/test-package'
import '@babel-plugin-fully-specified/test-package/subdir'
import './modules/cjs/foo'
import './modules/cjs'
import './modules/cjs/styles.min.css'
import './modules/cjs/bar.ts'
import('./modules/cjs/foo')

export * from './modules/cjs/foo'
export * as name from './modules/cjs'
export { foo } from './modules/cjs/foo'
