import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/erebus-components.mjs',
    output: {
        file: './dist/erebus-components.min.js',
        format: 'umd',
        name: 'Erebus',
        sourcemap: true,
        plugins: [
            terser()
        ]
    },
    watch: {
        exclude: 'node_modules/**',
        include: './src/**'
    },
    plugins: [
        resolve(),
		postcss({
			extensions: ['.css']
		}),
		json(),
        babel({ 
            exclude: "node_modules/**",
            babelHelpers: 'bundled' 
        })
    ]
};