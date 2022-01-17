const { existsSync, lstatSync, exists } = require('fs')
const { resolve, extname, dirname } = require('path')
const {
  types: {
    importDeclaration,
    exportNamedDeclaration,
    exportAllDeclaration,
    stringLiteral,
  },
} = require('@babel/core')

const makeDeclaration = ({
  declaration,
  args,
  tryExtensions = [
    // List of all extensions which we try to find
    '.js',
    '.mjs',
    '.cjs',
  ],
}) => {
  return (
    path,
    {
      file: {
        opts: { filename },
      },
    }
  ) => {
    const { source, exportKind, importKind } = path.node
    const isTypeOnly = exportKind === 'type' || importKind === 'type'

    if (!source || isTypeOnly) {
      return // stop here
    }

    const module = source && source.value

    if (!isLocalFile(module)) {
      return // stop here
    }

    const srcDir = dirname(filename)
    const srcExt = extname(filename)
    const isDirectory = isLocalDirectory(resolve(srcDir, module))

    const targetModule = evaluateTargetModule({
      srcDir,
      srcExt,
      module,
      isDirectory,
      tryExtensions,
    })
    const currentModuleextension = extname(module)

    if (
      targetModule === false ||
      currentModuleextension === targetModule.extension
    ) {
      return // stop here
    }

    path.replaceWith(
      declaration(...args(path), stringLiteral(targetModule.module))
    )
  }
}

module.exports = (api, options) => {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: makeDeclaration({
        ...options,
        declaration: importDeclaration,
        args: ({ node: { specifiers } }) => [specifiers],
      }),
      ExportNamedDeclaration: makeDeclaration({
        ...options,
        declaration: exportNamedDeclaration,
        args: ({ node: { declaration, specifiers } }) => [
          declaration,
          specifiers,
        ],
      }),
      ExportAllDeclaration: makeDeclaration({
        ...options,
        declaration: exportAllDeclaration,
        args: () => [],
      }),
    },
  }
}

function isLocalFile(module) {
  return module.startsWith('.') || module.startsWith('/')
}

function isLocalDirectory(absolutesrcDir) {
  return (
    existsSync(absolutesrcDir) && lstatSync(absolutesrcDir).isDirectory()
  )
}

function evaluateTargetModule({
  module,
  isDirectory,
  srcDir,
  srcExt,
  tryExtensions,
}) {
  if (isDirectory) {
    module = `${module}/index`
  }

  const targetFile = resolve(srcDir, module)

  // 1. try first with same extension
  if (existsSync(targetFile + srcExt)) {
    return { module: module + srcExt, extension: srcExt }
  }

  // 2. then try with all others
  for (const extension of tryExtensions) {
    if (existsSync(targetFile + extension)) {
      return { module: module + extension, extension }
    }
  }

  return false
}
