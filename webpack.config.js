import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default {
	entry: './esm/index.js',
	output: {
		filename: 'index.js',
	 path: resolve(dirname(fileURLToPath(import.meta.url)), 'dist/src'),
		library: {
			name: 'DxfParser',
			type: 'umd',
			export: 'DxfParser'
		},
		globalObject: 'typeof self !== \'undefined\' ? self : this'
	}
};
