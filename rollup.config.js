/* eslint-env node */

import hq from 'alias-hq'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'

function output (format) {
  return {
    dir: 'dist/',
    file: `dist/index.${format}.js`,
    format,
    sourcemap: true,
  }
}

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      alias({
        entries: hq.get('rollup')
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      json(),
    ],
  },
]
