const rules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error'],
  'comma-dangle': ['error', 'only-multiline'],
  'brace-style': ['error', 'stroustrup'],
}

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules,
}
