import {nodeResolve} from "@rollup/plugin-node-resolve"
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: "./src/index.ts",
  output: [{
    file: "../public_html/js/bundle.js",
    format: "es",
    sourcemap: 'hidden'
  },
    {
      file: '../public_html/js/bundle.min.js',
      format: 'es',
      plugins: [terser()]
    }
  ],
  plugins: [nodeResolve(), commonjs(), typescript()]
}
