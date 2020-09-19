import path from 'path'
import license from 'rollup-plugin-license'
import ts from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'

const pkg = require('../package.json')

function bundle (format) {
  const file = `dist/${pkg.name}.${format}.js`
  return {
    input: 'src/index.ts',
    output: {
      file,
      format,
    },
    external: [
      'jest-chrome',
      'jest',
    ],
    plugins: [
      license({
        banner: {
          content: {
            file: path.join(__dirname, 'banner.txt'),
          },
        },
      }),
      ts({
        typescript: ttypescript,
        cacheRoot: 'build/.rpt2_cache',
        check: format === 'es',
        tsconfigOverride: {
          compilerOptions: {
            declaration: format === 'es',
            target: 'es5',
          },
          exclude: ['tests'],
        },
      }),
    ],
  }
}

export default [
  bundle('cjs'),
  bundle('es'),
]
