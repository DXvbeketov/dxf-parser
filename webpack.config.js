import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default {
	entry: './esm/index.js',
	output: {
		filename: 'index.js',
	 path: resolve(dirname(fileURLToPath(import.meta.url)), 'dist'),
		library: {
			name: 'ted-dxf-parser',
			type: 'umd',
			export: 'ted-dxf-parser'
		},
		globalObject: 'typeof self !== \'undefined\' ? self : this'
	}
};
