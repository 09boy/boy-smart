const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require('http-proxy-middleware');
const Mock = require('mockjs');

const webpackConfig = require('../webpack/config.js');
const app = express();

require('shelljs/global');

var runPid;

const mockAndProxy = function(projectConfig){ 

	return;
  const mockPath = path.join(projectConfig.ROOT_PATH,'mock.config.js');
  try{ fs.statSync(mockPath); }catch(e){ return; }

  const mock = require(mockPath);
  if(!(mock instanceof Array)){
    console.log('must be Array\n');
    return;
  }

  mock.map(function(obj){
    if(obj.proxy === 'true'){
      app.use(proxy(obj.context,obj.options));
    }else{

      app[obj.method || 'get'](obj.context, function(req, res) {
          var data = Mock.mock(obj.data);
          res.send(data);
      });
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

			//Mock
    	mockAndProxy(projectConfig);

		}else if(process.env.MODE === 'test'){
			console.log(process.env.MODE,' server');

      //app.use(webpackDevMiddleware(webpack(require('../webpack/mocha.config.js'))))
		}

    app.use(express.static(path.join(projectConfig.ROOT_PATH,filePath)));
    
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
