import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
    input: 'src/erebus-components.mjs',
    output: {
        file: pkg.browser,
        format: 'umd',
        name: 'Erebus',
        sourcemap: true
    },
    watch: {
        exclude: 'node_modules/**',
        include: './src/**'
    },
    plugins: [
        resolve(),
		scss({
			output: './dist/erebus-components.min.css',
			outputStyle: 'compressed'
		}),
		json(),
        babel({ 
            exclude: "node_modules/**",
            babelHelpers: 'bundled' 
        }),
		terser()
    ]
};