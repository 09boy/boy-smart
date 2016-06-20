const path = require('path');
const fs = require('fs');

const server = require('../server/server.js');
//const merge = require('./utils.js').merge;

require('shelljs/global');


var smartConfig,
		structrueObj,
		smartName,
		ROOT_PATH;

var webpack,
		mocha;

var tempDirPath;
const createProjectStructure = function(dirObj,dirPath){

	var value;
	dirPath = dirPath || '';
	for(var k in dirObj){
		value = dirObj[k];
		if(typeof value === 'object'){
			createProjectStructure(value,dirPath + value.NAME + '/');
		}else{

			tempDirPath = k !== 'NAME' ? dirPath + value : dirPath;
			mkdir('-p',path.join(ROOT_PATH,tempDirPath));
		}
	}
};

const initialization = function(){
	
	if(checkInitialize()) { return; }
	console.log('initialization project directories...');
	createProjectStructure(structrueObj);
	createPage('index');
	createMockConfigFile();
};

const checkInitialize = function(){

	const hasPackageFile = test('-e',ROOT_PATH + '/package.json');
	if(!hasPackageFile){
		console.log('installing project dependences package...');
		cp(path.join(__dirname,'..','smart-install/package.json'),ROOT_PATH);
		exec('npm install');
	}else{
		//console.log('merge package');
	}
	if(!test('-e',ROOT_PATH + '/' + structrueObj.SRC_DIR.NAME)){ return false;}
	return true;
};

const createPage = function(name){

	const pageDirPath = structrueObj.SRC_DIR.NAME + '/' + structrueObj.SRC_DIR.PAGES_DIR;
	if(!test('-e',path.join(ROOT_PATH,pageDirPath,name))){
		console.log('Generate ' + name + ' folder');
		//mkdir('-p',path.join(ROOT_PATH,pageDirPath,name));
		cp('-R',path.join(__dirname,'..','templates/page'),ROOT_PATH + '/' + pageDirPath);
		mv(ROOT_PATH + '/' + pageDirPath + '/page',ROOT_PATH + '/' + pageDirPath + '/' + name);
	}else{
		console.log(name + ' folder was already exist.');
	}
};

const createMockConfigFile = function(){
	if(!test('-e',path.join(ROOT_PATH,'mock.config.js'))){
		cp(path.join(__dirname,'..','templates/mock.config.template.js'),ROOT_PATH);
		mv(ROOT_PATH + '/mock.config.template.js', ROOT_PATH + '/mock.config.js');
	}
};

const executeWebpack = function(){

	exec(webpack + ' --config ' + path.join(__dirname, '..', 'webpack', 'config.js') + ' --progress --colors --inline');
};

const run = function(){

	//console.log(process.pid);
	initialization();	
	if(process.env.MODE !== 'development') { executeWebpack(); }
	server.start(smartConfig);
};

const task = {

	// 开发调试
	start: function(){

		console.log('task: start');
		process.env.MODE = 'development';
		run();
	},
	// 单元测试
	test: function(){

		console.log('task: test');
		process.env.MODE = 'test';
		//  + 'js:babel-core/register '
		exec(mocha + ' ' + path.join(ROOT_PATH,structrueObj.SRC_DIR.NAME,structrueObj.SRC_DIR.TEST_DIR) + ' --recursive --colors --reporter mochawesome') // --watch --reporter-options reportDir=
	},
	// 打包 ｜ 内测，公测，生产
	release: function(answers){

		var pack;
		if(!answers){
			const packs = ['devel','public','production'];
			pack = process.argv.splice(3)[0];
			if(packs.indexOf(pack) < 0) {
				console.log('Argument Error: devel or public or production');
				return;
			}
		}else {
			pack = answers.pack;
		}
		console.log('task: ' + pack);
		process.env.MODE =  pack;//'production';
		run();
	},
	// 创建新页面
	page: function(answers){

		initialization();
		const pagesData = !answers ? process.argv.splice(3) : answers.pageNames;
		pagesData.map(createPage);
		console.log('task: page');
		// server.restart(smartConfig);
	},
	// 创建新组建
	component: function(){
		console.log('开发中...');
		//console.log('task: component');
		//initialization();
	}
};

const taskObject = function(_smartConfig){

	smartConfig = _smartConfig;
	structrueObj = smartConfig.PROJECT_STRUCTURE;
	ROOT_PATH = smartConfig.ROOT_PATH;
	smartName = smartConfig.NAME;
	webpack = path.join(__dirname, '..', '..' ,'node_modules', '.bin', 'webpack');
	mocha = path.join(__dirname, '..', '..', 'node_modules', '.bin','mocha');
	return task;
};

module.exports = taskObject;