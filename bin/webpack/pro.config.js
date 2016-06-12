const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

exports.plugins = function(buildPath,rootPath){

	return [// Cleanup the builds/ folder before
				  // compiling our final assets
				  new CleanPlugin([buildPath],{root: rootPath}),

				  // This plugin looks for similar chunks and files
					// and merges them for better caching by the user
				  new webpack.optimize.DedupePlugin(),

				  new webpack.optimize.OccurenceOrderPlugin(),


		      // This plugin prevents Webpack from creating chunks
		      // that would be too small to be worth loading separately
				  new webpack.optimize.MinChunkSizePlugin({
	      		minChunkSize: 51200, // ~50kb
	        }),

				  // This plugin minifies all the Javascript code of the final bundle
				  new webpack.optimize.UglifyJsPlugin({
						mangle: true,
					 	compress: {
							warnings: false
					 	}
				  })
				];
};



exports.loaders = function(ENTRY_PATH,resolvePath){
	return [{ test: /\.jsx?$/, loader: resolvePath('babel-loader'), include: ENTRY_PATH, exclude: /node_modules/,
						// https://github.com/gaearon/babel-plugin-react-transform
						query: {
							presets: [resolvePath('babel-preset-es2015'),resolvePath('babel-preset-stage-0'),resolvePath('babel-preset-react')]
						}
					}]
}