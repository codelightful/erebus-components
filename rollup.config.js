import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';
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
		scss({
			output: './dist/erebus-components.min.css',
			outputStyle: 'compressed'
		}),
        babel({ 
            exclude: "node_modules/**",
            babelHelpers: 'bundled' 
        }),
		terser()
    ]
};