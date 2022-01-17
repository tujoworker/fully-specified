// const { transformFileSync } = require('@babel/core')
import { transformFileSync } from '@babel/core'
import path from 'path'

describe('js', () => {
  const file = path.resolve(__dirname, './artifacts/module.js')

  let code = null
  beforeAll(() => {
    code = transformFileSync(file, {
      plugins: ['babel-plugin-fully-specified'],
    }).code
    console.log('code', code)
  })

  it('should', () => {
    expect(code).toMatchInlineSnapshot(`
"import mod from \\"./modules/foo.js\\";
import index from \\"./modules/index.js\\";"
`)
  })
})
