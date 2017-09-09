const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { ROOT_DIR, APP_ROOT_DIR } = require('../util/constant.js');
// for framework node_modules dir
const resolveModulesPath = ROOT_DIR + '/node_modules/';
const loaderPath = loaderName =>  (resolveModulesPath + loaderName);

const babelOptions = (env, projectMode) => {
	const option = { 
		babelrc: false,
		compact: false,
		// cacheDirectory: env === 'dev',
		env: {development: {plugins:[]}, production: {presets: [], plugins: []}},
		presets: [[require('babel-preset-env'), {
			loose: true,
      modules: false,
      browsers: 'last 1 Chrome version',
      // targets: {
      //   browsers: ['last 2 Chrome versions']
      //  },
		}],
		require('babel-preset-stage-0'),
		],
		plugins: [
			require('babel-plugin-transform-decorators-legacy').default, // https://github.com/babel/babel/pull/2697
			require('babel-plugin-transform-class-properties'),
			require('babel-plugin-transform-object-rest-spread'),
			require('babel-plugin-syntax-dynamic-import'),
			require('babel-plugin-transform-export-extensions'),

			// require('babel-plugin-add-module-exports'), // if remove babel-preset-es2015 will get a error of 'exports'.
			
			[require('babel-plugin-transform-runtime'), {
				helpers: false,
				polyfill: false,
				regenerator: true,
				moduleName: 'babel-runtime'
			}],
			/*[require('babel-plugin-import'), {
				libraryName: 'antd',
				style: 'css'
			}],*/
		]
	};

	if (projectMode === 'react') {
		// option.env.production.plugins.push([require('babel-plugin-transform-react-remove-prop-types'), {
		// 	mode: 'wrap',
  //     ignoreFilenames: ['node_modules'],
		// }]);
		// option.env.development.plugins.push(require('react-hot-loader/babel'));
		option.presets.push(require('babel-preset-react'));
	}

	return option;
};

const postCss = (env) => ({
	loader: loaderPath('postcss-loader'),
  options: {
  	sourceMap: env === 'dev',
  	// exec: true, // If  you use JS styles without the postcss-js parser, add the exec option.
  	// parser: 'sugarss',
    plugins: () => ([ // https://github.com/postcss/postcss
      // require(loaderPath('autoprefixer', {browsers: ['ie >= 8', 'last 2 versions'],}))(),
      require('postcss-cssnext')(), //allows you to use future CSS features today (includes autoprefixer).
      require('precss'), //contains plugins for Sass-like features, like variables, nesting, and mixins.
    ])
  },
});

const getBaseStyle = (env, otherDevLoaderOptions = [], otherProLoaderOptions = []) => {
	if (env === 'dev') { // development
		return [
			{loader: loaderPath('style-loader')},
			{loader: loaderPath('css-loader'), 
				options: {sourceMap: true,
					importLoaders: 1 + otherDevLoaderOptions.length
				}
			},
			postCss(env),
	    ...otherDevLoaderOptions,
		];
	}

	return ExtractTextPlugin.extract({
	  	fallback: loaderPath('style-loader'),
	  	// resolve-url-loader may be chained before sass-loader if necessary
	  	use: [
	  	{loader: loaderPath('css-loader'), options: {
	  		/*modules: true,*/
	  		// localIdentName: 'purify_[hash:base64:5]',
	  		importLoaders: 1 + otherProLoaderOptions.length,
	  		minimize: true
	  	}},
	  	postCss(env),
	    ...otherProLoaderOptions,
  	]
  });
};

const getSassLoader = (env) => getBaseStyle(env, [
	{
	  loader: loaderPath('sass-loader'),
	  options: {
	    // includePaths: [],
	    sourceMap: true
	  }
	}
], [loaderPath('sass-loader')]);

const getLessLoader = (env) => getBaseStyle(env, [
	{loader: loaderPath('less-loader'), options: {sourceMap: true}},
],[loaderPath('less-loader')]);


const babelLoader = (env, mode) => {
	const loader = {
		test: /\.jsx?$/,
		include,
		exclude,
		use:[
			{
				loader: loaderPath('babel-loader'),
				options: babelOptions(env, mode)
			}
		],
	};
	if (env !== 'dev' && mode == 'react') {
		loader.use.push({
			loader: 'async-auto-loader',
			options: {
				pages: 'pages',
				mode
			}
		});
	}
	return loader;
};

const happypackLoader = (options={id: 'jsx'}) =>({
	test: /\.jsx?$/,
	include,
	exclude,
	// use:{
		loader: loaderPath('happypack/loader'),
		options
	// },
});

let exclude, include;

module.exports = (env, projectConfig/*, projectMode*/) => {
	const { dev_structure_dir, base64_image_limit } = projectConfig;
	const SOURCE_DIR = `${APP_ROOT_DIR}/${dev_structure_dir.base}`;
	exclude = /(node_modules|bower_components)/;
	include = SOURCE_DIR;

	return {
		babelOptions,
		happypackLoader,
		babelLoader,
		loaderPath,
		rules: [
			// {
			// 	test: /\.(js|jsx)$/,
			// 	include,
			// 	exclude,
			// 	use:{
			// 		loader: loaderPath('babel-loader'),
			// 		options: babelOptions(env, projectMode.mode)
			// 	},
			// },
			{
				test: /\.vue$/,
				include,
				exclude,
				use: {
					// https://vue-loader.vuejs.org/en/options.html#loaders
					loader: loaderPath('vue-loader'),
					options: {
						loaders: {
							js: `${loaderPath('babel-loader')}?presets[]=${loaderPath('babel-preset-stage-0')}`
						}
					}
				}
			},
			{
				test: /\.css$/,
				// include,
				// exclude,
				use: getBaseStyle(env),
			},
			{
				test: /\.less$/,
				include,
				exclude,
				use: getLessLoader(env),
			},
			{
				test: /\.scss$/,
				include,
				exclude,
				use: getSassLoader(env),
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				include,
				exclude,
				use: [
					{
						loader: loaderPath('url-loader'),
						options: {
							name: dev_structure_dir.assets + '/images/[name].[hash].[ext]',
							limit: base64_image_limit
						}
					},
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				include,
				exclude,
				use: [
					{
						loader: loaderPath('file-loader'),
						options: {
							name: '[name].[hash].[ext]',
							publicPath: projectConfig.static[process.env.MODE],
							outputPath: dev_structure_dir.assets + '/fonts/'
						}
					},
				]
			}
		],
	};
};
