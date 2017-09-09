// 结构 [{path, method, data, proxyOption, filename}]
// 如果有 proxyOption 请根据 http-proxy-middleware 配置，将忽略path 以外参数
// 如果有 filename 忽略 data 属性，主要是在不使用 mockjs 情况下，
// 比如有时候为了测试省事，一大堆数据懒得模拟结构和类型直接从别的地方拷贝过来保存在一个js文件中，输出模块:
//  module.exports = {per_page: 1, total: 10, data: [{..,item}, ...] };
// 如果没有filename 将使用 data 作为相应数据返回给 request.
// 
/*
	三种方式
	[
		{ // 使用 mokejs 用data属性或者自定义数据
			path: '/api/login',
			method: 'post',
			data: {
				id: '@id',
				name: '@cname',
				data: '@date
			}
		},
		{ // 使用外部 js 文件导出的模块数据
			path: '/api/orgs',
			method: 'get',
			filename: '/your_dir_name/orgs.js'
		},
		{ // 使用代理
			proxyOption: { // ref: github.com/chimurai/http-proxy-middleware
				...config
			},
			path: '/api/acounts',
		}
	]
*/
module.exports = [];
