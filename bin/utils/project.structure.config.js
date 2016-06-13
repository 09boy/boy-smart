const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const smartConfig = require('./smart-config.js');
const structure = smartConfig.PROJECT_STRUCTURE;
const src = structure.SRC_DIR;

require('shelljs/global');


/*
	{
		type: 'input',
		name: 'port',
		message: '默认端口',
		validate: function(){ return true}
	},
	{
		type: 'input',
		name: 'host',
		message: '默认主机',
		validate: function(){ return true}
	},
	{
		type: 'confirm',
		name: 'eslint',
		message: '是否开启 Elint'
	},

*/
const options = [
	{
		type: 'list',
		name: 'options',
		message: '配置选项',
		choices: [
			{
				name: '默认端口',
				value: smartConfig.PORT
			},
			{
				name: '默认主机',
				value: smartConfig.HOST
			},
			{
				name: '代码检测',
				value: smartConfig.ESLINT
			},
			{
				name: '打包目录',
				value: structure.BUILD_DIR
			},
			{
				name: '开发目录',
				value: src.NAME
			},
			{
				name: '页面目录',
				value: structure.PAGES_DIR
			},
			{
				name: '组件目录',
				value: structure.COMPONENTS_DIR
			},
			{
				name: '静态资源目录',
				value: src.ASSETS_DIR.NAME
			},
			{
				name: '图片目录',
				value: src.ASSETS_DIR.IMAGES_DIR
			},
			{
				name: '字体目录',
				value: src.ASSETS_DIR.FONTS_DIR
			},
			{
				name: 'js目录',
				value: src.ASSETS_DIR.JS_DIR
			},
			{
				name: 'scss目录',
				value: src.ASSETS_DIR.SASS_DIR
			}
		]
	}

];

inquirer.prompt(options).then(function(answers){
	//task[answers.task](callback);
	console.log(answers);
});