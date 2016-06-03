const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

require('shelljs/global');

var smartConfig;

function isExist(names){

	if(names === '') return false;

	const ROOT_PATH = smartConfig.ROOT_PATH;
	const srcStructure = smartConfig.PROJECT_STRUCTURE.SRC_DIR;

	const pagesPath = path.join(ROOT_PATH,srcStructure,srcStructure.PAGES_DIR);
	const pages = ls(pagesPath);


	names = names.trim().split(' ');

	

	try{
		names.map(function(name){
			fs.statSync(path.join(ROOT_PATH,srcStructure.NAME,srcStructure.PAGES_DIR,name))
		});
		
	}catch(e){ return false;}

  return true;
}

const task = {

	test: function(){

	},
	release: function(){
		console.log('hahahah');
	},
	page: function(){

		inquirer
			.prompt([{
        type: 'input',
        name: 'pageNames',
        message: '请输入页面的名称 ｜ 多个页面名称用空格隔开: [英文]',
        validate: function(value) {

        	console.log('validate::',isExist(value),value);
          if(isExist(value)) {
              return "该文件已存在, 换一个名字吧";
          }
          if(!value && !value.length) {
              return "Smart 需要您提供页面名称";
          }
          return true;
        }
      }])
      .then(function(answers){
      	console.log('create page',answers.pageNames.trim());
        //task.page(answers.pageNames);
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

	inquirer.prompt(options).then(callback);

	//smartConfig = _smartConfig;
	/*callback = typeof callback === 'function' ? callback : function(answers){
		console.log(JSON.stringify(answers,null, '  '));
	};*/

	// inquirer.prompt(options).then(function(answers){
	// 	//console.log(answers);
	// 	task[answers.task](callback);
	// 	/*if(answers.task !== 'release'){
	// 		callback(answers);
	// 	}else{
			
	// 	}*/
	// });
};

module.exports = {help:help};