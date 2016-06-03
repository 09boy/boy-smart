const path = require('path');
const fs = require('fs');

const server = require('../server/server.js');

require('shelljs/global');


// start test release pro page component 

/*
check node_modules --» true --» execute task ---|___ start
									|                    ^        |
									◊                    |        |___ test
								false                  |        |
									|                    |        |___ dev  
									◊                    |        |
									|                    |        |___ release
					execute npm install          |        |
									|                    |        |___ page
									|                    |        |
									|                    |        |___ component
									◊                    |
		   create project directories      |
		   						|										 |
		   						◊____________________|						
*/


// var isInitializeSmart = false;

var smartConfig,
		structrueObj,
		smartName,
		ROOT_PATH;
// use webpack in node_modules/.bin/webpack
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
};

const copyHideConfigFile = function(){
	cp(path.join(__dirname,'..','smart-install/.babelrc'),ROOT_PATH);
	cp(path.join(__dirname,'..','smart-install/.gitignore'),ROOT_PATH);
};

const checkInitialize = function(){

	//test('-e',ROOT_PATH + '/bin')
	const hasPackageFile = test('-e',ROOT_PATH + '/package.json');
	if(!hasPackageFile){
		console.log('installing project dependences package...');
		cp(path.join(__dirname,'..','smart-install/package.json'),ROOT_PATH);
		exec('npm install');
	}else{
		//console.log('merge package');
	}
		//copyHideConfigFile();
		//fs.writeFile(path.join(ROOT_PATH,'node_modules',smartName,'bin/smart-install','install.json'),JSON.stringify({isInstall:true}),'utf8');
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

const executeWebpack = function(){

	exec(webpack + ' --config ' + path.join(__dirname, '..', 'webpack', 'config.js') + ' --progress --colors --inline');

	// test : mocha & chai
	// mocha + ' --config ' + path.join(__dirname, '..', 'webpack', 'config.js');
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
		run();
	},
	// 预发布
	dev: function(){

		console.log('task: dev');
		process.env.MODE = 'dev';
		run();
	},
	// 打包 ｜ 生产环境
	release: function(){

		console.log('task: release');
		process.env.MODE = 'production';
		run();
	},
	// 创建新页面
	page: function(MODE){

		console.log('task: page');
		initialization();
		const pagesData = process.argv.splice(3);
		pagesData.map(createPage);
		server.restart(smartConfig);
	},
	// 创建新组建
	component: function(){

		console.log('task: component');
		initialization();
	}
};

const taskObject = function(_smartConfig){

	smartConfig = _smartConfig;
	structrueObj = smartConfig.PROJECT_STRUCTURE;
	ROOT_PATH = smartConfig.ROOT_PATH;
	smartName = smartConfig.NAME;
	webpack = path.join(__dirname, '..', '..' ,'node_modules', '.bin', 'webpack');
	mochaf = path.join(__dirname, '..', '..', 'node_modules', '.bin','mocha');
	return task;
};

module.exports = taskObject;