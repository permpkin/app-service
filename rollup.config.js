import typescript from 'rollup-plugin-typescript'
import replace from 'rollup-plugin-replace'
// plugin needs updating.
// import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator'
import minify from 'rollup-plugin-babel-minify'
import run from 'rollup-plugin-run'

/**
 * @description Production Config
 */
const __production = [
  typescript({lib: ['es5', 'es6', 'dom'], target: 'es5'}),
  replace({
    ENVIRONMENT: JSON.stringify('production')
  }),
  minify({
    comments: false,
    sourceMap: false
  })
  // obfuscatorPlugin({
  //   compact: true
  // })
]

/**
 * @description Development Config
 */
const __development = [
  typescript({lib: ['es5', 'es6', 'dom'], target: 'es5'}),
  replace({
    ENVIRONMENT: JSON.stringify('development')
  }),
  // obfuscatorPlugin({
  //   compact: true,
  //   sourceMap: true,
  //   sourceMapMode: 'inline'
  // }),
  run()
]

export default {
  input: './src/main.ts',
  plugins: process.env.NODE_ENV === 'production' ? __production : __development,
  watch: {
    exclude: ['node_modules/**']
  },
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
}