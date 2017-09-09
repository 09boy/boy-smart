const { existsSync, readFileSync } = require('fs');
const { ROOT_DIR, APP_ROOT_DIR, RECORD_LOG_PATH } = require('../util/constant.js');
// const dllConfigs = require('./dll.config.js');
const util = require('./util.js');
const loaderPart = require('./loader.part.js');
const { commonPlugins, prodPlugins, devPlugins, minifyCSS, babili, dllReference } = require('./plugin.part.js');

module.exports = (env, projectConfig, projectMode) => {
	// console.log('dev env:::', env, process.env.NODE_ENV);
	
	if (projectConfig.build_dir === undefined) {
		const data = readFileSync(RECORD_LOG_PATH, 'utf8');
		if (!data || Object.keys(data).length === 0) return null; // Error: reading smart config file is fail.

		/**
		 * smartConfig = projectConfig
		 * mode = projectMode.mode
		 */
		const { smartConfig, mode } = JSON.parse(data)[APP_ROOT_DIR];
		projectConfig = smartConfig;
		projectMode = {mode};
	}

	const isDev = env === 'dev';
	const { rules, babelOptions, happypackLoader, babelLoader, loaderPath } = loaderPart(env, projectConfig);
	const { vendor, api, globals, devtool, extensions, resolve_alias, build_dir, dev_structure_dir } = projectConfig;
	const { entry, output, isSPA, htmlPlugins, extractPlugins } = util(env, projectConfig);
	// const { dllConfig, dllName, dllRefNames } = dllConfigs(APP_ROOT_DIR, vendor);
	const SOURCE_DIR = `${APP_ROOT_DIR}/${dev_structure_dir.base}`;
	// const dllPath = APP_ROOT_DIR + `/manifest.${dllRefNames[0]}.json`;
	// const hasDellFile = existsSync(dllPath);

	// console.log('hasDellFile:::', hasDellFile);
	let plugins = [...commonPlugins(env, projectConfig), ...htmlPlugins, ...extractPlugins]; 

	let devtoolValue = devtool;
	
	rules.push(babelLoader(env, projectMode.mode));

	if (!isDev) {
		switch (process.env.MODE) {
			case 'pro':
			case 'gray':
				devtoolValue = 'source-map';
				plugins.push(babili(), minifyCSS());
				break;
			case 'release':
				devtoolValue = false;
				plugins.push(babili({removeConsole: true, removeDebugger: true}), minifyCSS());
				break;
			// case 'dev':
			default:
				break;
		};
	}
	
	const mainConfig = {
		name: 'main',
		// the base path which will be used to resolve entry points
		context: APP_ROOT_DIR, //ROOT_DIR,

		// dependencies: [dllName],

		entry,

		output,

		devtool: devtoolValue,

		module: {
			// since webpack 3.0.0
			// noParse: (content) => (/jquery|lodash/.test(content)),
			rules,
		},

		resolveLoader: {
			modules: [ROOT_DIR + '/node_modules', ROOT_DIR + '/'],
			alias: {
				'async-loader':  ROOT_DIR + '/loaders/async-loader/index.js',
				'async-auto-loader': ROOT_DIR + '/loaders/async-auto-loader/index.js'
			}
		},

		resolve: {
			modules: ['node_modules', 'bower_components', SOURCE_DIR],
			extensions: [...extensions],
			alias: resolve_alias || {},
			aliasFields: [],
		},

		plugins: isDev ? [...plugins, ...devPlugins()] : [...plugins, ...prodPlugins()],
	};

	// 下一版本优化
	// let config = [dllConfig, mainConfig];
	// if (hasDellFile) {
	// 	plugins.push(dllReference(dllPath));
	// 	config = mainConfig; 
	// }
	// dllConfig.output.publicPath = mainConfig.output.publicPath;
	return mainConfig;
};