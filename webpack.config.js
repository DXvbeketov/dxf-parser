import { resolve, dirname } from 'path';

export default {
	entry: './esm/index.js',
	output: {
		filename: 'index.js',
		path: 'C:\\Users\\work\\Desktop\\work\\dxf-parser\\commonjs',
		library: {
			name: 'DxfParser',
			type: 'umd',
			export: 'DxfParser'
		},
		globalObject: 'typeof self !== \'undefined\' ? self : this'
	}
};
