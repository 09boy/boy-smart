const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

require('shelljs/global');

var smartConfig,
		pageNames;

/**
 * @param names <String>
 * *.多个名称用一个空格隔开
 */
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

const isExist = function (names){

	if(names === '') return false;

	// try{
	// 	names.map(function(name){
	// 		fs.statSync(path.join(ROOT_PATH,srcStructure.NAME,srcStructure.PAGES_DIR,name))
	// 	});
		
	// }catch(e){ return false;}

	return mapNewPage(names);
};

/**
 * @param -P | --port <Number>
 * @param -H | --host <String>
 * 注意：简写区分大小写（为了和 cli 保持一致）; 先参后值，参和值之间用一个空格隔开
 * 无参数，使用默认 port & host
 * 参数名无效，同上
 * 参数值无效，重新设置
 */
const checkPortAndHost = function(value){

	value = value.trim();
	if(value === '') return true;

	const values = value.split(' ');
	const p = values.indexOf('-P');
	const port = values.indexOf('--port');
	const h = values.indexOf('-H');
	const host = values.indexOf('--host');

	if(p < 0 && port < 0 && h < 0 && host<0){
		console.log('  无效参数，启动并用默认值!');
		return true;
	}
	if(p > -1 || port >-1){
		const _p = p > -1 ? values[p+1] : values[port+1];
		if(isNaN(_p) || (_p.length !== 4)) {
			console.log('  Argument Error:: port 是一个4位的数字!');
			return false;
		}
		smartConfig.PORT = _p;
	}

	if(h > -1 || host > -1){
		const _h = h > -1 ? values[h+1] : values[host+1];
		if(!_h) {
			console.log('  Argument Error:: host 无效的值!');
			return false
		}
		smartConfig.HOST = _h;
	}

	return true;
};

const setPortHost = function(callback,message,task,pack){

	inquirer
		.prompt([{
			type: 'input',
			name: 'task',
			message: message || '端口,主机设置 <-P,-H> [default port: ' + smartConfig.PORT + ', host: ' + smartConfig.HOST + ']',
			validate: checkPortAndHost
		}])
	  .then(function(answers){
	  	if(pack) { answers.pack = pack;}
	  	answers.task = task;
	  	console.log('start',answers,pack);
	  	callback(answers);
	  });
};

const task = {

	start: function(callback){

		setPortHost(callback,null,'start');
	},
	test: function(callback){

		callback({task:'test'});
	},
	release: function(callback){
		
		inquirer
			.prompt([{
				type: 'list',
				name: 'pack',
				message: '选择打包环境',
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
				// console.log(answers)
				setPortHost(callback,null,'release',answers.pack);
			});
	},
	page: function(callback){

		inquirer
			.prompt([{
        type: 'input',
        name: 'pageNames',
        message: '输入页面名称 <多个名称用空格隔开>: [英文]',
        validate: function(value) {

          if(isExist(value)) { return "文件已存在"; }
          if(!value && !value.length) { return '输入页面名称'; }
          return true;
        }
      }])
      .then(function(answers){

      	answers.pageNames = !pageNames ? answers.pageNames.split(' ') : pageNames;
      	answers.task = 'page';
      	console.log('create pages',answers.pageNames);
        callback(answers);
      });
	},
	component: function(callback){

		callback({task: 'component'});
	}/*,
	'structrue-config': function(){
		
		require('./project.structure.config.js');
	}*/
};

const options = [
	{
		type: 'list',
		message: '你要干神么?',
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
				name: '开发配置',
				value: 'structrue-config'
			}*/
		]
	}
];

const help = function(callback,_smartConfig){

	smartConfig = _smartConfig;
	inquirer.prompt(options).then(function(answers){
		task[answers.task](callback);
	});
};

module.exports = {help:help};