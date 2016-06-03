const inquirer = require('inquirer');

const options = [
	{
		type: 'list',
		message: '选择需要的操作选项',
		name: 'task',
		choices: [
			{
				name: '启动项目',
				value: 'start'
			},
			{
				name: '单元测试',
				value: 'test'
			},
			{
				name: '预  发布',
				value: 'dev'
			},
			{
				name: '项目打包',
				value: 'release'
			},
			{
				name: '新建组件',
				value: 'component'
			},
			{
				name: '新建页面',
				value: 'page'
			}
		]
	}
];

const help = function(callback){
		callback = typeof callback === 'function' ? callback : function(answers){
			console.log(JSON.stringify(answers,null, '  '));
		};
		inquirer.prompt(options).then(callback);
};

module.exports = {help:help};