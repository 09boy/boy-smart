const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

require('shelljs/global');

var smartConfig,
		pageNames;

const mapNewPage = function(names){

	const ROOT_PATH = smartConfig.ROOT_PATH;
	const srcStructure = smartConfig.PROJECT_STRUCTURE.SRC_DIR;

	const pages = ls(path.join(ROOT_PATH,srcStructure.NAME,srcStructure.PAGES_DIR));
	names = names.trim().split(' ');

	if(names.length == 1 ) { return pages.indexOf(names[0]) > -1 ? true : false;}

	pages.forEach(function(name){

		for(var i = 0; i < names.length; i++){
			if(name === names[i]) {
				//console.log(name,' was existing ');
				names.splice(i,1);
				continue;
			}
		}
	});

	if(!names.length) { return true}

	pageNames = names;
	return false;
};

function isExist(names){

	if(names === '') return false;

	// try{
	// 	names.map(function(name){
	// 		fs.statSync(path.join(ROOT_PATH,srcStructure.NAME,srcStructure.PAGES_DIR,name))
	// 	});
		
	// }catch(e){ return false;}

	return mapNewPage(names);
}

const task = {

	test: function(){

	},
	release: function(callback){
		
		inquirer
			.prompt([{
				type: 'list',
				name: 'pack',
				message: '打包环境',
				choices: [{
					name: '内测',
					value: 'devel'
				},{
					name: '公测',
					value: 'public'
				},{
					name: '正式',
					value: 'production'
				}]
			}])
			.then(function(answers){
				//console.log(answers)
				answers.task = 'release';
				callback(answers);
			});
	},
	page: function(callback){

		inquirer
			.prompt([{
        type: 'input',
        name: 'pageNames',
        message: '请输入页面的名称 ｜ 多个页面名称用空格隔开: [英文]',
        validate: function(value) {

          if(isExist(value)) { return "文件已存在"; }
          if(!value && !value.length) { return '输入页面名称'; }
          return true;
        }
      }])
      .then(function(answers){

      	answers.pageNames = !pageNames ? answers.pageNames.split(' ') : pageNames;
      	answers.task = 'page';
      	//console.log('create pages',answers.pageNames);
        callback(answers);
      });
	},
	component: function(){

	}
};

const options = [
	{
		type: 'list',
		message: '选择需要的操作选项',
		name: 'task',
		choices: [
			{
				name: '开发调试',
				value: 'start'
			},
			{
				name: '单元测试',
				value: 'test'
			},
			/*{
				name: '内测环境',
				value: 'dev'
			},*/
			{
				name: '项目打包',
				value: 'release'
			},
			{
				name: '新建页面',
				value: 'page'
			},
			{
				name: '新建组件',
				value: 'component'
			}/*,
			{
				name: '升    级',
				value: 'upgrade'
			}*/
		]
	}
];

const help = function(callback,_smartConfig){

	//inquirer.prompt(options).then(callback);

	smartConfig = _smartConfig;
	/*callback = typeof callback === 'function' ? callback : function(answers){
		console.log(JSON.stringify(answers,null, '  '));
	};*/

	inquirer.prompt(options).then(function(answers){
		//console.log(answers);
		task[answers.task](callback);
	});
};

module.exports = {help:help};