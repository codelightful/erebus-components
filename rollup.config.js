import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-import-css';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/erebus-components.mjs',
    output: {
        file: './dist/erebus-components.min.js',
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
		css({
			output: 'erebus-components.min.css',
            minify: true
		}),
        babel({ 
            exclude: "node_modules/**",
            babelHelpers: 'bundled' 
        }),
		terser()
    ]
};