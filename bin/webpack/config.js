const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new  ExtractTextPlugin('[name]-[hash].css');

require('shelljs/global');

// http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await  ES7 stage-0 

// https://github.com/gaearon/react-transform-hmr

// https://www.zhihu.com/question/41894686 工程化

// https://blog.madewithlove.be/post/webpack-your-bags/

// mocha 
// http://randycoulman.com/blog/2016/03/22/testing-with-mocha-and-webpack/
// http://stackoverflow.com/questions/32385219/mocha-tests-dont-run-with-webpack-and-mocha-loader/32386750#32386750
// https://www.npmjs.com/package/mocha-webpack

//Generate HTML
const getHTMLTemplate = function(obj){
		return new HtmlWebpackPlugin({
			chunks: obj.chunks || [],
			filename: obj.filename,
			title: obj.title || 'SPA | Single page application',
			template: obj.template,
			// inject: 'body'
			keywords: obj.keywords || 'SEO keywords',
			description: obj.description || 'SEO website\'s description',
			viewport: obj.viewport || null,	
			favicon: obj.favicon || null
		});
};

// resolve module path
const resolvePath = function (target){

	var queryStr = '',
			queryStart = target.indexOf('/');
	if(queryStart > -1){
		queryStr = target.substr(queryStart);
		target = target.substr(0,queryStart);
	}

	return require.resolve(target) + queryStr;
};

const configObject = function(smartConfig){

	const STRUCTURE = smartConfig.PROJECT_STRUCTURE;

	const ROOT_PATH = smartConfig.ROOT_PATH;
	const ENTRY_PATH = path.join(ROOT_PATH,STRUCTURE.SRC_DIR.NAME);
	const BUILD_PATH  = path.join(ROOT_PATH,STRUCTURE.BUILD_DIR);

	const envMode = process.env.MODE;
	const isDevelopment = envMode === 'development';
	const isProduction = envMode === 'production';

	const plugins = [new webpack.NoErrorsPlugin(),
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
	const loaders = [
		{ test: /\.jsx?$/, loader: resolvePath('babel-loader'), include: ENTRY_PATH, exclude: /node_modules/,
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
		},
		{ test: /\.css/, loader: extractCSS.extract(['css','style']), include: ENTRY_PATH, exclude: /node_modules/},
		{ test: /\.scss/, loader: extractCSS.extract(['css','sass']), include: ENTRY_PATH, exclude: /node_modules/}
	];

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
				plugins.push(getHTMLTemplate({chunks:[dirname,'vendors','style'],filename: dirname + '.html', title: dirname + ' - SPA',template: path.join(__dirname,'..','templates','html','index.template.html')}));
			});
		
			return entrys;
		}

		// plugins.push(getHTMLTemplate({chunks:['bundle'],filename: 'index.html',template: path.join(__dirname,'..','templates','html','index.template.ejs')}));
		// entrys.bundle = ['webpack-hot-middleware/client?reload=true','babel-polyfill',ENTRY_PATH];
		// return entrys;
	};
	const common = {

		context: ROOT_PATH,
		debug: !isProduction,
		devtool: isProduction ? false : 'eval-source-map',//'eval',//
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

	if(isDevelopment){
		plugins.push(new webpack.HotModuleReplacementPlugin());

	}else{

		process.env.NODE_ENV = 'test';
		common.output.filename = '[name]-[hash].js';
		common.output.chunkFilename = '[name]-[chunkhash].js';

		if(envMode === 'devel'){
		// 不压缩
		}else if(isProduction){
			
			process.env.NODE_ENV = 'production';

			// Cleanup the builds/ folder before
      // compiling our final assets
			plugins.push(new CleanPlugin(BUILD_PATH));

			// This plugin looks for similar chunks and files
      // and merges them for better caching by the user
      plugins.push(new webpack.optimize.DedupePlugin());

      plugins.push(new webpack.optimize.OccurenceOrderPlugin());

      // This plugin prevents Webpack from creating chunks
      // that would be too small to be worth loading separately
      plugins.push(new webpack.optimize.MinChunkSizePlugin({
      	minChunkSize: 51200, // ~50kb
      }));

			//plugins.push(new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js')); //manifest

			// This plugin minifies all the Javascript code of the final bundle
			plugins.push(new webpack.optimize.UglifyJsPlugin({
				mangle: true,
				compress: {
					warnings: false
				}
			}));
		}
	}
	return common;
};

module.exports = !process.env.MODE || process.env.MODE === 'development' ?  configObject : configObject(require('../utils/smart-config.js'));
