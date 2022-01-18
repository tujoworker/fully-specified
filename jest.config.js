const path = require('path')

module.exports = {
  snapshotFormat: {
    printBasicPrototype: false,
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, './babel.config.js'),
      },
    ],
  },
}
