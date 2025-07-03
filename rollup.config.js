import { dts } from "rollup-plugin-dts"
const typescript = require('@rollup/plugin-typescript')
const terser = require('@rollup/plugin-terser')
const nodeResolve = require('@rollup/plugin-node-resolve')

const distDir = 'lib'
const dtsDir = 'dts'
const bundleName = 'confettis'

const banner = '/*\n'
	+ ' *\n'
	+ ' *  🎉 Confettis v' + process.env.npm_package_version + '\n'
	+ ' *  https://github.com/sizoroot/confettis\n'
	+ ' *\n'
	+ ' *  (c) ' + new Date().getFullYear() + ' Lucas O. S.\n'
	+ ' *  Confettis may be freely distributed under the MIT license.\n'
	+ ' *\n'
	+ '*/\n';

const config = {
	input: './src/index.ts',
	plugins: [
		typescript({
		    tsconfig: './tsconfig.json',
		})
	]
}

const createFiles = () => {

    if(process.env.NODE_ENV === 'cjs') {
    	config.output = {
    		file: `${distDir}/${bundleName}.js`,
    		format: 'cjs',
    		banner: banner
    	}
    }

    if(process.env.NODE_ENV === 'umd') {
    	config.output = {
    		file: `${distDir}/${bundleName}.umd.js`,
    		format: 'umd',
    		name: 'confetti',
    		banner: banner
    	}
    }

    if(process.env.NODE_ENV === 'esm') {
    	config.output = {
    		file: `${distDir}/${bundleName}.esm.js`,
    		format: 'esm',
    		banner: banner
    	}
    }

    if(process.env.NODE_ENV === 'minify') {
    	config.output = {
    		file: `${distDir}/${bundleName}.min.js`,
    		format: 'iife',
    		name: 'confetti'
    	}
    	config.plugins.push(nodeResolve({ browser: true }));
    	config.plugins.push(terser({}));
    }

    if(process.env.NODE_ENV === 'types') {
    	config.input = `./${distDir}/index.d.ts`,
    	config.output = {
    		file: `./${distDir}/types.d.ts`,
    		format: 'es',
    		banner: banner
    	}
        config.plugins = [dts()]
    }

}

createFiles()

export default config;
