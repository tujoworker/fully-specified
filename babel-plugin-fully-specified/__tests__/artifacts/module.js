import '@babel-plugin-fully-specified/test-package'
import '@babel-plugin-fully-specified/test-package/subdir'
import './modules/js/foo'
import './modules/js'
import './modules/js/styles.min.css'
import './modules/js/bar.ts'
import('./modules/js/foo')

export * from './modules/js/foo'
export * as name from './modules/js'
export { foo } from './modules/js/foo'
