const webpack = require('webpack');

exports.plugins = [new webpack.HotModuleReplacementPlugin(),
									 new webpack.NoErrorsPlugin()
									];

exports.loaders = function(ENTRY_PATH,resolvePath){
	return [{ test: /\.jsx?$/, loader: resolvePath('babel-loader'), include: ENTRY_PATH, exclude: /node_modules/,
						// https://github.com/gaearon/babel-plugin-react-transform
						query: {
							presets: [resolvePath('babel-preset-es2015'),resolvePath('babel-preset-stage-0'),resolvePath('babel-preset-react')],
						  env: {
						  	// this plugin will be included only in development mode, e.g.
						  	// if NODE_ENV (or BABEL_ENV) environment variable is not set or is equal to 'development'
						    development: {
						      presets: [resolvePath('babel-preset-react-hmre')],
						      plugins: [
						      	// must be an array with options object as second item
						      	[resolvePath('babel-plugin-react-transform'),{
						      		// must be an array of objects
						      		transforms:[{
						      			// can be an NPM module name or a local path
						      			transform: resolvePath('react-transform-hmr'),
						      			// see transform docs for 'imports' and 'locals' dependences
						      			imports: ['react'],
						      			locals: ['module']
						      		}]
						      	},{
						      		// you can have many transforms, not just one
						      		transform: resolvePath('react-transform-catch-errors'),
						      		imports: ['react','redbox-react']
						      	}]
						      ]
						    }
						  }
						}
					}]
}