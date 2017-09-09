const { existsSync, statSync, readdirSync } = require('fs');
const express = require('express');
const proxy = require('./proxy');
const { APP_ROOT_DIR } = require('../util/constant.js');
const app = express();

const getDirectories = p => readdirSync(p).filter(f => statSync(`${p}/${f}`).isDirectory());

const development = (projectConfig, options) => {
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpack = require('webpack');
	//
	const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
	// const webpackConfig = require(`../webpack/${env}.config.js`)(env, projectConfig, options);
	const webpackConfig = require(`../webpack/config.js`)(env, projectConfig, options);

	const compiler = webpack(webpackConfig);
	
	const publicPath = webpackConfig.output ? webpackConfig.output.publicPath : webpackConfig[webpackConfig.length - 1].output.publicPath;

	app.use(webpackDevMiddleware(compiler, {
		noInfo: false,

		hot: true,
		
		stats: {
			colors: true,
			hash: false,
		},

		overlay: {
	 	 	warnings: true,
	  	errors: true
		},
		
		lazy: false,

		watchOptions: {
			aggregateTimeout: 300,
			poll: true,
			ignored: /node_modules/
		},
		// watch options (only lazy: false)
		// inline: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
    	'Access-Control-Allow-Headers': 'X-Requested-With'
		},

		historyApiFallback: true,

		publicPath,
	}));

	app.use(webpackHotMiddleware(compiler, {
		log: false,
		hearbeat: 2000,
	}));

	return compiler;
};

const start = (projectConfig, options = {}, onlyServer = true) => {
	
	const { host, port, build_dir, dev_structure_dir } = projectConfig;
	const _port = options.port || port, _host = options.host || host;
	const buildDir = `${APP_ROOT_DIR}/${build_dir}`;

	const { base, pages } = dev_structure_dir;
	const pagesDir = `${APP_ROOT_DIR}/${base}/${pages}`;
	const isSPA = existsSync(pagesDir + '/index.js') || existsSync(pagesDir + '/index.jsx');

	let compiler;

	app.use(express.static(buildDir));
	proxy(app, APP_ROOT_DIR);

	if (!onlyServer) {
		projectConfig.port = _port;
		compiler = development(projectConfig, options);
		const targetCompiler = !compiler.compilers ? compiler : compiler.compilers[compiler.compilers.length - 1];
		const filename = targetCompiler.outputPath + '/index.html';
		// https://github.com/jantimon/html-webpack-plugin/issues/145
		if (isSPA) app.use('*', (req, res, next) => {
		  targetCompiler.outputFileSystem.readFile(filename, function(err, result){
		    if (err) {
		      return next(err);
		    }
		    //
		    res.set('content-type','text/html');
		    res.send(result);
		    res.end();
		  });
		});
	} else if (onlyServer) {
		app.use('*', (req, res, next) => {
			res.sendFile(buildDir);
		});
	}

	return app.listen(_port, () => {
		console.log(`Listening on port ${_port}!`);
	});
};

module.exports = { start };
