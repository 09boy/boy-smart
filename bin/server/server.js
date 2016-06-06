const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require('http-proxy-middleware');

const webpackConfig = require('../webpack/config.js');
const app = express();

require('shelljs/global');

var runPid;

const mock = function(projectConfig){

  const mockPath = path.join(projectConfig.ROOT_PATH,'mock.config.js');
  try{ fs.statSync(mockPath); }catch(e){ return; }

  const mock = require(mockPath);
  if(typeof mock !== 'array'){
    console.log('must be Array\n');
    return;
  }

  mock.map(function(obj){
    if(obj.proxy){
      app.use('/api',proxy({target:'http://www.example.org',changeOrigin: true}));
    }
  });
};

const serverObject = {
	start: function(projectConfig){
	
		console.log('env.MODE::: ', process.env.MODE);
		var serverRoute = '/',
				filePath = projectConfig.PROJECT_STRUCTURE.BUILD_DIR;
				isStart = process.env.MODE === 'development';
		// development mode
		if(isStart){
			const config = webpackConfig(projectConfig);
			const compiler = webpack(config);

			serverRoute = '*';
			app.use(webpackDevMiddleware(compiler,{
				publicPath: config.output.publicPath,
				noInfo: true,
				stats: {colors: true,cached: false}
			}));

			app.use(webpackHotMiddleware(compiler));
		}else if(process.env.MODE === 'test'){
			console.log(process.env.MODE,' server');

      //app.use(webpackDevMiddleware(webpack(require('../webpack/mocha.config.js'))))
		}

    app.use(express.static(path.join(projectConfig.ROOT_PATH,filePath)));
    
		//Mock
    mock(projectConfig);

		app.get(serverRoute,function(request,response){
			//response.sendFile(path.join(projectConfig.ROOT_PATH,filePath/*,'index.html'*/));
			response.sendFile(path.join(projectConfig.ROOT_PATH,filePath));
		});

		console.log('listening http://' + projectConfig.HOST + ':' + projectConfig.PORT);
		app.listen(projectConfig.PORT,projectConfig.HOST);
		exec('open http://' + projectConfig.HOST + ':' + projectConfig.PORT);
	}
};

module.exports = serverObject
