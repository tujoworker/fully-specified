import '@babel-plugin-fully-specified/test-package'
import '@babel-plugin-fully-specified/test-package/subdir'
import './modules/ts/foo'
import './modules/ts/hybrid'
import './modules/ts'
import './modules/ts/styles.min.css'
import './modules/ts/bar.ts'
import('./modules/ts/foo')

export * from './modules/ts/foo'
export * from './modules/ts/hybrid'
export * as name from './modules/ts'
export { foo } from './modules/ts/foo'
