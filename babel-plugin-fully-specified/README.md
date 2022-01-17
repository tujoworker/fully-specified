# babel-plugin-fully-specified

Babel Plugin to transform your code to include the mandatory file extensions so your output gets fully-specified imports.

Example:

```diff
- import { Thing } from '/module'
+ import { Thing } from '/module/index.js'
```

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

...
