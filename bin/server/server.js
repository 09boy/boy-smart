const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack/config.js');
const app = express();

require('shelljs/global');

var runPid;

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
		}else{
			app.use(express.static(path.join(projectConfig.ROOT_PATH,filePath)));
		}

		//Mock Server
		// var mockconfig_path = path.resolve(CWD, 'mock.js');
  //   if( fs.existsSync(mockconfig_path) ) {

  //       var data = require(path.resolve(CWD, 'mock.js'));
  //       if( !Array.isArray(data) ) {
  //           console.error('mock config data must be an array like these: \n');
  //       } else {

  //           data.map(function(item) {
  //               if( item.proxy ) {
  //                   app.use(proxy(item.path, {
  //                       target: item.proxy,
  //                       changeOrigin: item.changeOrigin !== false,
  //                       ws: item.ws !== false,
  //                       pathRewrite: item.pathRewrite 
  //                   }));
  //               } else {
  //                   var method = item.method || 'get';
  //                   app[method](item.path, function(req, res) {
  //                       var data = Mock.mock(item.data);
  //                       res.send(data);
  //                   });
  //               }
  //           });

  //       }
  //   }

		app.get(serverRoute,function(request,response){
			//response.sendFile(path.join(projectConfig.ROOT_PATH,filePath/*,'index.html'*/));
			response.sendFile(path.join(projectConfig.ROOT_PATH,filePath));
		});

		console.log('listening http://' + projectConfig.HOST + ':' + projectConfig.PORT);
		app.listen(projectConfig.PORT,projectConfig.HOST);
		exec('open http://' + projectConfig.HOST + ':' + projectConfig.PORT);
	},
	restart: function(projectConfig){
		//app.delete(projectConfig.PORT,projectConfig.HOST);
		//console.log(process.pid);
		//process.kill(1839);
		//runPid =  runPid || process.pid;
	
		//process.exit(1);
		//console.log(process);
	}
};

module.exports = serverObject



/*

module.exports = [{
    path: /\/apis/,
    method: 'get',
    data: function(options) {
        return [{ // response data
            id: 1,
            first: '@FIRST',
        }, {
            id: 2,
            first: '@FIRST',
        }, {
            id: 3,
            first: '@FIRST',
        }]
    }
}, {
    path: /\/api/,
    method: 'get',
    data: {
        'list|1-10': [{
            'id|+1': 1
        }]
    }
}, {
    path: '/proxy',
    proxy: 'http://example.proxy.com',
    pathRewrite: {
        '^/xyz': '/abc'
    }
}];



*/