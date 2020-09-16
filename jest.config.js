/* eslint-env node */

const hq = require('alias-hq')

module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },

  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],

  coverageDirectory: 'tests/coverage',

  moduleNameMapper: hq.get('jest'),

  setupFilesAfterEnv: [
    './tests/setup.js'
  ]
}
