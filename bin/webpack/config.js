const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new  ExtractTextPlugin('[name]-[hash].css');

const merge = require('../utils/utils.js').merge;
const resolvePath = require('../utils/utils.js').resolvePath;

require('shelljs/global');


const getConfig = function(smartConfig){

	const STRUCTURE = smartConfig.PROJECT_STRUCTURE;

	const ROOT_PATH = smartConfig.ROOT_PATH;
	const ENTRY_PATH = path.join(ROOT_PATH,STRUCTURE.SRC_DIR.NAME);
	const BUILD_PATH  = path.join(ROOT_PATH,STRUCTURE.BUILD_DIR);

	const envMode = process.env.MODE;

	const isDevelopment = envMode === 'development';
	// const isProduction = envMode === 'production';

	const prename = isDevelopment ? 'dev' : 'pro';
	const envConfig = require('./' + prename  + '.config.js');

  const plugins = [
		new webpack.DefinePlugin((function(){
           var global_defines =  {
                'process.env': {
                    'MODE': JSON.stringify(envMode),
                    'NODE_ENV': JSON.stringify(envMode),
                    'BABEL_ENV': JSON.stringify(envMode),
                }/*,
                'API': JSON.stringify(config.api[process.env.MODE]),
                'STATIC': JSON.stringify(config.static[process.env.MODE])*/
            };
           return global_defines;
        })()),
		new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js'),
		extractCSS
	];


	merge(plugins, envConfig.plugins);

	const loaders = [
		{ test: /\.css/, loader: extractCSS.extract(['css','style']), include: ENTRY_PATH, exclude: /node_modules/},
		{ test: /\.scss/, loader: extractCSS.extract(['css','sass']), include: ENTRY_PATH, exclude: /node_modules/}
	];

	merge(loaders, envConfig.loaders(ENTRY_PATH,resolvePath));

	// 页面 入口
	const multipleEntry = function(){

		const pagesPath = path.join(ROOT_PATH,STRUCTURE.SRC_DIR.NAME + '/' + STRUCTURE.SRC_DIR.PAGES_DIR);
		const pages = ls(pagesPath);
		const entrys = {
			vendors: smartConfig.vendors || [] // 'react', 'react-dom' common libs bundle
		};
		if(pages.length){

			pages.forEach(function(dirname){
				entrys[dirname] = isDevelopment ? [path.join(__dirname,'..','..','node_modules','webpack-hot-middleware') + '/client?reload=true',resolvePath('babel-polyfill'),pagesPath + '/' + dirname] : [ pagesPath + '/' + dirname];
				plugins.push(new HtmlWebpackPlugin({
					chunks:[dirname,'vendors','style'],
					filename: dirname + '.html',
					title: dirname + ' - SPA',
					template: path.join(__dirname,'..','templates','html','index.template.html')}
				));
			});
		
			return entrys;
		}

		// plugins.push(getHTMLTemplate({chunks:['bundle'],filename: 'index.html',template: path.join(__dirname,'..','templates','html','index.template.ejs')}));
		// entrys.bundle = ['webpack-hot-middleware/client?reload=true','babel-polyfill',ENTRY_PATH];
		// return entrys;
	};

	const common = {

		context: ROOT_PATH,
		debug: isDevelopment,
		devtool: isDevelopment ?'eval-source-map' : false,//'eval',//
		// https://github.com/glenjamin/webpack-hot-middleware/issues/78
		entry: multipleEntry(),

		output: {
			path: BUILD_PATH,
			filename:'[name]-[hash].js',
			publicPath: '/' // 'http://cdn.example.com/assets/[hash]'
		},
		plugins: plugins,
		module: {
			// 也许你想在写代码的时候检查自己的js是否符合jshint的规范，那么隆重推荐preLoaders和postLoaders，上一节我们已经非常了解loaders了，用它来处理各种类型的文件。perLoaders顾名思义就是在loaders执行之前处理的，webpack的处理顺序是perLoaders - loaders - postLoaders
			// babel-eslint ESLint 是前端JS代码检测利器。而 babel-eslint 则允许你检测所有的 Babel 代码
			// eslint JavaScript 语法检测利器：分析出你代码潜在的错误和非标准用法
			// eslint-plugin-react ESLint 中关于 React 语法检测的插件
			preLoaders: smartConfig.ESLINT ? [{
                test: /\.(js|jsx)$/,
                loader: resolvePath('eslint-loader'),
                include: ENTRY_PATH,
                exclude: /node_modules/
            }] : [],
			//https://zhuanlan.zhihu.com/p/20522487?refer=FrontendMagazine
			loaders: loaders
		},
		resolveLoader: {
			root: path.join(__dirname,'..','..','node_modules')
		},
		resolve: {
			root: ENTRY_PATH,
			//moduleDirectories: ['node_modules', 'bower_components'],
      extensions: ['', '.js', '.jsx','.scss','.css','.less']
  	},
  	eslint: {
  		configFile: path.join(__dirname,'..','..','.eslintrc')
  	}
	};

	return common;
};

module.exports = !process.env.MODE || process.env.MODE === 'development' ?  getConfig : getConfig(require('../utils/smart-config.js'));