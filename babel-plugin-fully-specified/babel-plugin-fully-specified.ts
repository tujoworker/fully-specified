import { existsSync, lstatSync } from 'fs'
import { resolve, extname, dirname } from 'path'
import {
  importDeclaration,
  exportNamedDeclaration,
  exportAllDeclaration,
  stringLiteral,
} from '@babel/types'

import type { ConfigAPI, NodePath, PluginPass } from '@babel/core'
import type {
  ImportSpecifier,
  ImportDeclaration,
  ExportAllDeclaration,
  StringLiteral,
  ExportSpecifier,
  ExportDeclaration,
  ExportNamedDeclaration,
} from '@babel/types'

type ImportDeclarationFunc = (
  specifiers: Array<ImportSpecifier>,
  source: StringLiteral
) => ImportDeclaration

type ExportNamedDeclarationFunc = (
  declaration?: ExportDeclaration,
  specifiers?: Array<ExportSpecifier>,
  source?: StringLiteral
) => ExportNamedDeclaration

type ExportAllDeclarationFunc = (
  source: StringLiteral
) => ExportAllDeclaration

type PathDeclaration = NodePath & {
  node: ImportDeclaration & ExportNamedDeclaration & ExportAllDeclaration
}

interface FullySpecifiedOptions {
  declaration:
    | ImportDeclarationFunc
    | ExportNamedDeclarationFunc
    | ExportAllDeclarationFunc
  makeNodes: (path: PathDeclaration) => Array<PathDeclaration>
  ensureFileExists: boolean
  esExtensionDefault: string
  tryExtensions: Array<string>
  esExtensions: Array<string>
}

const makeDeclaration = ({
  declaration,
  makeNodes,
  ensureFileExists = false,
  esExtensionDefault = '.js',
  tryExtensions = [
    // List of all extensions which we try to find
    '.js',
    '.mjs',
    '.cjs',
  ],
  esExtensions = [
    // List of extensions that can run in Node.js or in the Browser
    '.js',
    '.mjs',
    '.cjs',
  ],
}: FullySpecifiedOptions) => {
  return (
    path: PathDeclaration,
    {
      file: {
        opts: { filename },
      },
    }: PluginPass
  ) => {
    const { source } = path.node

    if (!source) {
      return // stop here
    }

    const { exportKind, importKind } = path.node
    const isTypeOnly = exportKind === 'type' || importKind === 'type'
    if (isTypeOnly) {
      return // stop here
    }

    const { value: module } = source

    if (!isLocalFile(module)) {
      return // stop here
    }

    const srcDir = dirname(filename)
    const srcExt = extname(filename)
    const isDirectory = isLocalDirectory(resolve(srcDir, module))

    const currentModuleextension = extname(module)
    const targetModule = evaluateTargetModule({
      srcDir,
      srcExt,
      module,
      currentModuleextension,
      isDirectory,
      tryExtensions,
      esExtensions,
      esExtensionDefault,
      ensureFileExists,
    })

    if (
      targetModule === false ||
      currentModuleextension === targetModule.extension
    ) {
      return // stop here
    }

    const nodes = makeNodes(path)

    path.replaceWith(
      declaration.apply(null, [
        ...nodes,
        stringLiteral(targetModule.module),
      ])
    )
  }
}

export default function FullySpecified(
  api: ConfigAPI,
  options: FullySpecifiedOptions
) {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: makeDeclaration({
        ...options,
        declaration: importDeclaration,
        makeNodes: ({ node: { specifiers } }) => [specifiers],
      }),
      ExportNamedDeclaration: makeDeclaration({
        ...options,
        declaration: exportNamedDeclaration,
        makeNodes: ({ node: { declaration, specifiers } }) => [
          declaration,
          specifiers,
        ],
      }),
      ExportAllDeclaration: makeDeclaration({
        ...options,
        declaration: exportAllDeclaration,
        makeNodes: () => [],
      }),
    },
  }
}

function isLocalFile(module: string) {
  return module.startsWith('.') || module.startsWith('/')
}

function isLocalDirectory(absolutesrcDir: string) {
  return (
    existsSync(absolutesrcDir) && lstatSync(absolutesrcDir).isDirectory()
  )
}

function evaluateTargetModule({
  module,
  currentModuleextension,
  isDirectory,
  srcDir,
  srcExt,
  tryExtensions,
  esExtensions,
  esExtensionDefault,
  ensureFileExists,
}) {
  if (
    currentModuleextension &&
    !esExtensions.includes(currentModuleextension)
  ) {
    return false
  }

  if (
    isDirectory &&
    !(
      existsSync(resolve(srcDir, module)) &&
      existsSync(resolve(srcDir, module + esExtensionDefault))
    )
  ) {
    module = `${module}/index`
  }

  const targetFile = resolve(srcDir, module)

  if (ensureFileExists) {
    // 1. try first with same extension
    if (esExtensions.includes(srcExt) && existsSync(targetFile + srcExt)) {
      return { module: module + srcExt, extension: srcExt }
    }

    // 2. then try with all others
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return { module: module + extension, extension }
      }
    }
  } else if (esExtensions.includes(srcExt)) {
    return {
      module: module + srcExt,
      extension: srcExt,
    }
  } else {
    return {
      module: module + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  return false
}
