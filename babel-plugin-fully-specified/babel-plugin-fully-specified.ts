import { existsSync, readFileSync, lstatSync } from 'fs'
import { resolve, extname, dirname, relative } from 'path'
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
  handlePackageModules: boolean
  esExtensionDefault: string
  tryExtensions: Array<string>
  esExtensions: Array<string>
}

const makeDeclaration = ({
  declaration,
  makeNodes,
  ensureFileExists = false,
  handlePackageModules = true,
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

    let packageExtension: string

    if (!isLocalFile(module)) {
      const data = handlePackageModules && getPackageData(module)
      if (data && data.hasPath) {
        packageExtension = extname(data.packagePath)
      } else {
        return // stop here
      }
    }

    const filenameDirectory = dirname(filename)
    const filenameExtension = extname(filename)
    const isDirectory = isLocalDirectory(
      resolve(filenameDirectory, module)
    )

    const currentModuleExtension = extname(module)
    const targetModule = evaluateTargetModule({
      module,
      filenameDirectory,
      filenameExtension,
      packageExtension,
      currentModuleExtension,
      isDirectory,
      tryExtensions,
      esExtensions,
      esExtensionDefault,
      ensureFileExists,
    })

    if (
      targetModule === false ||
      currentModuleExtension === targetModule.extension
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

function getPackageData(module: string) {
  try {
    const packagePath = require.resolve(module)
    const parts = packagePath.split('/')

    let packageDir: string
    for (let i = parts.length; i >= 0; i--) {
      const dir = dirname(parts.slice(0, i).join('/'))
      if (existsSync(`${dir}/package.json`)) {
        packageDir = dir
        break
      }
    }

    const packageJson = JSON.parse(
      readFileSync(`${packageDir}/package.json`).toString()
    )

    const hasPath = !module.endsWith(packageJson.name)
    return { hasPath, packagePath }
  } catch (e) {}

  return false
}

function isLocalFile(module: string) {
  return module.startsWith('.') || module.startsWith('/')
}

function isLocalDirectory(absoluteDirectory: string) {
  return (
    existsSync(absoluteDirectory) &&
    lstatSync(absoluteDirectory).isDirectory()
  )
}

function evaluateTargetModule({
  module,
  currentModuleExtension,
  packageExtension,
  isDirectory,
  filenameDirectory,
  filenameExtension,
  tryExtensions,
  esExtensions,
  esExtensionDefault,
  ensureFileExists,
}) {
  if (packageExtension) {
    return {
      module: module + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  if (
    currentModuleExtension &&
    !esExtensions.includes(currentModuleExtension)
  ) {
    return false
  }

  if (
    isDirectory &&
    !existsSync(
      resolve(
        filenameDirectory,
        currentModuleExtension ? module : module + esExtensionDefault
      )
    )
  ) {
    module = `${module}/index`
  }

  const targetFile = resolve(filenameDirectory, module)

  if (ensureFileExists) {
    // 1. try first with same extension
    if (
      esExtensions.includes(filenameExtension) &&
      existsSync(targetFile + filenameExtension)
    ) {
      return {
        module: module + filenameExtension,
        extension: filenameExtension,
      }
    }

    // 2. then try with all others
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return { module: module + extension, extension }
      }
    }
  } else if (esExtensions.includes(filenameExtension)) {
    return {
      module: module + filenameExtension,
      extension: filenameExtension,
    }
  } else {
    return {
      module: module + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  return false
}
