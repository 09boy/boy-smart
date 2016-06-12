const HtmlWebpackPlugin = require('html-webpack-plugin');



/**
	* copy
	* @param target < object > 
	* @param deep < boolean >  default is true unless you set a value of boolean false
	* return new object || undefined
	*/
const copyObject = function(target,deep){

	if(typeof target !== 'object') {
		console.log('Arguemnt Error:: <target is object>');
		return;
	}

	deep = typeof deep === 'boolean' ? deep : true;

	var o = target instanceof Array ? [] : {};
	var value;
	for(var k in target){
		value = target[k];
		o[k] = deep ? typeof value !== 'object' ? value : copyObject(value,deep) : value;
	}
	return o;
};


exports.copyObject = copyObject;

/**
	* merge object
	* @param source < object > 
	* @param target < object >
	*/
const merge = function(source,target){

	if(typeof source !== 'object') {
		console.log('Arguemnt Error:: <source is object>');
		return;
	}

	const isSourceArr = source instanceof Array;

	if(typeof target !== 'object' || (target instanceof Array) !== isSourceArr) {
		console.log('Arguemnt Error:: <source and target are must be same type(Object)>');
		return;
	}

	var value,data,sourceValue;
	for(var k in target){
		value = target[k];
		sourceValue = source[k];
		data = value !== 'object' ? value : copyObject(value);

		if(!isSourceArr){
			
			if(source[k] && source[k] instanceof Array && data instanceof Array){
				merge(sourceValue,data);
			}else{
				source[k] = data;
			}


		}else{

			if(sourceValue instanceof Array){

				for(var n in data){
					const child_data = data[n];
					const index = sourceValue.indexOf(child_data);
					if(index > -1){
						sourceValue[index] = child_data;
					}else{
						sourceValue.push(child_data);
					}
				}

			}else{
				source[k] = data;
			}

		}
	}
};

/**
 * override same value
 * @param source <array>
 * @param target <array>
 */
const filterArray = function(source,target){

	if(!(source instanceof Array)) { return;}
	if(!(target instanceof Array)) { return;} 

	for(var k in target){
		var data = target[k];
		var index = source.indexOf(data);
		if(index > -1){ source[index] = data; }
		else{ source.push(data);}
	}
};

exports.filterArray = filterArray;


const sourceObj = { name: 'Beijing', cities: ['ChaoYang','HaiDian','WangJing'] };
const targetObj = { name: 'Tianjing', codes: [ 1001, 1002] };
const sourceArr = [ 1, 'string' , false, {object:'type-object'}, ['type-array'] ];
const targetArr = [ true ];
const emptyObj = {};
const emptyArr = [];

merge(emptyObj,targetObj);

exports.merge = merge;

/*
	{ options:
   { template: '/Users/minqin/personal/repository/boy-smart/node_modules/html-webpack-plugin/default_index.ejs',
     filename: 'index.html',
     hash: false,
     inject: true,
     compile: true,
     favicon: false,
     minify: false,
     cache: true,
     showErrors: true,
     chunks: 'all',
     excludeChunks: [],
     title: 'Webpack App',
     xhtml: false } }

*/



//Generate HTML
exports.getHTMLTemplate = function(option){

	option = option instanceof Object ? option : {chunks:[],filename:'index.html',title:'SPA | Single page application',keywords:'SEO keywords',description:'SEO website\'s description'};


	// return new HtmlWebpackPlugin({
	// 	chunks: option.chunks,
	// 	filename: option.filename,
	// 	title: option.title,
	// 	template: option.template,
	// 	// inject: 'body'
	// 	keywords: option.keywords,
	// 	description: option.description,
	// 	viewport: option.viewport,	
	// 	favicon: option.favicon
	// });
};

exports.resolvePath = function (target){

	var queryStr = '',
			queryStart = target.indexOf('/');
	if(queryStart > -1){
		queryStr = target.substr(queryStart);
		target = target.substr(0,queryStart);
	}

	return require.resolve(target) + queryStr;
};