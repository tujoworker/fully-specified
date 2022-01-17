const path = require('path')

module.exports = {
  snapshotFormat: {
    printBasicPrototype: false,
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, './babel.config.js'),
      },
    ],
  },
  transformIgnorePatterns: ['node_modules'],
}
