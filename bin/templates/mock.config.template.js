// example  [ * 必填参数] 
module.exports = [
	// proxy structure
	{
		proxy: 'true',      							   // [*] value is string that it is 'true' or 'false'.             
		context: '/proxy-api',							 // [*]
		options: {
			target: 'http://www.example.com',  // [*] target host
			changeOrigin: true,                // needed for virtual hosted sites | for vhosted sites, changes host header to match to target's host
			ws: true,                          // proxy websockets
			logLevel: 'debug',
			// pathRewrite: {
			// 	'^/old/api' : '/new/api',        // rewrite path
			// 	'^/remove/api' : '/api'          // remove path
			// },
			// proxyTable: {
			// 	// when request.headers.host == 'dev.localhost:3000'
			// 	// override target 'http://www.example.com' to 'http://localhost:8000'
			// 	'dev.localhost:3000' : 'http://localhost:8000'
			// }
		}
	},
	// mock structure
	{
		method: 'get',                        // [*] get or post
		context: '/api', 											// [*]
		data: {                               // [*] mock data template
			'list|1-10' : [{
				'id|+1' : 1
			}]
		}                               
	}
];