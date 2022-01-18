# babel-plugin-fully-specified

Babel Plugin to transform your code to include the mandatory file extensions so your output gets fully-specified imports.

For who is this?

- 📚 Component Library authors
- 📦 NPM Package authors
- 🛠 Tooling authors

🍀 Basically for everyone who uses `"type": "module"` in their `package.json` – 🌈 but don't want to rewrite all their import paths to include e.g. `/index.js` or extension at all.

It will transform like this:

```diff
- import { Thing } from '/path'
+ import { Thing } from '/path/index.js'
```

**NB:** Dynamic imports are currently not support!

## Install

```bash
npm install babel-plugin-fully-specified
# or
yarn add babel-plugin-fully-specified
```

… and add it to your [Babel Plugins](https://babeljs.io/docs/en/plugins/) `.babelrc` (`babel.config.js`):

```diff
{
  "plugins": [
+    "babel-plugin-fully-specified"
  ]
}
```

## Plugin Options

As of now, no options are available.

## More details

ESM requires with the [Mandatory file extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions), that all imports includes its file extension. Traditionally, its very common to omit it, especially when it comes to `/index` imports.

✨ Now, this is something the **author of a package** has to take care of – not you as a web page/app developer.

> ... failed to resolve only because it was resolved as fully specified
> (probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '_.mjs' file, or a '_.js' file where the package.json contains '"type": "module"').
> The extension in the request is mandatory for it to be fully specified.
> Add the extension to the request.

If you see this 👆 – ask the **author of a package** to make their build pipeline fully specified, by e.g. include `babel-plugin-fully-specified`.

This mono-repo will contain certain tools/packages to help you transform existing code during build.

```diff
- import { Thing } from '/path'
+ import { Thing } from '/path/index.js'
```

### Contribution

Right now, only a [Babel](https://babeljs.io) exists – but an ESLint Plugin would be nice to have as well.
