const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const PurifyCSSPlugin = require('purifycss-webpack');
// const glob = require('glob');

const DashboardPlugin = require('webpack-dashboard/plugin');

const HappyPack = require('happypack');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

const { ROOT_DIR, APP_ROOT_DIR } = require('../util/constant.js');

const isVendor = ({ resource }) =>( resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/) );

const bundleCommonSplitting = (vendor) => {
	return vendor && !!vendor.length ? new webpack.optimize.CommonsChunkPlugin({names: ['vendor', 'manifest'],
		minChunks: Infinity, // Infinity tells webpack not to move any modules to the resulting bundle.
	}) : new webpack.optimize.CommonsChunkPlugin({name: 'manifest', minChunks: Infinity,}); 
};

const definePlugin = (env, projectConfig) => {
	const { /*api, */globals } = projectConfig;
	const global_defines =  {
    'process.env': {
      MODE: JSON.stringify(process.env.MODE),
      NODE_ENV: JSON.stringify(env === 'dev' ? 'development' : 'production'),
    },
    // 'API': api ? JSON.stringify(api[process.env.MODE]) : null,
    'STATIC': JSON.stringify(projectConfig.static[process.env.MODE])
  };

  for(let global in globals) {
    global_defines[global.toUpperCase()] = JSON.stringify(globals[global][process.env.MODE])
  }

	return new webpack.DefinePlugin(global_defines);
};

const babili  = (option = {}) => (new BabiliPlugin(option));

// css
const minifyCSS = () => (new OptimizeCSSAssetsPlugin({
  cssProcessor: cssnano,
  cssProcessorOptions: {
  	discardComments: {
      removeAll: true,
    },
    // Run cssnano in safe mode to avoid
    // potentially unsafe transformations.
    safe: true,
  },
  canPrint: false,
}));

// html

//
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const happyack = (option = {}) => {
	const newOption = Object.assign({}, {
	id: 'jsx',
  threads: 4, //happyThreadPool,
  loaders: [ 'babel-loader' ]}, option);
  return new HappyPack(newOption)

};

const dllReference = (path) => (new webpack.DllReferencePlugin({
	manifest: path,
	/*name: './my-dll.js',
	scope: 'xyz',
	sourceType: 'commonsjs2'*/
}));

const commonPlugins = (env, projectConfig) => {
	const { build_dir, vendor, provide } = projectConfig;
	return [
		new CleanWebpackPlugin([build_dir], { root: APP_ROOT_DIR}),

		definePlugin(env, projectConfig),

		bundleCommonSplitting(vendor),

		new webpack.ProvidePlugin(provide || {}),

		// new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),

    // new CopyWebpackPlugin([ { from: APP_ROOT_DIR + '/vendor.js', to: 'js' }]),
	];
};

const prodPlugins = () => {
	return [
		new WebpackMd5Hash(),
		new webpack.optimize.CommonsChunkPlugin({
      filename: 'js/commons-[chunkhash].js',
      children: true,
      minSize: 10 * 1024, // 10k
      minChunks: 2
    }),

		// ...envModePlugins,

		new webpack.optimize.AggressiveMergingPlugin(),

		new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),
	];
};

const devPlugins = () => {
	return [
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		new webpack.NoEmitOnErrorsPlugin(),

		// not work  https://www.npmjs.com/package/webpack-dashboard
    // new DashboardPlugin({port: 3000}),
	];
};


module.exports = {
	commonPlugins,
	prodPlugins,
	devPlugins,
	minifyCSS,
	happyack,
	babili,
	dllReference,
};
