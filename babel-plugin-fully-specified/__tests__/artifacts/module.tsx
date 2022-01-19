import '@babel-plugin-fully-specified/test-package'
import '@babel-plugin-fully-specified/test-package/subdir'
import './modules/tsx/foo'
import './modules/tsx'
import './modules/tsx/styles.min.css'
import './modules/tsx/bar.ts'
import('./modules/tsx/foo')

export * from './modules/tsx/foo'
export * as name from './modules/tsx'
export { foo } from './modules/tsx/foo'
