const { existsSync, readFileSync } = require('fs');
const proxy = require('http-proxy-middleware');
const Mock = require('mockjs');
//
// proxy middleware options
// const options = {
//   target: 'localhost:4000', // target host // http://www.example.org
//   changeOrigin: true,               // needed for virtual hosted sites
//   ws: true,                         // proxy websockets
//   // pathRewrite: {
//   //     '^/api/old-path' : '/api/new-path',     // rewrite path
//   //     '^/api/remove/path' : '/path'           // remove base path
//   // },
//   headers: {
//   	'Access-Control-Allow-Origin': 'http://localhost:3000',
// 		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
// 		'Access-Control-Allow-Headers': 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID',
//     'Access-Control-Allow-Credentials': 'true'
//   },
//   // router: {
//   //     // when request.headers.host == 'dev.localhost:3000',
//   //     // override target 'http://www.example.org' to 'http://localhost:8000'
//   //     'dev.localhost:3000' : 'http://localhost:8000'
//   // },

// //    onProxyRes: function (proxyRes, req, res) {
// //    	console.log('::::', req);
// // 		proxyRes.headers['Access-Control-Allow-Origin'] = '*';
// 	// }
// };

// const listData = {
//   // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//   'list|1-10': [{
//       // 属性 id 是一个自增数，起始值为 1，每次增 1
//       'id|+1': 1
//   }]
// };

const toProxy = (app, APP_ROOT_DIR, proxyApp) => {
  // app.use('/proxy', proxy(options));
  // proxyApp.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //   res.header("Access-Control-Allow-Headers", 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  //   next();
  // });

  // proxyApp.get('/api', function(req, res) {
  //     var data = Mock.mock(listData);
  //     console.log('GET Proxy', data);
  //     res.send(data);
  // });

  // app.get('/api/item', function(req, res) {
  //   const data = Mock.mock(listData);
  //   // console.log('GET', data);
  //   res.send(data);
  // });
  const path = APP_ROOT_DIR + '/mock.js'; 
  if (existsSync(path)) {
    const mockConfigData = require(path);
    Array.isArray(mockConfigData) && mockConfigData.map(item => {
      item.method = item.method || 'get';
      const { method, data, path, proxyOption, filename } = item;
      if (proxyOption) {
        app.use(path, proxy(options));
        return;
      }
      app[method](path, (req, res) => {
        let sendData = data;
        if (filename) sendData = require(APP_ROOT_DIR + filename);
        res.send(sendData);
      });
    });
  }
};

module.exports = toProxy;

