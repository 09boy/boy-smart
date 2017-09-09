const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');

const { existsSync, statSync, readdirSync } = require('fs');
const { ROOT_DIR, APP_ROOT_DIR } = require('../util/constant.js');

// for framework node_modules dir
const resolveModulesPath = ROOT_DIR + '/node_modules/';

const loaderPath = loaderName =>  (resolveModulesPath + loaderName);

const createEntryItem = (env, pagesDir, port, key = 'bundle') => ({ 
	[key]: env === 'dev' ? [
	resolveModulesPath + 'react-hot-loader/patch',
	resolveModulesPath + `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
	// resolveModulesPath + 'webpack/hot/only-dev-server',  // "only" prevents reload on syntax errors
	pagesDir] : pagesDir
});

const getDirectories = p => readdirSync(p).filter(f => statSync(`${p}/${f}`).isDirectory());

const getHtmlTemplate = (env, title, pagesDir, isSPA) => {
	const templatePath = isSPA ? `${pagesDir}/index.template.html` : `${pagesDir}/${title}/index.template.html`;
	const hasTemplateFile = existsSync(templatePath);
	const options = {title, hash: true};

	const isDev = env === 'dev';
	if (hasTemplateFile) {
		// options.inject = false;
		options.template = templatePath;
		options.excludeChunks = isDev ? [] : ['manifest'];
		options.minify = isDev ? {} : {
			removeComments: true,
			collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
		};
	}
	if (isSPA){
		// options.favicon = '' // from config
	} else {
		options.filename = `${title}.html`;
		options.chunks = ['common', title];
	}

	return new HtmlWebpackPlugin(options);
};

// html, entry, css
const util = (env, projectConfig) => {

	const { vendor, dev_structure_dir, port } = projectConfig;
	const { base, pages } = dev_structure_dir;
	const pagesDir = `${APP_ROOT_DIR}/${base}/${pages}`;
	const hasVendor = Array.isArray(vendor) && !!vendor.length;

	// if index file in root pages dir, it means the SPA app. otherwise it is multiple app.
	const isSPA = existsSync(pagesDir + '/index.js') || existsSync(pagesDir + '/index.jsx');
	let htmlPlugins = [], extractPlugins = [], entry;

	if (!isSPA) {
		const entries = {};
		dirs = getDirectories(pagesDir);
		dirs.map(name => {
			entries[name] = createEntryItem(env, pagesDir + '/' + name, port).bundle;
			htmlPlugins.push(getHtmlTemplate(env, name, pagesDir, isSPA));
			if (env !== 'dev') extractPlugins.push(new ExtractTextPlugin(`style.css`))
		});
		entry = entries;
	} else {
		entry = createEntryItem(env, pagesDir, port);
		htmlPlugins.push(getHtmlTemplate(env, 'Smart SPA', pagesDir, isSPA));
		if (env !== 'dev') {
			extractPlugins.push(new ExtractTextPlugin({
				filename: 'js/style.[chunkhash].css',
				// allChunks: false
			}));

			// Make sure this is after ExtractTextPlugin!
 			// extractPlugins.push(new PurifyCSSPlugin({
 			// 	paths: glob.sync(`${APP_ROOT_DIR}/${dev_structure_dir.base}/${dev_structure_dir.base.pages}/**/*.js`, { nodir: true }),
 			// 	// purifyOptions: {
    //  //    	whitelist: ['*purify*']
    //  //  	},
    //   	// moduleExtensions: ['.css', '.scss', '.less']
 			// }));
		}
	}

	if (hasVendor) {
		entry.vendor = vendor.map(lib => {return (APP_ROOT_DIR + '/node_modules/' + lib)});
	}

	const output = {
		path: `${APP_ROOT_DIR}/${projectConfig.build_dir}`,
		filename: env === 'dev' ? 'js/[name].js' : 'js/[name].[chunkhash].js',
		chunkFilename: env === 'dev' ? 'js/[name].js' : 'js/[name].[chunkhash].js',

		// if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
		publicPath: projectConfig.static[process.env.MODE],
	};

	return {
		entry,
		output,
		htmlPlugins,
		extractPlugins,
		isSPA
	};
};

module.exports = util;
