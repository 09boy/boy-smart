const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (context, vendor) => {
	// empty or undefined will to return false;
	if (!vendor || (typeof vendor === 'object' && Object.keys(vendor).length === 0)) return false;

	let entry = {vendor};
	if (!Array.isArray(vendor)) {
		entry = {};
		for (let key in vendor) {
			entry[key] = vendor[key];
		}
	}

	const dllRefNames = Object.keys(entry);
	const dllName = 'smart-dll';

	const dllConfig = {
		context,

		name: dllName,

		entry,

		output: {
			path: context,
			filename: '[name].js',
			library: '[name]_[hash]',
		},

		plugins: [
			new webpack.DllPlugin({
				name: '[name]_[hash]',
				path: context + '/manifest.[name].json',
			}),
			new BabiliPlugin(),
			// new UglifyJSPlugin({
			// 	except: ['$super', '$', 'exports', 'require']
			// }),
		]
	};

	return {
		dllConfig,
		dllName,
		dllRefNames,
	};
};
